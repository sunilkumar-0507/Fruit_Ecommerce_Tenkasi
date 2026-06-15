import { useEffect, useState } from 'react'
import { PRODUCTS } from '#/data/products'

const SEASONAL = PRODUCTS.filter((p) => p.seasonal || p.categorySlug === 'seasonal-fruits')

interface Props {
  onDone: () => void
}

export default function WelcomeScreen({ onDone }: Props) {
  const [cardVisible, setCardVisible] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [featured] = useState(() => {
    const list = SEASONAL.length > 0 ? SEASONAL : PRODUCTS
    return list[Math.floor(Math.random() * list.length)]
  })

  useEffect(() => {
    const timers = [
      setTimeout(() => setCardVisible(true), 900),
      setTimeout(() => setExiting(true), 2700),
      setTimeout(onDone, 3400),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #071510 0%, #0c1d2b 52%, #0a1f14 100%)',
        opacity: exiting ? 0 : 1,
        transition: exiting ? 'opacity 0.7s ease' : 'none',
        pointerEvents: exiting ? 'none' : 'auto',
      }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(47,106,74,0.25), transparent 70%)', top: '-8%', right: '-6%' }} />
        <div className="absolute rounded-full" style={{ width: 300, height: 300, background: 'radial-gradient(circle, rgba(212,175,55,0.10), transparent 70%)', bottom: '-6%', left: '-4%' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5 px-6 w-full max-w-xs sm:max-w-sm">

        {/* Branding — shows immediately */}
        <div
          className="flex flex-col items-center gap-3 text-center"
          style={{
            opacity: 1,
            animation: 'welcome-fade-up 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards',
          }}
        >
          <div className="flex items-center gap-3" style={{ filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.35))' }}>
            <img
              src="/images/products/CoopLogo.png"
              alt="Tenkasi Fresh Coop"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-contain"
            />
            <img
              src="/images/products/MainLogo.jpeg"
              alt="Tenkasi Fresh"
              className="h-24 sm:h-32 w-auto rounded-2xl object-contain"
            />
          </div>
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide leading-tight">
              Tenkasi Fresh
            </h1>
            <p className="text-[#f5821f] text-sm font-medium mt-1 tracking-wider">
              நம்ம ஊர் பழங்கள்
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full" style={{ opacity: 0.32 }}>
          <div className="flex-1 h-px bg-[#f5821f]/60" />
          <span className="text-[#f5821f] text-[10px] font-bold tracking-widest uppercase">Season's Best</span>
          <div className="flex-1 h-px bg-[#f5821f]/60" />
        </div>

        {/* Seasonal product card */}
        <div
          className="w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(14px)',
            opacity: cardVisible ? 1 : 0,
            transform: cardVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.88)',
            transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <div className="relative h-40 sm:h-48 overflow-hidden">
            <img src={featured.image} alt={featured.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-[#f5821f] bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest">
              🌿 Now in Season
            </span>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{featured.name}</p>
              <p className="text-white/50 text-[11px] mt-0.5">{featured.nameTamil}</p>
            </div>
            <div className="text-right">
              <p className="text-[#f5821f] font-bold text-base">₹{featured.price}</p>
              <p className="text-white/40 text-[10px]">/ {featured.unit}</p>
            </div>
          </div>
        </div>

        {/* Bottom tag line */}
        <p
          className="text-white/35 text-xs text-center"
          style={{
            opacity: cardVisible ? 1 : 0,
            transition: 'opacity 0.5s ease 0.4s',
          }}
        >
          வணக்கம் · Vanakkam · Welcome
        </p>

      </div>

      <style>{`
        @keyframes welcome-fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
