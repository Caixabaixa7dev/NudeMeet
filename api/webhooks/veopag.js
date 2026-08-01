import crypto from 'node:crypto'

export const config = {
  api: { bodyParser: false },
}

async function readRawBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(Buffer.from(chunk))
  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Metodo nao permitido.' })
  }

  const secret = process.env.VEOPAG_WEBHOOK_SECRET
  const signature = req.headers['x-webhook-signature'] || ''
  const timestamp = req.headers['x-webhook-timestamp'] || ''

  if (!secret) return res.status(500).json({ error: 'webhook nao configurado' })
  if (Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) > 300) {
    return res.status(401).json({ error: 'timestamp expirado' })
  }

  const rawBody = await readRawBody(req)
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody.toString('utf8')}`)
    .digest('hex')
  const receivedBuffer = Buffer.from(String(signature), 'hex')
  const expectedBuffer = Buffer.from(expected, 'hex')

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return res.status(401).json({ error: 'assinatura invalida' })
  }

  return res.status(200).json({ ok: true })
}
