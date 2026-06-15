import { createFileRoute } from '@tanstack/react-router'
import { Bell, MapPin, Zap, Star, Shield, Smartphone } from 'lucide-react'

export const Route = createFileRoute('/mobile-app')({ component: MobileAppPage })

const FEATURES = [
  {
    icon: <Bell size={22} className="text-[#3d7a20]" />,
    title: 'Harvest alerts',
    desc: 'Get notified the moment your favourite seasonal fruit arrives.',
  },
  {
    icon: <MapPin size={22} className="text-[#3d7a20]" />,
    title: 'Live tracking',
    desc: 'Track your order from our orchard to your doorstep in real time.',
  },
  {
    icon: <Zap size={22} className="text-[#3d7a20]" />,
    title: '1-tap reorder',
    desc: 'Reorder your favourites with a single tap. Smart basket suggestions.',
  },
  {
    icon: <Star size={22} className="text-[#3d7a20]" />,
    title: 'App-only deals',
    desc: 'Exclusive discounts and early access to festival hampers.',
  },
  {
    icon: <Shield size={22} className="text-[#3d7a20]" />,
    title: 'Verified freshness',
    desc: 'Every product backed by a freshness guarantee with farmer traceability.',
  },
  {
    icon: <Smartphone size={22} className="text-[#3d7a20]" />,
    title: 'Offline mode',
    desc: 'Browse catalogue and manage your wishlist even without internet.',
  },
]

const REVIEWS = [
  { name: 'Kavitha R.', stars: 5, text: 'The app is so smooth! I love the harvest alerts — ordered mangoes the day they arrived.' },
  { name: 'Murugan P.', stars: 5, text: 'Live tracking is a game-changer. I always know exactly when my order arrives.' },
  { name: 'Anitha S.', stars: 5, text: 'Exclusive app deals saved me ₹400 on a Pongal basket. Highly recommend!' },
]

function MobileAppPage() {
  return (
    <main className="min-h-screen bg-[#faf9f4]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0c1d2b] via-[#3d7a20] to-[#4fb8b2] text-white px-4 py-20 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#f5821f] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#f5821f] text-xs font-bold tracking-widest uppercase mb-4">
              Tenkasi Fresh App
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold mb-5 leading-tight">
              Fresh fruits,<br />one tap away
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">
              Shop anytime, track your delivery live, and never miss a harvest. Available on iOS and Android.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              {/* App Store */}
              <button type="button" className="flex items-center gap-3 bg-black text-white px-6 py-3.5 rounded-xl hover:scale-105 transition-transform">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] opacity-70 leading-none">Download on the</p>
                  <p className="font-bold leading-tight text-sm">App Store</p>
                </div>
              </button>
              {/* Google Play */}
              <button type="button" className="flex items-center gap-3 bg-black text-white px-6 py-3.5 rounded-xl hover:scale-105 transition-transform">
                <svg width="22" height="22" viewBox="0 0 512 512">
                  <path fill="#EA4335" d="M325.3 234.3L104.6 13l280.8 161.2z"/>
                  <path fill="#FBBC04" d="M396.8 293l-71.5-58.7-220.7 .3 220.7 221.7z" />
                  <path fill="#34A853" d="M104.6 13L325.3 234.3l71.5-58.7z" />
                  <path fill="#4285F4" d="M104.6 13L47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3L325.3 234.3z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] opacity-70 leading-none">Get it on</p>
                  <p className="font-bold leading-tight text-sm">Google Play</p>
                </div>
              </button>
            </div>
            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-bold">500K+</p>
                <p className="text-white/60 text-xs">Downloads</p>
              </div>
              <div>
                <p className="text-2xl font-bold">4.8 ★</p>
                <p className="text-white/60 text-xs">App Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-white/60 text-xs">On-time delivery</p>
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-56 h-[460px] bg-[#0f1f18] rounded-[2.5rem] border-4 border-white/20 shadow-2xl flex flex-col overflow-hidden">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-white/30 rounded-full" />
              {/* App screen */}
              <div className="mt-10 mx-3 flex-1 bg-[#faf9f4] rounded-[1.5rem] overflow-hidden p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-[#3d7a20] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-serif font-bold">த</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-none">Tenkasi Fresh</p>
                    <p className="text-[9px] text-gray-400">Farm to Home</p>
                  </div>
                </div>
                <div className="bg-[#3d7a20] rounded-xl p-3 mb-3">
                  <p className="text-white text-[10px] font-bold">Mango Season 🥭</p>
                  <p className="text-white/70 text-[9px]">25% off this week</p>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2 bg-white rounded-lg p-2 mb-2 shadow-sm">
                    <div className="w-8 h-8 bg-[#f5f0e8] rounded-lg" />
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 rounded w-3/4 mb-1" />
                      <div className="h-1.5 bg-gray-100 rounded w-1/2" />
                    </div>
                    <div className="w-6 h-6 bg-[#3d7a20] rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Everything you need in one app
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Designed from the ground up for a seamless farm-to-table experience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-11 h-11 bg-[#fdf4e8] rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8 text-center">
            What users say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-[#faf9f4] rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(r.stars)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{r.text}"</p>
                <p className="text-sm font-semibold text-gray-900">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-[#faf9f4] border-t border-gray-100">
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-3">
            Download the app today
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Join 500,000+ customers who get their fruits fresh from Tenkasi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button type="button" className="flex items-center gap-3 bg-black text-white px-6 py-3.5 rounded-xl hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <p className="text-[10px] opacity-70 leading-none">Download on the</p>
                <p className="font-bold leading-tight text-sm">App Store</p>
              </div>
            </button>
            <button type="button" className="flex items-center gap-3 bg-black text-white px-6 py-3.5 rounded-xl hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 512 512">
                <path fill="#EA4335" d="M325.3 234.3L104.6 13l280.8 161.2z"/>
                <path fill="#FBBC04" d="M396.8 293l-71.5-58.7-220.7 .3 220.7 221.7z" />
                <path fill="#34A853" d="M104.6 13L325.3 234.3l71.5-58.7z" />
                <path fill="#4285F4" d="M104.6 13L47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3L325.3 234.3z" />
              </svg>
              <div className="text-left">
                <p className="text-[10px] opacity-70 leading-none">Get it on</p>
                <p className="font-bold leading-tight text-sm">Google Play</p>
              </div>
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
