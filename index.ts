import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// Function to compress Supabase images on-the-fly for WhatsApp's 300KB limit
function getOptimizedImageUrl(supabaseUrl: string, originalUrl: string): string {
  if (!originalUrl) return "https://computerscience.website/assets/efkl.png";
  
  // If it's a Supabase storage URL, we can use their built-in image transform API
  if (originalUrl.includes("/storage/v1/object/public/")) {
    const bucketAndPath = originalUrl.split("/storage/v1/object/public/")[1];
    const [bucket, ...pathParts] = bucketAndPath.split("/");
    const filePath = pathParts.join("/");
    
    // Returns a compressed, resized version (approx 40-80KB) perfect for WhatsApp
    return `${supabaseUrl}/storage/v1/render/image/public/${bucket}/${filePath}?width=400&height=400&resize=contain&quality=80`;
  }
  
  return originalUrl;
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return new Response("ID required", { status: 400 })
  }

  const userAgent = req.headers.get("user-agent") || ""
  
  // 1. Precise Bot Detection (WhatsApp, Facebook, Discord, Twitter/X, Telegram)
  const isBot = /WhatsApp|facebookexternalhit|Twitterbot|Discordbot|TelegramBot|Slackbot|LinkedInBot/i.test(userAgent)
  const redirectUrl = "https://efootballkenyaleague.website/register"

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data: reg } = await supabase
    .from('registrations')
    .select('name, avatar_url, registration_amount')
    .eq('id', id)
    .single()

  const title = escapeHtml(reg?.name || "eFootball Kenya League")
  
  // Apply our on-the-fly compression so WhatsApp doesn't reject it
  const rawImage = reg?.avatar_url || "https://computerscience.website/assets/efkl.png"
  const image = getOptimizedImageUrl(supabaseUrl, rawImage)

  const desc = escapeHtml(reg 
    ? `Entry Fee: KES ${reg.registration_amount}. Join the eFootball Kenya League squad!`
    : "Click to view tournament details and register.")

  // 2. If a REAL Human is opening the link, send them straight to the site instantly
  if (!isBot) {
    return Response.redirect(redirectUrl, 302)
  }

  // 3. If a BOT (WhatsApp crawler) is reading the link, return ONLY clean metadata
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
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
</head>
<body></body>
</html>`

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" }
  })
})
