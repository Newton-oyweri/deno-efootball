import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve((req: Request) => {
  return new Response(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>eFootball Kenya League</title>
  
  <meta property="og:title" content="eFootball Kenya League">
  <meta property="og:description" content="Join the squad!">
  <meta property="og:image" content="https://computerscience.website/assets/efkl.png">
  <meta property="og:type" content="website">

  <script>
    window.location.href = "https://efootballkenyaleague.website";
  </script>
</head>
<body style="background:#000;color:white;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif">
  <h1>Loading...</h1>
</body>
</html>
  `, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  })
})
