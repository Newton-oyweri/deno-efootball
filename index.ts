Deno.serve((req: Request) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") || "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>eFootball Kenya League</title>
  
  <meta property="og:title" content="eFootball Kenya League">
  <meta property="og:description" content="Join the squad now!">
  <meta property="og:image" content="https://computerscience.website/assets/efkl.png">
  <meta property="og:url" content="${url.href}">
</head>
<body style="background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif">
  <div style="text-align:center">
    <h1>Loading Tournament...</h1>
    ${id ? `<p>ID: ${id}</p>` : ''}
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  });
});
