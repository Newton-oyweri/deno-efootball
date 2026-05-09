import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return new Response("ID required", { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  )

  const { data: reg } = await supabase
    .from('registrations')
    .select('name, avatar_url, registration_amount')
    .eq('id', id)
    .single()

  const title = escapeHtml(reg?.name || "eFootball Kenya League")
  const image = reg?.avatar_url || "https://computerscience.website/assets/efkl.png"
  const desc = escapeHtml(reg 
    ? `Entry Fee: KES ${reg.registration_amount}. Join the eFootball Kenya League squad!`
    : "Click to view tournament details and register.")

  const redirectUrl = `https://efootballkenyaleague.website/registration/${id}`

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="${image}">
  <meta property="og:url" content="${redirectUrl}">
  <meta property="og:type" content="website">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${image}">

  <script>window.location.replace("${redirectUrl}");</script>
  <meta http-equiv="refresh" content="0;url=${redirectUrl}">
</head>
<body style="background:#000;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif">
  <div style="text-align:center">
    <h2>Loading Tournament...</h2>
  </div>
</body>
</html>`

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  })
})
