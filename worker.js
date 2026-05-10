// Gemini CLI OpenAI Worker - 精简版
// 部署后访问 https://你的worker.workers.dev/v1/models 测试

const OAUTH_CLIENT_ID = "";
const OAUTH_CLIENT_SECRET = "";
const OAUTH_REFRESH_URL = "https://oauth2.googleapis.com/token";
const CODE_ASSIST_ENDPOINT = "https://cloudcode-pa.googleapis.com";
const KV_TOKEN_KEY = "oauth_token_cache";
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
        id, object: "model", created: Math.floor(Date.now()/1000), owned_by: "google"
      }));
      return Response.json({ object: "list", data });
    }

    if (url.pathname === "/v1/chat/completions" && request.method === "POST") {
      try {
        const body = await request.json();
        const model = body.model || "gemini-2.5-flash";
        const messages = body.messages || [];
        const stream = body.stream !== false;

        if (!messages.length) return Response.json({ error: "messages is required" }, { status: 400 });
        if (!MODELS[model]) return Response.json({ error: `Model ${model} not found` }, { status: 400 });

        const accessToken = await getAccessToken(env);
        const projectId = env.GEMINI_PROJECT_ID || await discoverProjectId(accessToken);

        const contents = messages.map(msg => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content) }]
        }));

        if (stream) {
          return streamResponse(model, projectId, contents, accessToken);
        } else {
          return nonStreamResponse(model, projectId, contents, accessToken);
        }
      } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
      }
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  }
};

async function getAccessToken(env) {
  const cached = await env.GEMINI_CLI_KV.get(KV_TOKEN_KEY, "json");
  if (cached && cached.expiry_date > Date.now() + 300000) {
    return cached.access_token;
  }

  const creds = JSON.parse(env.GCP_SERVICE_ACCOUNT);
  if (creds.expiry_date > Date.now() + 300000) {
    await env.GEMINI_CLI_KV.put(KV_TOKEN_KEY, JSON.stringify({
      access_token: creds.access_token, expiry_date: creds.expiry_date
    }), { expirationTtl: 3300 });
    return creds.access_token;
  }

  const refreshResp = await fetch(OAUTH_REFRESH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
      refresh_token: creds.refresh_token,
      grant_type: "refresh_token"
    })
  });

  const refreshData = await refreshResp.json();
  if (!refreshData.access_token) throw new Error("Token refresh failed: " + JSON.stringify(refreshData));

  const newExpiry = Date.now() + (refreshData.expires_in || 3600) * 1000;
  await env.GEMINI_CLI_KV.put(KV_TOKEN_KEY, JSON.stringify({
    access_token: refreshData.access_token, expiry_date: newExpiry
  }), { expirationTtl: 3300 });

  return refreshData.access_token;
}

async function discoverProjectId(accessToken) {
  const resp = await fetch(`${CODE_ASSIST_ENDPOINT}/v1internal:loadCodeAssist`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({})
  });
  const data = await resp.json();
  return data.cloudaicompanionProject;
}

async function streamResponse(model, projectId, contents, accessToken) {
  const resp = await fetch(`${CODE_ASSIST_ENDPOINT}/v1internal:streamGenerateContent?alt=sse`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ model, project: projectId, request: { contents } })
  });
  return new Response(resp.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

async function nonStreamResponse(model, projectId, contents, accessToken) {
  const resp = await fetch(`${CODE_ASSIST_ENDPOINT}/v1internal:streamGenerateContent?alt=sse`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ model, project: projectId, request: { contents } })
  });
  const text = await resp.text();
  const lines = text.split("\n").filter(l => l.startsWith("data: "));
  let content = "";
  for (const line of lines) {
    try {
      const data = JSON.parse(line.slice(6));
      data.response?.candidates?.[0]?.content?.parts?.forEach(p => { if (p.text) content += p.text; });
    } catch (e) {}
  }
  return Response.json({
    id: `chatcmpl-${crypto.randomUUID()}`,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{ index: 0, message: { role: "assistant", content }, finish_reason: "stop" }]
  });
}