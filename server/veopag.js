import axios from 'axios'

const BASE_URL = process.env.VEOPAG_API_URL || 'https://api.veopag.com'

let cachedToken = null
let cachedUntil = 0

export async function getToken() {
  const now = Date.now()
  if (cachedToken && now < cachedUntil) return cachedToken

  const { data } = await axios.post(`${BASE_URL}/api/auth/login`, {
    client_id: process.env.VEOPAG_CLIENT_ID,
    client_secret: process.env.VEOPAG_CLIENT_SECRET,
  }, { timeout: 15000 })

  cachedToken = data.token
  cachedUntil = now + 55 * 60 * 1000
  return cachedToken
}

function authHeaders() {
  return { Authorization: `Bearer ${cachedToken}` }
}

export async function createDeposit({ amount, externalId, clientCallbackUrl, payer }) {
  await getToken()
  const { data } = await axios.post(
    `${BASE_URL}/api/payments/deposit`,
    {
      amount,
      external_id: externalId,
      clientCallbackUrl,
      payer,
    },
    { headers: authHeaders(), timeout: 20000 },
  )

  const body = data.qrCodeResponse || data

  return {
    transactionId: body.transactionId || body.transaction_id,
    status: body.status,
    qrcode: body.qrcode,
    amount: body.amount,
    fee: body.fee,
    idempotent: Boolean(data.idempotent),
  }
}

export async function getDepositStatus({ externalId }) {
  await getToken()
  const { data } = await axios.get(
    `${BASE_URL}/api/transactions/deposit`,
    { headers: authHeaders(), params: { external_id: externalId }, timeout: 15000 },
  )

  return data.deposit || data
}
