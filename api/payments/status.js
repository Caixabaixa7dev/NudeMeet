import { getDepositStatus } from '../../serverless/veopag.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ message: 'Metodo nao permitido.' })
  }

  const externalId = req.query?.externalId
  if (!externalId || Array.isArray(externalId)) {
    return res.status(400).json({ message: 'externalId obrigatorio.' })
  }

  try {
    const deposit = await getDepositStatus(externalId)
    return res.status(200).json({ externalId, status: deposit.status })
  } catch (error) {
    console.error('[veopag:status]', error.data || error.message)
    return res.status(error.status || 502).json(error.data || {
      message: 'Falha ao consultar o pagamento.',
    })
  }
}
