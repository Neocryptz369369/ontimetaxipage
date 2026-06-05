export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}
export const preflight = (req: Request) =>
  req.method === 'OPTIONS' ? new Response('ok', { headers: cors }) : null
