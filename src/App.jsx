import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import './App.css'

function App() {
  const isDownloadPage = window.location.pathname.replace(/\/+$/, '') === '/baixar'
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

  if (isDownloadPage) return <DownloadPage />

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

function DownloadPage() {
  const [downloadStarted, setDownloadStarted] = useState(false)
  const [phoneTab, setPhoneTab] = useState('discover')
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const elements = document.querySelectorAll('[data-apk-reveal]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.16 })

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  function handleDownload() {
    setDownloadStarted(true)
    navigator.vibrate?.(35)
  }

  function handlePhoneTilt(event) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    event.currentTarget.style.setProperty('--phone-rx', `${-y * 8}deg`)
    event.currentTarget.style.setProperty('--phone-ry', `${x * 10}deg`)
  }

  function resetPhoneTilt(event) {
    event.currentTarget.style.setProperty('--phone-rx', '0deg')
    event.currentTarget.style.setProperty('--phone-ry', '0deg')
  }

  return (
    <main className="apk-download">
      <div className="apk-noise" aria-hidden="true" />

      <header className="apk-header">
        <a className="apk-brand" href="/" aria-label="NudeMeet">
          <img src="/android-chrome-192x192.png" alt="" />
          <strong><span>Nude</span><em>Meet</em></strong>
        </a>
        <div className="apk-header-badges">
          <span className="apk-age">18+</span>
          <span className="apk-android-badge">
            <img src="/android-icon.svg" alt="" aria-hidden="true" />
            Android oficial
          </span>
        </div>
      </header>

      <section className="apk-hero">
        <div className="apk-dot-field" aria-hidden="true" />
        <div className="apk-hero-copy" data-apk-reveal>
          <p className="apk-overline">APLICATIVO OFICIAL</p>
          <h1>Leve a<br /><em>conexao</em><br />com voce.</h1>
          <p className="apk-hero-lead">Conversas, matches e chamadas em um aplicativo privado e feito para acompanhar seu ritmo.</p>
          <a className={`apk-main-download${downloadStarted ? ' is-downloading' : ''}`} href="/NudeMeet.apk" download="NudeMeet.apk" onClick={handleDownload}>
            <img className="apk-robot" src="/android-icon.svg" alt="" aria-hidden="true" />
            <span><strong>{downloadStarted ? 'Download iniciado' : 'Baixar NudeMeet'}</strong><small>APK para Android &middot; Oficial</small></span>
            <svg className="apk-download-arrow" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3v18M9 15l7 7 7-7M5 28h22" /></svg>
          </a>
          <p className="apk-safe-note"><svg viewBox="0 0 26 30" aria-hidden="true"><path d="M13 2 24 7v8c0 7-4 11-11 13C6 26 2 22 2 15V7l11-5Z" /><path d="m8 15 3 3 7-8" /></svg> Download seguro, verificado e sem anuncios.</p>
        </div>

        <div className="apk-phone-stage" data-apk-reveal>
          <div className="apk-rings" aria-hidden="true"><i /><i /><i /></div>
          <div className="apk-phone-tilt" onPointerMove={handlePhoneTilt} onPointerLeave={resetPhoneTilt}>
            <div className="apk-phone">
              <div className="apk-phone-screen">
                <div className="apk-phone-status"><span>11:30</span><span>5G&nbsp; &#9679;&nbsp; 90%</span></div>
                <div className="apk-phone-brand"><img src="/android-chrome-192x192.png" alt="" /><strong><span>Nude</span><em>Meet</em></strong></div>

                <div className="apk-phone-content">
                  {phoneTab === 'discover' && (
                    <div className="apk-discover-panel">
                      <div className="apk-profile-scene">
                        <img
                          className="apk-model-photo"
                          src="https://static-proxy.strpst.com/avatars/b/e/7/be7606e2296c029cebe51949fdcadee1-full"
                          alt="Perfil ao vivo"
                          referrerPolicy="no-referrer"
                        />
                        <span className="apk-live-status"><i /> AO VIVO</span>
                      </div>
                      <div className="apk-profile-caption"><strong>{liked ? 'Deu match!' : 'Novo match'}</strong><span>{liked ? 'Agora e so chamar.' : 'Alguem especial te curtiu'}</span><i>&#9829;</i></div>
                      <div className="apk-swipe-actions"><button type="button" onClick={() => setLiked(false)} aria-label="Recusar">&#215;</button><button className={liked ? 'is-liked' : ''} type="button" onClick={() => setLiked(true)} aria-label="Curtir">&#9829;</button></div>
                    </div>
                  )}
                  {phoneTab === 'chats' && (
                    <div className="apk-chat-panel"><h3>Mensagens</h3><div><i>J</i><span><strong>Julia</strong><small>Oi, esta por perto?</small></span><b>2</b></div><div><i>M</i><span><strong>Marina</strong><small>Digitando<span className="typing-dots">...</span></small></span></div><div><i>A</i><span><strong>Ana</strong><small>Curti seu perfil</small></span></div></div>
                  )}
                  {phoneTab === 'calls' && (
                    <div className="apk-call-panel"><span className="apk-call-pulse"><i>&#9829;</i></span><h3>Chamada privada</h3><p>Conexao protegida</p><button type="button">Iniciar chamada</button></div>
                  )}
                  {phoneTab === 'profile' && (
                    <div className="apk-profile-panel"><div className="apk-avatar">N</div><h3>Meu perfil</h3><p>Perfil verificado &middot; 18+</p><div><span>Fotos <b>5</b></span><span>Matches <b>12</b></span></div><button type="button">Editar perfil</button></div>
                  )}
                </div>

                <nav className="apk-phone-nav" aria-label="Demonstracao do aplicativo">
                  <button className={phoneTab === 'discover' ? 'active' : ''} type="button" onClick={() => setPhoneTab('discover')}><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="m10 9 5-2-2 5-5 2 2-5Z" /></svg><span>Descobrir</span></button>
                  <button className={phoneTab === 'chats' ? 'active' : ''} type="button" onClick={() => setPhoneTab('chats')}><svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4V5Z" /></svg><span>Chats</span></button>
                  <button className={phoneTab === 'calls' ? 'active' : ''} type="button" onClick={() => setPhoneTab('calls')}><svg viewBox="0 0 24 24"><path d="M7 3h4l1 5-3 2c1 3 3 5 6 6l2-3 4 2v4c0 2-2 3-4 2C9 19 4 14 3 6c0-2 1-3 4-3Z" /></svg><span>Chamadas</span></button>
                  <button className={phoneTab === 'profile' ? 'active' : ''} type="button" onClick={() => setPhoneTab('profile')}><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-5 4-7 8-7s7 2 8 7" /></svg><span>Perfil</span></button>
                </nav>
                <div className="apk-phone-home" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="apk-content-shell">
        <div className="apk-steps-section" data-apk-reveal>
          <div className="apk-section-title"><p>PRONTO EM</p><h2><span>3</span> passos.</h2></div>
          <div className="apk-steps-grid">
            <article className="apk-step-card" style={{ '--card-delay': '0ms' }}><b>1</b><div className="apk-card-icon"><svg viewBox="0 0 32 32"><path d="M16 3v17M9 14l7 7 7-7M5 27h22" /></svg></div><h3>Baixe o APK</h3><p>Clique no botao acima e faca o download do instalador.</p></article>
            <span className="apk-step-arrow">&#8250;</span>
            <article className="apk-step-card" style={{ '--card-delay': '100ms' }}><b>2</b><div className="apk-card-icon"><svg viewBox="0 0 32 32"><path d="M16 3 27 8v8c0 6-3.7 10-11 13C8.7 26 5 22 5 16V8l11-5Z" /><path d="m11 16 3 3 7-8" /></svg></div><h3>Autorize a instalacao</h3><p>Ative a opcao de instalar apps pelo navegador.</p></article>
            <span className="apk-step-arrow">&#8250;</span>
            <article className="apk-step-card" style={{ '--card-delay': '200ms' }}><b>3</b><div className="apk-card-icon"><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" /><path d="m10 16 4 4 8-9" /></svg></div><h3>Instale e entre</h3><p>Abra o arquivo, instale o app e acesse sua conta.</p></article>
          </div>
        </div>

        <div className="apk-features-grid" data-apk-reveal>
          <article style={{ '--feature-color': '#ff2d6f' }}><div><svg viewBox="0 0 32 32"><path d="m18 2-9 16h8l-3 12 10-17h-8l2-11Z" /></svg></div><h3>Acesso rapido</h3><p>Tudo o que voce precisa, na palma da mao.</p></article>
          <article style={{ '--feature-color': '#ff2d6f' }}><div><svg viewBox="0 0 32 32"><rect x="6" y="13" width="20" height="16" rx="3" /><path d="M10 13V9a6 6 0 0 1 12 0v4M16 20v4" /></svg></div><h3>Privacidade</h3><p>Conversas protegidas e confidenciais.</p></article>
          <article style={{ '--feature-color': '#00e7cb' }}><div><img src="/pix-icon.svg" alt="" /></div><h3>Pix simples</h3><p>Pagamentos rapidos e seguros.</p></article>
          <article style={{ '--feature-color': '#95cf00' }}><div><img src="/android-icon.svg" alt="" /></div><h3>Feito para Android</h3><p>Desempenho leve e estavel.</p></article>
        </div>

        <div className="apk-trust-bar" data-apk-reveal>
          <article><svg viewBox="0 0 32 32"><path d="M16 2 28 8v9c0 7-4 11-12 14C8 28 4 24 4 17V8l12-6Z" /><path d="m10 17 4 4 8-10" /></svg><span><strong>Download seguro</strong><small>Arquivo verificado e livre de virus.</small></span></article>
          <article className="android"><img src="/android-icon.svg" alt="" /><span><strong>Compativel com Android</strong><small>Funciona na maioria dos dispositivos.</small></span></article>
          <article><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="10" /><path d="m11 16 3 3 7-8M16 2v4m0 20v4M2 16h4m20 0h4" /></svg><span><strong>Instalacao simples</strong><small>Em poucos passos, voce ja esta dentro.</small></span></article>
        </div>

        <section className="apk-final-banner" data-apk-reveal>
          <div className="apk-heart-pattern" aria-hidden="true" />
          <img src="/android-chrome-192x192.png" alt="" />
          <div><h2>Baixe. <span>Entre.</span> <em>Conecte.</em></h2><p>Seu proximo match pode estar a um clique.</p></div>
          <a href="/NudeMeet.apk" download="NudeMeet.apk" onClick={handleDownload}><img src="/android-icon.svg" alt="" /><span>Baixar para Android</span><b>&#8595;</b></a>
        </section>
      </section>

      <footer className="apk-footer"><span className="apk-footer-heart">&#9825;</span> NudeMeet &mdash; Conexoes reais, do seu jeito.</footer>
    </main>
  )
}

export default App
