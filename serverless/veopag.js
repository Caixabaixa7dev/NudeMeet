const BASE_URL = process.env.VEOPAG_API_URL || 'https://api.veopag.com'

let cachedToken = null
let cachedUntil = 0
let tokenRequest = null

async function readJson(response) {
  const text = await response.text()
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

export async function getToken(forceRefresh = false) {
  const now = Date.now()
  if (!forceRefresh && cachedToken && now < cachedUntil) return cachedToken
  if (!forceRefresh && tokenRequest) return tokenRequest

  tokenRequest = (async () => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.VEOPAG_CLIENT_ID,
        client_secret: process.env.VEOPAG_CLIENT_SECRET,
      }),
    })
    const data = await readJson(response)

    if (!response.ok || !data.token) {
      const error = new Error(data.message || 'Falha na autenticacao VeoPag.')
      error.status = response.status || 502
      error.data = data
      throw error
    }

    cachedToken = data.token
    cachedUntil = Date.now() + 55 * 60 * 1000
    return cachedToken
  })()

  try {
    return await tokenRequest
  } finally {
    tokenRequest = null
  }
}

async function veopagRequest(path, options = {}, allowRetry = true) {
  const token = await getToken()
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await readJson(response)

  if (response.status === 401 && allowRetry) {
    cachedToken = null
    cachedUntil = 0
    await getToken(true)
    return veopagRequest(path, options, false)
  }

  if (!response.ok) {
    const error = new Error(data.message || 'Falha na API VeoPag.')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export async function createDeposit({ amount, externalId, callbackUrl, payer }) {
  const data = await veopagRequest('/api/payments/deposit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount,
      external_id: externalId,
      clientCallbackUrl: callbackUrl,
      payer,
    }),
  })
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

export async function getDepositStatus(externalId) {
  const params = new URLSearchParams({ external_id: externalId })
  const data = await veopagRequest(`/api/transactions/deposit?${params}`)
  return data.deposit || data
}
