import crypto from 'node:crypto'
import { createDeposit } from '../../serverless/veopag.js'

function getBody(req) {
  if (typeof req.body === 'string') return JSON.parse(req.body)
  return req.body || {}
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Metodo nao permitido.' })
  }

  const { amount, payerName, payerEmail } = getBody(req)
  const value = Number(amount)
  const document = (process.env.VEOPAG_PAYER_DOCUMENT || '').trim()

  if (!Number.isFinite(value) || value <= 0) {
    return res.status(400).json({ message: 'Valor invalido.' })
  }
  if (!payerName || !payerEmail) {
    return res.status(400).json({ message: 'Nome e e-mail do pagador sao obrigatorios.' })
  }
  if (!/^\d{11}$|^\d{14}$/.test(document)) {
    return res.status(500).json({ message: 'CPF/CNPJ nao configurado no servidor.' })
  }

  const externalId = `nudemeet-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const publicUrl = (process.env.PUBLIC_URL || `${protocol}://${host}`).replace(/\/$/, '')

  try {
    const deposit = await createDeposit({
      amount: value,
      externalId,
      callbackUrl: `${publicUrl}/api/webhooks/veopag`,
      payer: {
        name: payerName,
        email: payerEmail,
        document,
      },
    })

    return res.status(200).json({ externalId, ...deposit })
  } catch (error) {
    console.error('[veopag:deposit]', error.data || error.message)
    return res.status(error.status || 502).json(error.data || {
      message: 'Falha ao gerar o PIX. Tente novamente.',
    })
  }
}
