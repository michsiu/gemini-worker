// Gemini CLI OpenAI Worker - 完整修复版
console.log("Worker started");

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

    // CORS 处理
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }

    // 健康检查
    if (url.pathname === "/health") {
      return Response.json({ status: "ok" });
    }

    // API Key 验证（可选）
    if (env.OPENAI_API_KEY) {
      const auth = request.headers.get("Authorization");
      if (!auth || auth !== `Bearer ${env.OPENAI_API_KEY}`) {
        return Response.json({ error: { message: "Invalid API key" } }, { status: 401 });
      }
    }

    // 模型列表
    if (url.pathname === "/v1/models" && request.method === "GET") {
      const data = Object.keys(MODELS).map(id => ({
        id, object: "model", created: Math.floor(Date.now() / 1000), owned_by: "google"
      }));
      return Response.json({ object: "list", data });
    }

    // Chat Completions 核心路由
    if (url.pathname === "/v1/chat/completions" && request.method === "POST") {
      console.log("Chat completions request received");
      
      try {
        const body = await request.json();
        const model = body.model || "gemini-2.5-flash";
        const messages = body.messages || [];
        const stream = body.stream !== false;

        if (!messages.length) {
          console.error("Validation error: messages is empty");
          return Response.json({ error: "messages is a required field" }, { status: 400 });
        }
        if (!MODELS[model]) {
          console.error(`Validation error: model ${model} not found`);
          return Response.json({ error: `Model ${model} not found` }, { status: 400 });
        }

        console.log(`Getting access token for model: ${model}`);
        const accessToken = await getAccessToken(env);
        console.log("Access token obtained successfully");

        const projectId = env.GEMINI_PROJECT_ID || await discoverProjectId(accessToken);
        console.log(`Using project ID: ${projectId}`);

        // 转换消息格式
        const contents = messages.map(msg => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content) }]
        }));

        if (stream) {
          console.log("Starting streaming response");
          return streamResponse(model, projectId, contents, accessToken, env);
        } else {
          console.log("Starting non-streaming response");
          return nonStreamResponse(model, projectId, contents, accessToken, env);
        }
      } catch (e) {
        // 这是最关键的日志，会输出具体的报错内容
        console.error("Top-level error:", e.message || e);
        console.error("Error stack:", e.stack || "no stack");
        return Response.json({ error: e.message || "Internal error" }, { status: 500 });
      }
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  }
};

// 获取/刷新 Access Token
async function getAccessToken(env) {
  console.log("Checking KV cache for token...");
  try {
    // 1. 检查 KV 缓存
    const cached = await env.GEMINI_CLI_KV.get(KV_TOKEN_KEY, "json");
    if (cached && cached.expiry_date && cached.expiry_date > Date.now() + 300000) {
      console.log("Using cached token");
      return cached.access_token;
    }
    console.log("No valid cached token found");
  } catch (kvError) {
    console.error("KV cache read error:", kvError.message || kvError);
  }

  // 2. 解析 Service Account
  let creds;
  try {
    console.log("Parsing GCP_SERVICE_ACCOUNT...");
    creds = JSON.parse(env.GCP_SERVICE_ACCOUNT);
    console.log("GCP_SERVICE_ACCOUNT parsed successfully");
  } catch (parseError) {
    console.error("Failed to parse GCP_SERVICE_ACCOUNT:", parseError.message || parseError);
    throw new Error("Failed to parse GCP_SERVICE_ACCOUNT: " + (parseError.message || parseError));
  }

  // 3. 检查原始 token 是否有效
  if (creds.expiry_date && creds.expiry_date > Date.now() + 300000) {
    console.log("Using original token from service account");
    try {
      await env.GEMINI_CLI_KV.put(KV_TOKEN_KEY, JSON.stringify({
        access_token: creds.access_token,
        expiry_date: creds.expiry_date
      }), { expirationTtl: 3300 });
    } catch (kvError) {
      console.error("KV cache write error:", kvError.message || kvError);
    }
    return creds.access_token;
  }

  // 4. 刷新 Token
  console.log("Refreshing token...");
  console.log("Using Client ID:", env.OAUTH_CLIENT_ID ? env.OAUTH_CLIENT_ID.substring(0, 20) + "..." : "NOT SET");
  console.log("Using Client Secret:", env.OAUTH_CLIENT_SECRET ? "SET (hidden)" : "NOT SET");
  console.log("Refresh token available:", creds.refresh_token ? "YES" : "NO");

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
    console.error("Token refresh failed with status:", refreshResp.status);
    console.error("Error response:", JSON.stringify(refreshData));
    throw new Error("Token refresh failed: " + JSON.stringify(refreshData));
  }

  if (!refreshData.access_token) {
    console.error("No access_token in refresh response:", JSON.stringify(refreshData));
    throw new Error("No access_token in refresh response");
  }

  console.log("Token refreshed successfully");

  // 5. 缓存新 token
  const newExpiry = Date.now() + (refreshData.expires_in || 3600) * 1000;
  try {
    await env.GEMINI_CLI_KV.put(KV_TOKEN_KEY, JSON.stringify({
      access_token: refreshData.access_token,
      expiry_date: newExpiry
    }), { expirationTtl: 3300 });
  } catch (kvError) {
    console.error("KV cache write error:", kvError.message || kvError);
  }

  return refreshData.access_token;
}

// 发现项目 ID
async function discoverProjectId(accessToken) {
  console.log("Discovering project ID...");
  const resp = await fetch(`${CODE_ASSIST_ENDPOINT}/v1internal:loadCodeAssist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({})
  });
  const data = await resp.json();
  console.log("Project ID response:", JSON.stringify(data).substring(0, 100));
  return data.cloudaicompanionProject;
}

// 流式响应
async function streamResponse(model, projectId, contents, accessToken, env) {
  try {
    console.log("Sending stream request to Gemini...");
    const resp = await fetch(`${CODE_ASSIST_ENDPOINT}/v1internal:streamGenerateContent?alt=sse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ model, project: projectId, request: { contents } })
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Gemini API stream error:", resp.status, errorText);
      throw new Error(`Gemini API error (${resp.status}): ${errorText}`);
    }

    console.log("Stream response received");
    return new Response(resp.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (e) {
    console.error("Stream processing error:", e.message || e);
    return Response.json({ error: e.message }, { status: 502 });
  }
}

// 非流式响应
async function nonStreamResponse(model, projectId, contents, accessToken, env) {
  try {
    console.log("Sending non-stream request to Gemini...");
    const resp = await fetch(`${CODE_ASSIST_ENDPOINT}/v1internal:streamGenerateContent?alt=sse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({ model, project: projectId, request: { contents } })
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Gemini API non-stream error:", resp.status, errorText);
      throw new Error(`Gemini API error (${resp.status}): ${errorText}`);
    }

    const text = await resp.text();
    const lines = text.split("\n").filter(l => l.startsWith("data: "));
    let content = "";
    
    for (const line of lines) {
      try {
        const data = JSON.parse(line.slice(6));
        data.response?.candidates?.[0]?.content?.parts?.forEach(p => { 
          if (p.text) content += p.text; 
        });
      } catch (e) {
        console.error("Error parsing line:", line.substring(0, 50), e.message);
      }
    }

    return Response.json({
      id: `chatcmpl-${crypto.randomUUID()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [{ 
        index: 0, 
        message: { role: "assistant", content }, 
        finish_reason: content ? "stop" : "error" 
      }]
    });
  } catch (e) {
    console.error("Non-stream processing error:", e.message || e);
    return Response.json({ error: e.message }, { status: 502 });
  }
}