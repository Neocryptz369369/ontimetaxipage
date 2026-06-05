// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const SID  = Deno.env.get('TWILIO_ACCOUNT_SID')!
const TOK  = Deno.env.get('TWILIO_AUTH_TOKEN')!
const FROM = Deno.env.get('TWILIO_FROM_NUMBER')!

serve(async (req) => {
  try {
    const { to, body } = await req.json()
    if (!to || !body) return json({ error: 'to and body required' }, 400)

    const form = new URLSearchParams({ To: to, From: FROM, Body: body })
    const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${SID}:${TOK}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    })
    const data = await r.json()
    if (!r.ok) return json({ error: data?.message || 'twilio error', data }, 502)
    return json({ ok: true, sid: data.sid })
  } catch (e: any) {
    return json({ error: String(e?.message ?? e) }, 500)
  }
})

function json(b: any, s = 200) {
  return new Response(JSON.stringify(b), { status: s, headers: { 'content-type': 'application/json' } })
}
