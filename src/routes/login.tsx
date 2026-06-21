import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useCallback, useRef } from 'react'
import TiIcon from '#/components/TiIcon'
import { useAuth } from '#/context/AuthContext'
import { loginUser, registerUser, requestPasswordOtp, verifyPasswordOtp, resetPasswordWithToken } from '#/services/auth'
import { PRODUCTS } from '#/data/products'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : '/shop',
  }),
  component: LoginPage,
})

const FRUITS = ['🥭', '🍌', '🍇', '🍎', '🫐', '🍊', '🌿', '🍋', '🫒', '🍓']

const SEASONAL_PRODUCTS = PRODUCTS.filter((p) => p.seasonal || p.categorySlug === 'seasonal-fruits')

function LoginSuccessOverlay({ name, onDone }: { name: string; onDone: () => void }) {
  const [fading, setFading] = useState(false)

  const featured = SEASONAL_PRODUCTS[Math.floor(Math.random() * SEASONAL_PRODUCTS.length)] ?? PRODUCTS[0]

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2400)
    const doneTimer = setTimeout(onDone, 2900)
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer) }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-[200] overflow-hidden flex items-center justify-center ${fading ? 'animate-overlay-out' : 'animate-overlay-in'}`}
      style={{ background: 'linear-gradient(145deg, #081521 0%, #0c1d2b 40%, #3d7a20 100%)' }}
    >
      {/* Grid texture */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Ripple circles */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border border-[#f5821f]/25 animate-ripple"
          style={{
            width: `${180 + i * 120}px`,
            height: `${180 + i * 120}px`,
            '--delay': `${i * 0.4}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Floating fruits */}
      {FRUITS.map((fruit, i) => (
        <div
          key={i}
          className="absolute text-3xl sm:text-4xl select-none pointer-events-none animate-float-up"
          style={{
            left: `${5 + i * 9.5}%`,
            bottom: '-60px',
            '--dur': `${2 + (i % 4) * 0.35}s`,
            '--delay': `${i * 0.12}s`,
          } as React.CSSProperties}
        >
          {fruit}
        </div>
      ))}

      {/* Center content */}
      <div className="relative z-10 text-center px-6 animate-welcome-pop" style={{ '--delay': '0.3s' } as React.CSSProperties}>
        {/* Logo ring */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-3xl border-2 border-[#f5821f]/40 animate-sparkle" />
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl shadow-[#f5821f]/30 p-2">
            <img src="/images/products/MainLogo.jpeg" alt="Tenkasi Fresh" className="w-full h-full rounded-2xl object-contain" />
          </div>
        </div>

        {/* Welcome text */}
        <p className="text-[#f5821f] text-xs font-bold tracking-[0.25em] uppercase mb-3">
          Login Successful
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-2 leading-tight">
          Welcome To Tenkasi Fresh,
        </h1>
        <p className="font-serif text-3xl sm:text-4xl font-bold text-[#f5821f] mb-4">
          {name.split(' ')[0]}!
        </p>
        <p className="text-white/60 text-sm">Your fresh fruits are waiting ✨</p>

        {/* Progress bar */}
        <div className="mt-6 w-32 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
          <div
            className="h-full bg-[#f5821f] rounded-full"
            style={{ animation: 'grow-bar 2.4s ease-in-out forwards' }}
          />
        </div>
      </div>

      {/* Seasonal product card — slides up from bottom */}
      <div className="absolute left-1/2 bottom-8 sm:bottom-10 z-20 animate-seasonal-card">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 max-w-[260px] sm:max-w-[300px]">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/20">
            <img src={featured.image} alt={featured.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-[#f5821f] uppercase tracking-widest mb-0.5">
              🌿 Now in Season
            </p>
            <p className="text-white font-semibold text-sm leading-tight truncate">{featured.name}</p>
            <p className="text-white/50 text-xs mt-0.5">{featured.nameTamil} · ₹{featured.price}/{featured.unit}</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes grow-bar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  )
}

function LoginPage() {
  const navigate = useNavigate()
  const { redirect } = Route.useSearch()
  const { login, user } = useAuth()
  const [tab, setTab] = useState<'signin' | 'register' | 'forgot'>('signin')
  const [successUser, setSuccessUser] = useState<{ name: string } | null>(null)
  const redirectTarget = useRef(redirect)

  useEffect(() => {
    if (user && !successUser) void navigate({ to: redirect as never })
  }, [user, successUser])

  const handleLoginSuccess = useCallback((u: import('#/services/auth').User) => {
    redirectTarget.current = u.role === 'admin' ? '/admin' : redirect
    login(u)
    setSuccessUser({ name: u.name })
  }, [login, redirect])

  const handleAnimationDone = useCallback(() => {
    const target = redirectTarget.current
    if (target !== '/admin') {
      try { sessionStorage.setItem('tf_show_welcome', '1') } catch {}
    }
    void navigate({ to: target as never })
  }, [navigate])

  return (
    <>
      {successUser && (
        <LoginSuccessOverlay name={successUser.name} onDone={handleAnimationDone} />
      )}

      <div className="min-h-screen flex">
        {/* Left panel — branding */}
        <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#081521] via-[#0c1d2b] to-[#3d7a20] text-white flex-col justify-between p-14 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#f5821f]/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#4fb8b2]/10 blur-3xl" />
          </div>
          <div className="relative">
            <Link to="/" className="flex items-center gap-3 no-underline w-fit">
              <div className="rounded-xl p-1.5 flex-shrink-0">
                <img src="/images/products/MainLogo.jpeg" alt="Tenkasi Fresh" className="w-10 h-10 rounded-lg object-contain" />
              </div>
              <div>
                <p className="font-serif text-lg font-bold leading-tight">Tenkasi Fresh</p>
                <p className="text-white/50 text-[10px] tracking-widest uppercase">Farm to Home · Since 1959</p>
              </div>
            </Link>
          </div>
          <div className="relative space-y-8">
            <div>
              <p className="text-[#f5821f] text-xs font-bold tracking-widest uppercase mb-4">Our Promise</p>
              <h2 className="font-serif text-4xl font-bold leading-snug mb-3">
                From our soil<br />to your soul.
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                Every fruit traced to a farmer we know by name. Harvested at dawn, at your door by dusk.
              </p>
            </div>
          </div>
          <p className="relative text-white/30 text-xs">© 2026 Tenkasi Fresh Fruits</p>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#faf9f4]">
          <div className="w-full max-w-sm">
            <Link to="/" className="lg:hidden flex items-center gap-2.5 no-underline mb-8">
              <div className="rounded-xl p-1 flex-shrink-0">
                <img src="/images/products/MainLogo.jpeg" alt="Tenkasi Fresh" className="w-8 h-8 rounded-lg object-contain" />
              </div>
              <span className="font-serif font-bold text-gray-900">Tenkasi Fresh</span>
            </Link>

            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-1">
              {tab === 'signin' ? 'Welcome back' : tab === 'register' ? 'Create account' : 'Reset password'}
            </h1>
            <p className="text-gray-500 text-sm mb-7">
              {tab === 'signin' ? 'Sign in to continue shopping' : tab === 'register' ? 'Join 500K+ happy customers' : 'We\'ll send a 6-digit OTP to your mobile'}
            </p>

            {tab !== 'forgot' && (
              <div className="flex bg-gray-100 rounded-xl p-1 mb-7">
                {(['signin', 'register'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {t === 'signin' ? 'Sign In' : 'Register'}
                  </button>
                ))}
              </div>
            )}

            {tab === 'signin' ? (
              <SignInForm onSuccess={handleLoginSuccess} onForgot={() => setTab('forgot')} />
            ) : tab === 'register' ? (
              <RegisterForm onSuccess={handleLoginSuccess} />
            ) : (
              <ForgotPasswordForm onBack={() => setTab('signin')} />
            )}

            <Link to="/" className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-[#3d7a20] transition-colors no-underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

const PHONE_RE = /^[6-9]\d{9}$/
const IS_DEMO = !(import.meta.env as Record<string, string>).VITE_API_URL

function cleanPhone(raw: string) {
  const digits = raw.replace(/\D/g, '')
  return digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits
}

function SignInForm({ onSuccess, onForgot }: { onSuccess: (u: import('#/services/auth').User) => void; onForgot: () => void }) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')
    const p = cleanPhone(phone)
    if (!PHONE_RE.test(p)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }
    setLoading(true)
    try {
      const user = await loginUser({ phone: p, password })
      onSuccess(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="signin-phone">Mobile number</label>
        <input id="signin-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3d7a20] focus:ring-2 focus:ring-[#3d7a20]/10 transition bg-white" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-gray-700" htmlFor="signin-pw">Password</label>
          <button type="button" onClick={onForgot} className="text-xs text-[#3d7a20] hover:underline font-medium">
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <input id="signin-pw" type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3d7a20] focus:ring-2 focus:ring-[#3d7a20]/10 transition bg-white" />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPw ? 'Hide password' : 'Show password'}>
            <TiIcon name="eye" size={17} className="text-gray-400" />
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full bg-[#3d7a20] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#2a5a14] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  )
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'phone' | 'otp' | 'password' | 'done'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSendOtp(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')
    const p = cleanPhone(phone)
    if (!PHONE_RE.test(p)) { setError('Enter a valid 10-digit mobile number.'); return }
    setLoading(true)
    try {
      await requestPasswordOtp(p)
      setPhone(p)
      setStep('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send OTP. Try again.')
    } finally { setLoading(false) }
  }

  async function handleVerifyOtp(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')
    if (otp.length !== 6) { setError('Enter the 6-digit OTP.'); return }
    setLoading(true)
    try {
      const { token } = await verifyPasswordOtp(phone, otp)
      setResetToken(token)
      setStep('password')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP. Please try again.')
    } finally { setLoading(false) }
  }

  async function handleResetPassword(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      await resetPasswordWithToken(resetToken, newPassword)
      setStep('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset password. Please try again.')
    } finally { setLoading(false) }
  }

  if (step === 'done') {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-[#f5f9f7] flex items-center justify-center mx-auto">
          <TiIcon name="shine" size={26} className="text-[#3d7a20]" />
        </div>
        <p className="font-semibold text-gray-900">Password updated!</p>
        <p className="text-gray-500 text-sm leading-relaxed">
          Your password has been reset. Sign in with your new password.
        </p>
        <button type="button" onClick={onBack} className="text-sm text-[#3d7a20] hover:underline font-medium">
          ← Back to Sign In
        </button>
      </div>
    )
  }

  if (step === 'otp') {
    return (
      <form onSubmit={(e) => { void handleVerifyOtp(e) }} className="space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
        <div className="text-center pb-1">
          <p className="text-gray-500 text-sm">OTP sent to <span className="font-medium text-gray-700">+91 {phone}</span></p>
          {IS_DEMO && <p className="text-xs text-[#f5821f] mt-1">Demo mode — use OTP <strong>123456</strong></p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="forgot-otp">6-digit OTP</label>
          <input
            id="forgot-otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="• • • • • •"
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-center tracking-[0.5em] text-lg outline-none focus:border-[#3d7a20] focus:ring-2 focus:ring-[#3d7a20]/10 transition bg-white"
          />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-[#3d7a20] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#2a5a14] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Verifying…' : 'Verify OTP'}
        </button>
        <button type="button" onClick={() => { setStep('phone'); setOtp(''); setError('') }} className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Change number
        </button>
      </form>
    )
  }

  if (step === 'password') {
    return (
      <form onSubmit={(e) => { void handleResetPassword(e) }} className="space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="forgot-newpw">New password</label>
          <div className="relative">
            <input id="forgot-newpw" type={showPw ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 characters" required minLength={8} className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3d7a20] focus:ring-2 focus:ring-[#3d7a20]/10 transition bg-white" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPw ? 'Hide' : 'Show'}>
              <TiIcon name="eye" size={17} className="text-gray-400" />
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="forgot-confirmpw">Confirm password</label>
          <input id="forgot-confirmpw" type={showPw ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3d7a20] focus:ring-2 focus:ring-[#3d7a20]/10 transition bg-white" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-[#3d7a20] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#2a5a14] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Updating…' : 'Set New Password'}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={(e) => { void handleSendOtp(e) }} className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="forgot-phone">Mobile number</label>
        <input
          id="forgot-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="9876543210"
          required
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3d7a20] focus:ring-2 focus:ring-[#3d7a20]/10 transition bg-white"
        />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-[#3d7a20] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#2a5a14] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? 'Sending OTP…' : 'Send OTP'}
      </button>
      <button type="button" onClick={onBack} className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors">
        ← Back to Sign In
      </button>
    </form>
  )
}

function RegisterForm({ onSuccess }: { onSuccess: (u: import('#/services/auth').User) => void }) {
  const [form, setForm] = useState({ name: '', phone: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')
    const p = cleanPhone(form.phone)
    if (!PHONE_RE.test(p)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }
    setLoading(true)
    try {
      const user = await registerUser({ name: form.name, phone: p, password: form.password })
      onSuccess(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="reg-name">Full name</label>
        <input id="reg-name" type="text" value={form.name} onChange={set('name')} placeholder="Ravi Kumar" required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3d7a20] focus:ring-2 focus:ring-[#3d7a20]/10 transition bg-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="reg-phone">Mobile number</label>
        <input id="reg-phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="9876543210" required className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3d7a20] focus:ring-2 focus:ring-[#3d7a20]/10 transition bg-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="reg-pw">Password</label>
        <div className="relative">
          <input id="reg-pw" type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min 8 characters" required minLength={8} className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3d7a20] focus:ring-2 focus:ring-[#3d7a20]/10 transition bg-white" />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPw ? 'Hide password' : 'Show password'}>
            <TiIcon name="eye" size={17} className="text-gray-400" />
          </button>
        </div>
      </div>
      <button type="submit" disabled={loading} className="w-full bg-[#3d7a20] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#2a5a14] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? 'Creating account…' : 'Create Account'}
      </button>
      <p className="text-center text-xs text-gray-400 leading-relaxed">
        By registering, you agree to our terms.
      </p>
    </form>
  )
}
