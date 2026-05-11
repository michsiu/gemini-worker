// Gemini CLI OpenAI Worker - 调试版
const OAUTH_REFRESH_URL = "https://oauth2.googleapis.com/token";
const CODE_ASSIST_ENDPOINT = "https://cloudcode-pa.googleapis.com";

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

        if (!messages.length) {
          return Response.json({ error: "messages is required" }, { status: 400 });
        }

        // 刷新 Token
        const creds = JSON.parse(env.GCP_SERVICE_ACCOUNT);
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
          return Response.json({
            error: "Token刷新失败: " + JSON.stringify(refreshData)
          }, { status: 500 });
        }
        
        const accessToken = refreshData.access_token;

        // 先查项目发现
        const projResp = await fetch(`${CODE_ASSIST_ENDPOINT}/v1internal:loadCodeAssist`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({})
        });
        const projData = await projResp.json();
        
        // 用发现到的项目去调 Gemini
        const discoveredProject = projData.cloudaicompanionProject || "unknown";
        
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
          body: JSON.stringify({ model, project: discoveredProject, request: { contents } })
        });

        return Response.json({
          debug: {
            project_auto_discovered: discoveredProject,
            gemini_status: geminiResp.status,
            gemini_body_first_200_chars: (await geminiResp.clone().text()).substring(0, 200)
          }
        });

      } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
      }
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  }
};