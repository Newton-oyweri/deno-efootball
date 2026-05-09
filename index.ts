import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(() => {
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head><title>Test</title></head>
    <body>
      <h1>✅ Hello from Deno Deploy</h1>
      <p>If you see this, it's working.</p>
    </body>
    </html>
  `, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  })
})
