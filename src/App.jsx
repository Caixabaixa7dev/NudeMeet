import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import './App.css'

function App() {
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [screen, setScreen] = useState('login')
  const [checkoutData, setCheckoutData] = useState({ name: '', email: '' })

  useEffect(() => {
    document.body.classList.toggle('has-age-gate', !ageConfirmed)

    return () => document.body.classList.remove('has-age-gate')
  }, [ageConfirmed])

  function goToCheckout(name, email) {
    setCheckoutData({ name, email })
    setScreen('checkout')
  }

  return (
    <>
    {screen === 'login' ? (
      <LoginScreen onRegister={() => setScreen('register')} />
    ) : screen === 'register' ? (
      <RegisterScreen onLogin={() => setScreen('login')} onProceed={goToCheckout} />
    ) : screen === 'checkout' ? (
      <PaymentScreen checkoutData={checkoutData} onBack={() => setScreen('register')} />
    ) : (
    <main className="landing-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="NudeMeet, pagina inicial">
          <img src="/nudemeet-logo.png" alt="NudeMeet" />
        </a>
        <button className="quiet-action" type="button" onClick={() => setScreen('login')}>
          Ja tenho conta <span aria-hidden="true">&#8599;</span>
        </button>
      </header>

      <section className="hero-section" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Conexoes adultas, no seu ritmo</p>
          <h1>Uma nova forma de <em>se encontrar.</em></h1>
          <p className="hero-description">
            Descubra pessoas adultas que combinam com voce e inicie conversas quando houver interesse dos dois lados.
          </p>
          <div className="hero-actions">
            <button className="primary-action" type="button" onClick={() => setScreen('register')}>
              Criar conta <span aria-hidden="true">&#8594;</span>
            </button>
            <p className="discreet-note">Area exclusiva para maiores de 18 anos.</p>
          </div>
        </div>

        <div className="visual-stage" aria-hidden="true">
          <div className="orbit orbit-large" />
          <div className="orbit orbit-small" />
          <article className="profile-card profile-main">
            <div className="portrait portrait-main"><span>AO</span></div>
            <div className="profile-info"><strong>Adult Only</strong><small>Comunidade privada</small></div>
            <span className="online-dot" />
          </article>
          <article className="profile-card profile-side profile-side-top">
            <div className="portrait portrait-pink"><span>18+</span></div>
          </article>
          <article className="profile-card profile-side profile-side-bottom">
            <div className="portrait portrait-blue"><span>+</span></div>
          </article>
          <div className="match-chip"><span className="heart">&#9829;</span> Match com respeito</div>
        </div>
      </section>

      <footer className="site-footer">
        <p>Feito para conexoes conscientes.</p>
        <div><a href="#termos">Termos</a><a href="#privacidade">Privacidade</a></div>
      </footer>

      {!ageConfirmed && (
        <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
          <div className="age-gate-noise" aria-hidden="true" />
          <section className="age-panel">
            <p className="age-overline">ACESSO RESTRITO</p>
            <img className="age-logo" src="/nudemeet-logo.png" alt="NudeMeet" />
            <h2 id="age-gate-title">Este conteudo e destinado somente a maiores de 18 anos.</h2>
            <p className="age-detail">Ao continuar, voce confirma que tem a idade minima exigida para acessar esta area.</p>
            <div className="age-actions">
              <button className="confirm-age" type="button" onClick={() => setAgeConfirmed(true)} autoFocus>
                Tenho 18 anos ou mais <span aria-hidden="true">&#8594;</span>
              </button>
              <a className="leave-link" href="https://www.google.com">Sair daqui</a>
            </div>
            <p className="age-legal">Consulte nossos termos e politica de privacidade.</p>
          </section>
        </div>
      )}
    </main>
    )}
    </>
  )
}

function LoginScreen({ onRegister }) {
  const [passwordVisible, setPasswordVisible] = useState(false)

  function handleDemoSubmit(event) {
    event.preventDefault()
  }

  return (
    <main className="login-shell">
      <section className="login-content" aria-labelledby="login-title">
        <img className="login-logo" src="/nudemeet-logo.png" alt="NudeMeet" />
        <header className="login-intro">
          <h1 id="login-title">Bem-vindo de volta</h1>
          <p>Entre para continuar</p>
        </header>

        <form className="login-form" onSubmit={handleDemoSubmit}>
          <label className="login-field">
            <span className="field-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>
            </span>
            <span className="sr-only">E-mail</span>
            <input type="email" placeholder="E-mail" autoComplete="email" required />
          </label>
          <label className="login-field">
            <span className="field-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
            </span>
            <span className="sr-only">Senha</span>
            <input type={passwordVisible ? 'text' : 'password'} placeholder="Senha" autoComplete="current-password" required />
            <button className="password-toggle" type="button" onClick={() => setPasswordVisible(!passwordVisible)} aria-label={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.2-5.2 9.5-5.2S21.5 12 21.5 12s-3.2 5.2-9.5 5.2S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.7" /></svg>
            </button>
          </label>
          <button className="forgot-link" type="button">Esqueci minha senha</button>
          <button className="login-submit" type="submit">Entrar</button>
          <button className="create-account" type="button" onClick={onRegister}>Criar conta</button>
        </form>

        <div className="login-divider"><span>ou</span></div>
        <div className="social-actions single">
          <button className="social-button google" type="button"><span className="google-letter">G</span> Entrar com Google</button>
        </div>
        <p className="login-legal">Ao entrar, voce concorda com os<br /><a href="#termos">Termos</a> e a <a href="#privacidade">Politica de Privacidade</a></p>
      </section>
    </main>
  )
}

function RegisterScreen({ onLogin, onProceed }) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onProceed(name, email)
  }

  return (
    <main className="login-shell register-shell">
      <button className="login-back" type="button" onClick={onLogin} aria-label="Voltar para login">&#8592; Entrar</button>
      <section className="login-content" aria-labelledby="register-title">
        <img className="register-logo" src="/nudemeet-logo.png" alt="NudeMeet" />
        <header className="login-intro register-intro">
          <h1 id="register-title">Criar conta</h1>
          <p>Cadastre-se para comecar</p>
        </header>

        <form className="login-form register-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span className="field-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c.7-4.1 3.2-6.1 7.5-6.1s6.8 2 7.5 6.1" /></svg></span>
            <span className="sr-only">Nome</span><input type="text" placeholder="Nome" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="login-field">
            <span className="field-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg></span>
            <span className="sr-only">E-mail</span><input type="email" placeholder="E-mail" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="login-field">
            <span className="field-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg></span>
            <span className="sr-only">Senha</span><input type={passwordVisible ? 'text' : 'password'} placeholder="Senha" autoComplete="new-password" required />
            <button className="password-toggle" type="button" onClick={() => setPasswordVisible(!passwordVisible)} aria-label={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.2-5.2 9.5-5.2S21.5 12 21.5 12s-3.2 5.2-9.5 5.2S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.7" /></svg></button>
          </label>
          <label className="login-field">
            <span className="field-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg></span>
            <span className="sr-only">Confirmar senha</span><input type={confirmVisible ? 'text' : 'password'} placeholder="Confirmar senha" autoComplete="new-password" required />
            <button className="password-toggle" type="button" onClick={() => setConfirmVisible(!confirmVisible)} aria-label={confirmVisible ? 'Ocultar senha' : 'Mostrar senha'}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.2-5.2 9.5-5.2S21.5 12 21.5 12s-3.2 5.2-9.5 5.2S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.7" /></svg></button>
          </label>
          <label className="age-checkbox"><input type="checkbox" required /><span aria-hidden="true" /><strong>Sou maior de 18 anos</strong></label>
          <p className="register-terms">Ao criar sua conta, voce concorda com os <a href="#termos">Termos</a> e a <a href="#privacidade">Politica de Privacidade</a></p>
          <button className="login-submit" type="submit">Criar conta</button>
          <button className="create-account" type="button" onClick={onLogin}>Ja tenho conta</button>
        </form>
        <div className="login-divider register-divider"><span>ou</span></div>
        <div className="social-actions single"><button className="social-button google" type="button"><span className="google-letter">G</span> Continuar com Google</button></div>
      </section>
    </main>
  )
}

function PaymentScreen({ checkoutData, onBack }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [payment, setPayment] = useState(null)
  const [status, setStatus] = useState('')
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef(null)

  const amount = 19.9

  useEffect(() => {
    if (!payment?.qrcode || !canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, payment.qrcode, {
      width: 260,
      margin: 2,
      errorCorrectionLevel: 'M',
    })
  }, [payment?.qrcode])

  useEffect(() => {
    if (!payment?.externalId || status === 'COMPLETED' || status === 'FAILED') return
    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/status?externalId=${payment.externalId}`)
        const data = await res.json()
        setStatus(data.status)
      } catch {
        /* tenta de novo na proxima rodada */
      }
    }, 4000)
    return () => clearInterval(id)
  }, [payment?.externalId, status])

  async function generatePix() {
    setLoading(true)
    setError('')
    setCopied(false)
    try {
      const res = await fetch('/api/payments/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          payerName: checkoutData.name,
          payerEmail: checkoutData.email,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Falha ao gerar o PIX.')
        return
      }
      setPayment(data)
      setStatus(data.status)
    } catch {
      setError('Nao foi possivel conectar ao servidor.')
    } finally {
      setLoading(false)
    }
  }

  async function copyPixCode() {
    if (!payment?.qrcode) return
    try {
      await navigator.clipboard.writeText(payment.qrcode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard indisponivel */
    }
  }

  return (
    <main className="login-shell checkout-shell">
      <button className="login-back" type="button" onClick={onBack} aria-label="Voltar">&#8592; Voltar</button>
      <section className="login-content checkout-content" aria-labelledby="checkout-title">
        <img className="checkout-logo" src="/nudemeet-logo.png" alt="NudeMeet" />
        <header className="login-intro checkout-intro">
          <h1 id="checkout-title"><span>Falta</span> pouco</h1>
          <p className="checkout-success-copy">Seu cadastro foi concluido com sucesso!</p>
          <p className="checkout-description">Para utilizar o aplicativo e fazer chamadas<br />com as garotas quentes, finalize seu acesso<br />com o pagamento via <strong>Pix</strong>.</p>
        </header>

        <div className="premium-card">
          <svg className="premium-icon" viewBox="0 0 64 54" aria-hidden="true">
            <path d="M12 4h40l9 13-29 33L3 17 12 4Z" />
            <path d="m12 4 8 13L32 4l12 13 8-13M3 17h58M20 17l12 33 12-33" />
          </svg>
          <div><strong>Acesso Premium</strong><span>Liberacao imediata apos pagamento</span></div>
        </div>

        <button className="pix-generate" type="button" onClick={generatePix} disabled={loading}>
          <img src="/pix-icon.svg" alt="" aria-hidden="true" />
          {loading ? 'Gerando Pix...' : 'Gerar Pix'}
        </button>
        {error && <p className="checkout-error">{error}</p>}

        {status === 'COMPLETED' ? (
          <div className="checkout-done payment-state-card">
            <div className="checkout-check" aria-hidden="true">&#10003;</div>
            <h2>Pagamento confirmado!</h2>
            <p>Seu acesso foi liberado automaticamente.</p>
            <button className="login-submit checkout-submit" type="button">Comecar</button>
          </div>
        ) : payment ? (
          <>
            <div className="payment-state-card payment-generated">
              <p className="payment-scan-title">Escaneie para pagar</p>
              <div className="qr-neon-frame"><canvas ref={canvasRef} /></div>
              <p className="payment-amount">Valor: <strong>R$ {Number(payment.amount || amount).toFixed(2).replace('.', ',')}</strong></p>
              <p className="payment-method">Pagamento via <strong>Pix</strong></p>
            </div>
            <button className="checkout-copy" type="button" onClick={copyPixCode}>
              <svg viewBox="0 0 32 32" aria-hidden="true"><rect x="10" y="9" width="16" height="18" rx="3" /><path d="M21 9V7a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v15a3 3 0 0 0 3 3h3" /></svg>
              {copied ? 'Codigo copiado!' : 'Copiar codigo Pix'}
            </button>
            {status === 'FAILED' && <p className="checkout-error">O Pix expirou. Gere novamente.</p>}
          </>
        ) : (
          <div className="payment-state-card payment-empty">
            <svg className="payment-file-icon" viewBox="0 0 150 170" aria-hidden="true">
              <path d="M28 8h63l31 31v99a12 12 0 0 1-12 12H28a12 12 0 0 1-12-12V20A12 12 0 0 1 28 8Z" />
              <path d="M91 8v31h31M43 104h45M43 124h31" />
              <path d="m68 59 13 13 13-13-13-13-13 13Zm-24 0 13 13 13-13-13-13-13 13Zm24 24 13 13 13-13-13-13-13 13Zm-24 0 13 13 13-13-13-13-13 13Z" />
              <circle cx="115" cy="132" r="28" /><path d="M115 116v18h13" />
            </svg>
            <h2>Pagamento ainda nao gerado</h2>
            <p>Toque em "Gerar Pix" para criar<br />seu QR Code e codigo <strong>Pix</strong>.</p>
          </div>
        )}

        <p className="payment-release-note">
          <svg viewBox="0 0 30 36" aria-hidden="true"><rect x="4" y="14" width="22" height="18" rx="3" /><path d="M9 14V9a6 6 0 0 1 12 0v5M15 21v5" /></svg>
          <span>Apos a confirmacao do pagamento,<br />seu acesso sera liberado automaticamente.</span>
        </p>

        <div className="secure-divider">
          <span />
          <svg viewBox="0 0 32 38" aria-hidden="true"><path d="M16 2 29 8v10c0 8-5 14-13 18C8 32 3 26 3 18V8l13-6Z" /><path d="m10 19 4 4 8-9" /></svg>
          <strong>Ambiente seguro</strong>
          <span />
        </div>
      </section>
    </main>
  )
}

export default App
