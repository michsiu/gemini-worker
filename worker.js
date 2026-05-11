// Gemini CLI OpenAI Worker - 完整终版
const OAUTH_REFRESH_URL = "https://oauth2.googleapis.com/token";
const CODE_ASSIST_ENDPOINT = "https://cloudcode-pa.googleapis.com";
const KV_TOKEN_KEY = "oauth_token_cache";
const MY_PROJECT_ID = "gen-lang-client-0942663164";

const MODELS = {
  "gemini-2.5-pro": { maxTokens: 65536, contextWindow: 1048576 },
  "gemini-2.5-flash": { maxTokens: 65536, contextWindow: 1048576 },
  "gemini-2.5-flash-lite": { maxTokens: 65536, contextWindow: 1048576 }
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }

    if (url.pathname === "/health") {
      return Response.json({ status: "ok" });
    }

    if (env.OPENAI_API_KEY) {
      const auth = request.headers.get("Authorization");
      if (!auth || auth !== `Bearer ${env.OPENAI_API_KEY}`) {
        return Response.json({ error: { message: "Invalid API key" } }, { status: 401 });
      }
    }

    if (url.pathname === "/v1/models" && request.method === "GET") {
      const data = Object.keys(MODELS).map(id => ({
        id, object: "model", created: Math.floor(Date.now() / 1000), owned_by: "google"
      }));
      return Response.json({ object: "list", data });
    }

    if (url.pathname === "/v1/chat/completions" && request.method === "POST") {
      try {
        const body = await request.json();
        const model = body.model || "gemini-2.5-flash";
        const messages = body.messages || [];
        const stream = body.stream !== false;

        if (!messages.length) {
          return Response.json({ error: "messages is a required field" }, { status: 400 });
        }

        const accessToken = await getAccessToken(env);
        const projectId = MY_PROJECT_ID;
        
        const contents = messages.map(msg => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content) }]
        }));

        const geminiResp = await fetch(`${CODE_ASSIST_ENDPOINT}/v1internal:streamGenerateContent?alt=sse`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ model, project: projectId, request: { contents } })
        });

        if (!geminiResp.ok) {
          const errText = await geminiResp.text();
          return Response.json({
            error: `Gemini API error (${geminiResp.status}): ${errText.substring(0, 500)}`
          }, { status: 500 });
        }

        return new Response(geminiResp.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Access-Control-Allow-Origin": "*"
          }
        });
      } catch (e) {
        return Response.json({
          error: "Error: " + (e.message || String(e))
        }, { status: 500 });
      }
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  }
};

async function getAccessToken(env) {
  let creds;
  try {
    creds = JSON.parse(env.GCP_SERVICE_ACCOUNT);
  } catch (e) {
    throw new Error("GCP_SERVICE_ACCOUNT parse failed: " + e.message);
  }

  try {
    const cached = await env.GEMINI_CLI_KV.get(KV_TOKEN_KEY, "json");
    if (cached && cached.expiry_date && cached.expiry_date > Date.now() + 300000) {
      return cached.access_token;
    }
  } catch (e) {}

  if (creds.expiry_date && creds.expiry_date > Date.now() + 300000) {
    return creds.access_token;
  }

  const refreshResp = await fetch(OAUTH_REFRESH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.OAUTH_CLIENT_ID,
      client_secret: env.OAUTH_CLIENT_SECRET,
      refresh_token: creds.refresh_token,
      grant_type: "refresh_token"
    })
  });

  const refreshData = await refreshResp.json();

  if (!refreshResp.ok) {
    throw new Error("Token refresh failed: " + JSON.stringify(refreshData));
  }

  const newExpiry = Date.now() + (refreshData.expires_in || 3600) * 1000;
  try {
    await env.GEMINI_CLI_KV.put(KV_TOKEN_KEY, JSON.stringify({
      access_token: refreshData.access_token,
      expiry_date: newExpiry
    }), { expirationTtl: 3300 });
  } catch (e) {}

  return refreshData.access_token;
}