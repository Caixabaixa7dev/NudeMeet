import 'dotenv/config'
import crypto from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import { createDeposit, getDepositStatus } from './veopag.js'

const app = express()
const PORT = process.env.PORT || 4000
const serverDirectory = path.dirname(fileURLToPath(import.meta.url))
const frontendDirectory = path.resolve(serverDirectory, '../dist')

const deposits = new Map()

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json({ verify: (req, _res, buf) => { req.rawBody = buf } }))

function makeExternalId() {
  return `nudemeet-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
}

function isValidDocument(doc) {
  return /^\d{11}$|^\d{14}$/.test(doc || '')
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/payments/deposit', async (req, res) => {
  const { amount, payerName, payerEmail } = req.body || {}

  const value = Number(amount)
  if (!Number.isFinite(value) || value <= 0) {
    return res.status(400).json({ message: 'Valor invalido.' })
  }

  if (!payerName || !payerEmail) {
    return res.status(400).json({ message: 'Nome e e-mail do pagador sao obrigatorios.' })
  }

  const document = (process.env.VEOPAG_PAYER_DOCUMENT || '').trim()
  if (!isValidDocument(document)) {
    return res.status(500).json({ message: 'CPF/CNPJ nao configurado no servidor.' })
  }

  const externalId = makeExternalId()
  const publicUrl = process.env.PUBLIC_URL || (
    process.env.RENDER_EXTERNAL_HOSTNAME
      ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`
      : ''
  )
  const callbackUrl = publicUrl
    ? `${publicUrl.replace(/\/$/, '')}/api/webhooks/veopag`
    : ''

  try {
    const deposit = await createDeposit({
      amount: value,
      externalId,
      clientCallbackUrl: callbackUrl,
      payer: {
        name: payerName,
        email: payerEmail,
        document,
      },
    })

    deposits.set(externalId, { externalId, ...deposit })

    return res.json({ externalId, ...deposit })
  } catch (err) {
    console.error('[deposit]', err?.response?.data || err.message)
    const code = err?.response?.data?.code
    if (code) {
      return res.status(err.response.status).json(err.response.data)
    }
    return res.status(502).json({ message: 'Falha ao gerar o PIX. Tente novamente.' })
  }
})

app.post('/api/webhooks/veopag', (req, res) => {
  const secret = process.env.VEOPAG_WEBHOOK_SECRET
  const signature = req.get('X-Webhook-Signature') || ''
  const timestamp = req.get('X-Webhook-Timestamp') || ''

  if (secret) {
    const rawBody = req.rawBody?.toString('utf8') || ''
    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${rawBody}`)
      .digest('hex')

    const a = Buffer.from(signature, 'hex')
    const b = Buffer.from(expected, 'hex')
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return res.status(401).json({ error: 'assinatura invalida' })
    }

    if (Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) > 300) {
      return res.status(401).json({ error: 'timestamp expirado' })
    }
  }

  const event = req.body
  const stored = deposits.get(event.external_id)
  if (stored) {
    stored.status = event.status
    stored.updatedAt = event.updated_at
  }

  return res.status(200).json({ ok: true })
})

app.get('/api/payments/status', async (req, res) => {
  const { externalId } = req.query
  if (!externalId) return res.status(400).json({ message: 'externalId obrigatorio.' })

  const stored = deposits.get(externalId)
  if (stored && stored.status && stored.status !== 'PENDING') {
    return res.json({ externalId, status: stored.status })
  }

  try {
    const remote = await getDepositStatus({ externalId })
    if (remote) {
      deposits.set(externalId, { externalId, ...remote })
      return res.json({ externalId, status: remote.status, remote: true })
    }
  } catch (err) {
    console.error('[status]', err?.response?.data || err.message)
  }

  return res.json({ externalId, status: stored?.status || 'UNKNOWN' })
})

app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'Endpoint nao encontrado.' })
})
app.use(express.static(frontendDirectory))
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDirectory, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`NudeMeet server running on http://localhost:${PORT}`)
})
