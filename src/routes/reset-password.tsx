import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import TiIcon from '#/components/TiIcon'

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const navigate = useNavigate()
  const { token } = Route.useSearch()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [showResend, setShowResend] = useState(false)
  const [resendEmail, setResendEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSent, setResendSent] = useState(false)

  async function handleResend() {
    if (!resendEmail) return
    setResendLoading(true)
    try {
      await fetch(
        `${(import.meta.env as Record<string, string>).VITE_API_URL ?? ''}/api/Auth/forgot-password`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: resendEmail }) },
      )
      setResendSent(true)
    } finally {
      setResendLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(
        `${(import.meta.env as Record<string, string>).VITE_API_URL ?? ''}/api/Auth/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword: password }),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => null) as { message?: string } | null
        throw new Error(data?.message ?? 'Reset failed. The link may have expired.')
      }
      setDone(true)
      setTimeout(() => void navigate({ to: '/login' as never }), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
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
            <p className="text-[#f5821f] text-xs font-bold tracking-widest uppercase mb-4">Security</p>
            <h2 className="font-serif text-4xl font-bold leading-snug mb-3">
              Create a new<br />password.
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Choose a strong password to keep your account and orders safe.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { icon: 'lock', label: 'Use 8+ characters' },
              { icon: 'shield', label: 'Mix letters and numbers' },
              { icon: 'check', label: 'Never share your password' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-sm text-white/75">
                <TiIcon name={item.icon} size={16} className="text-[#f5821f]" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-white/30 text-xs">© 2026 Tenkasi Fresh Fruits</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#faf9f4]">
        <div className="w-full max-w-sm">
          <Link to="/" className="lg:hidden flex items-center gap-2.5 no-underline mb-8">
            <div className="rounded-xl p-1 flex-shrink-0">
              <img src="/images/products/MainLogo.jpeg" alt="Tenkasi Fresh" className="w-8 h-8 rounded-lg object-contain" />
            </div>
            <span className="font-serif font-bold text-gray-900">Tenkasi Fresh</span>
          </Link>

          {!token ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                <TiIcon name="close" size={24} className="text-red-500" />
              </div>
              <p className="font-semibold text-gray-900">Invalid reset link</p>
              <p className="text-gray-500 text-sm">This link is missing a reset token. Please request a new one.</p>
              <Link to="/login" className="inline-block text-sm text-[#3d7a20] hover:underline font-medium no-underline">
                ← Back to Sign In
              </Link>
            </div>
          ) : done ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#f5f9f7] flex items-center justify-center mx-auto">
                <TiIcon name="check" size={26} className="text-[#3d7a20]" />
              </div>
              <p className="font-semibold text-gray-900">Password updated!</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your password has been reset successfully. Redirecting you to sign in…
              </p>
              <Link to="/login" className="inline-block text-sm text-[#3d7a20] hover:underline font-medium no-underline">
                Sign In now →
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-3xl font-bold text-gray-900 mb-1">Set new password</h1>
              <p className="text-gray-500 text-sm mb-7">Enter and confirm your new password below.</p>

              <form onSubmit={(e) => { void handleSubmit(e) }} className="space-y-4">
                {error && (
                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                      {error}
                    </div>
                    {resendSent ? (
                      <div className="bg-[#f5f9f7] border border-[#3d7a20]/20 text-[#3d7a20] text-sm px-4 py-3 rounded-xl">
                        ✓ New reset link sent — check your inbox and spam folder.
                      </div>
                    ) : !showResend ? (
                      <button
                        type="button"
                        onClick={() => setShowResend(true)}
                        className="text-sm text-[#3d7a20] hover:underline font-medium"
                      >
                        Request a new reset link →
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500">Enter your email to receive a fresh link:</p>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            value={resendEmail}
                            onChange={(e) => setResendEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3d7a20] focus:ring-2 focus:ring-[#3d7a20]/10 transition bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => { void handleResend() }}
                            disabled={resendLoading || !resendEmail}
                            className="px-4 py-2.5 bg-[#3d7a20] text-white rounded-xl text-sm font-semibold hover:bg-[#2a5a14] transition-colors disabled:opacity-50 flex-shrink-0"
                          >
                            {resendLoading ? '…' : 'Send'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="rp-pw">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="rp-pw"
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      required
                      minLength={8}
                      className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3d7a20] focus:ring-2 focus:ring-[#3d7a20]/10 transition bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      <TiIcon name="eye" size={17} className="text-gray-400" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="rp-confirm">
                    Confirm password
                  </label>
                  <input
                    id="rp-confirm"
                    type={showPw ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3d7a20] focus:ring-2 focus:ring-[#3d7a20]/10 transition bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3d7a20] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#2a5a14] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating…' : 'Reset Password'}
                </button>

                <Link
                  to="/login"
                  className="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors no-underline"
                >
                  ← Back to Sign In
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
