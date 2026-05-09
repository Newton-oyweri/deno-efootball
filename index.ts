import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve((req: Request) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>eFootball Share Test</title>
      <meta property="og:title" content="Test Title">
      <meta property="og:description" content="Test Description">
    </head>
    <body style="background:#000;color:white;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif">
      <div style="text-align:center">
        <h1>✅ Deno Deploy is Working!</h1>
        <p>ID received: ${id || 'None'}</p>
        <p><a href="?id=test123">Test with ID</a></p>
      </div>
    </body>
    </html>
  `, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  })
})
