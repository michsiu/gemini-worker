// Gemini CLI OpenAI Worker - 调试版
const CODE_ASSIST_ENDPOINT = "https://cloudcode-pa.googleapis.com";

const MODELS = {
  "gemini-2.5-pro": { maxTokens: 65536, contextWindow: 1048576 },
  "gemini-2.5-flash": { maxTokens: 65536, contextWindow: 1048576 },
  "gemini-2.5-flash-lite": { maxTokens: 65536, contextWindow: 1048576 }
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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

        // 1. 刷新 Token 两次以确保拿到最新的绑定信息
        let accessToken, projData;
        try {
          const creds = JSON.parse(env.GCP_SERVICE_ACCOUNT);
          
          // 第一次刷新
          const refreshResp = await fetch("https://oauth2.googleapis.com/token", {
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
          if (!refreshResp.ok) throw new Error(JSON.stringify(refreshData));
          accessToken = refreshData.access_token;

          // 立即请求项目信息
          const projResp = await fetch(`${CODE_ASSIST_ENDPOINT}/v1internal:loadCodeAssist`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({ cloudaicompanionProject: undefined })
          });
          projData = await projResp.json();
          
        } catch (e) {
          return Response.json({ error: "Token/Project error: " + e.message }, { status: 500 });
        }

        const discoveredProject = projData.cloudaicompanionProject || "none";
        
        // 2. 使用发现的项目 ID 测试调用
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

        const respText = await geminiResp.clone().text();

        // 直接返回所有调试信息，方便你查看
        return Response.json({
          debug: {
            project_used_in_call: discoveredProject,
            gemini_status: geminiResp.status,
            gemini_first_400_chars: respText.substring(0, 400)
          }
        });

      } catch (e) {
        return Response.json({ error: "Uncaught error: " + (e.message || String(e)) }, { status: 500 });
      }
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  }
};