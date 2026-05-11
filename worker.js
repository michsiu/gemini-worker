export default {
  async fetch(request) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head><title>我的小应用</title></head>
    <body>
      <h1>你好，这是 Worker 返回的页面</h1>
      <p>我可以做任何事</p>
    </body>
    </html>`;
    
    return new Response(html, {
      headers: { "Content-Type": "text/html" }
    });
  }
};