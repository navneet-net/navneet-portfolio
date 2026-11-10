// Vercel serverless function: sends a Telegram message when someone opens the portfolio.
// Secrets live in Vercel Environment Variables, never in the page:
//   TELEGRAM_BOT_TOKEN  (from @BotFather)
//   TELEGRAM_CHAT_ID    (your own Telegram chat id)

const hits = new Map(); // best-effort rate limit per IP (resets when the function restarts)

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function clip(s, n) {
  return String(s == null ? '' : s).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, n);
}
const EMAIL = /^[A-Za-z0-9](?:[A-Za-z0-9._%+\-]{0,62}[A-Za-z0-9])?@(?:[A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;
const NAME = /^\p{L}[\p{L}\p{M} .'\u2019\-]{1,59}$/u;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method' });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return res.status(500).json({ ok: false, error: 'not_configured' });

  // Only accept calls coming from this same site.
  const origin = req.headers.origin || '';
  if (origin) {
    let oh = '';
    try { oh = new URL(origin).host; } catch (e) { /* ignore */ }
    if (oh !== req.headers.host) return res.status(403).json({ ok: false, error: 'origin' });
  }

  // Simple rate limit: 12 requests per minute per IP.
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000);
  if (recent.length >= 12) return res.status(429).json({ ok: false, error: 'rate' });
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) hits.clear();

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = null; } }
  if (!b || typeof b !== 'object') return res.status(400).json({ ok: false, error: 'body' });

  const name = clip(b.name, 60);
  const email = clip(b.email, 254);
  if (!NAME.test(name) || !EMAIL.test(email)) return res.status(400).json({ ok: false, error: 'invalid' });

  const event = b.event === 'resume_download' ? 'resume_download' : 'visit';
  const via = b.via === 'google' ? 'Google' : 'Form';
  const city = clip((() => { try { return decodeURIComponent(req.headers['x-vercel-ip-city'] || ''); } catch (e) { return ''; } })(), 60);
  const country = clip(req.headers['x-vercel-ip-country'] || '', 4);
  const place = [city, country].filter(Boolean).join(', ') || 'unknown';
  const when = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST';

  const title = event === 'resume_download' ? '\ud83d\udce5 Resume downloaded' : '\ud83d\udd14 New portfolio visitor';
  const lines = [
    '<b>' + title + '</b>',
    '<b>Name:</b> ' + esc(name),
    '<b>Email:</b> ' + esc(email),
    '<b>From:</b> ' + esc(clip(b.came_from, 40) || 'direct'),
    '<b>Signed in with:</b> ' + via,
    '<b>Place:</b> ' + esc(place),
    '<b>Time:</b> ' + esc(when),
    '<b>Device:</b> ' + esc(clip(b.device, 90)),
  ];

  try {
    const r = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text: lines.join('\n'), parse_mode: 'HTML', disable_web_page_preview: true }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) return res.status(502).json({ ok: false, error: 'telegram' });
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'network' });
  }
};
