# NudeMeet

Prototipo React/Vite com login, cadastro e checkout Pix integrado a VeoPag.

## Desenvolvimento local

Frontend:

```bash
npm install
npm run dev
```

Backend local:

```bash
npm --prefix server install
npm --prefix server start
```

O Vite encaminha `/api` para `http://localhost:4000` durante o desenvolvimento.

## Variaveis de ambiente

Configure no backend local ou no painel da Vercel:

```text
VEOPAG_CLIENT_ID
VEOPAG_CLIENT_SECRET
VEOPAG_PAYER_DOCUMENT
VEOPAG_WEBHOOK_SECRET
PUBLIC_URL (opcional)
```

Nunca envie credenciais reais ao repositorio.

## Vercel

O diretorio `api/` contem as funcoes serverless usadas em producao. O frontend chama esses endpoints pelo mesmo dominio.

Comandos de verificacao:

```bash
npm run lint
npm run build
```
