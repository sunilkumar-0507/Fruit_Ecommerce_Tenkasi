import { useEffect, useState } from 'react'
import { PRODUCTS } from '#/data/products'

const SEASONAL = PRODUCTS.filter((p) => p.seasonal || p.categorySlug === 'seasonal-fruits')

type Phase = 0 | 1 | 2 | 3 | 4 | 5

function show(phase: Phase, min: Phase) {
  return phase >= min
}

function FarmerAvatar({ pulling }: { pulling: boolean }) {
  return (
    <div
      style={{
        transform: pulling
          ? 'perspective(280px) rotateY(-18deg) rotateX(4deg)'
          : 'perspective(280px) rotateY(-8deg)',
        transition: 'transform 0.55s cubic-bezier(0.34, 1.4, 0.64, 1)',
        filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.45))',
      }}
    >
      <svg width="86" height="116" viewBox="0 0 86 116" xmlns="http://www.w3.org/2000/svg">
        {/* Ground shadow */}
        <ellipse cx="43" cy="112" rx="22" ry="5" fill="rgba(0,0,0,0.28)" />

        {/* Legs */}
        <rect x="28" y="79" width="12" height="30" rx="6" fill="#7c5c3a" />
        <rect x="46" y="79" width="12" height="30" rx="6" fill="#6f5233" />

        {/* Dhoti */}
        <path d="M18,74 Q43,87 68,74 L65,89 Q43,98 21,89 Z" fill="#f0c940" />
        <line x1="43" y1="74" x2="43" y2="98" stroke="#e0b010" strokeWidth="1.2" opacity="0.6" />

        {/* Shirt */}
        <rect x="21" y="46" width="44" height="34" rx="10" fill="#2f6a4a" />
        {/* Shirt shading */}
        <rect x="21" y="46" width="22" height="34" rx="10" fill="rgba(0,0,0,0.08)" />
        {/* Collar */}
        <path d="M34,46 L43,53 L52,46" stroke="#1a3d2b" strokeWidth="1.5" fill="none" />

        {/* Left arm */}
        <g
          style={{
            transformOrigin: '23px 56px',
            transform: pulling ? 'rotate(-38deg)' : 'rotate(10deg)',
            transition: 'transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1)',
          }}
        >
          <rect x="2" y="52" width="23" height="9" rx="4.5" fill="#a07a50" />
          <circle cx="3.5" cy="56.5" r="6" fill="#c49660" />
        </g>

        {/* Right arm */}
        <g
          style={{
            transformOrigin: '63px 56px',
            transform: pulling ? 'rotate(38deg)' : 'rotate(-10deg)',
            transition: 'transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1)',
          }}
        >
          <rect x="61" y="52" width="23" height="9" rx="4.5" fill="#a07a50" />
          <circle cx="82.5" cy="56.5" r="6" fill="#c49660" />
        </g>

        {/* Neck */}
        <rect x="36" y="43" width="14" height="8" rx="4" fill="#b08040" />

        {/* Head */}
        <circle cx="43" cy="27" r="22" fill="#c4965a" />
        {/* Head highlight */}
        <ellipse cx="36" cy="19" rx="9" ry="7" fill="rgba(255,255,255,0.13)" />

        {/* Turban */}
        <ellipse cx="43" cy="17" rx="21" ry="8" fill="#d4af37" />
        <path d="M22,17 Q43,6 64,17 L60,10 Q43,3 26,10 Z" fill="#c49a00" />
        {/* Turban jewel */}
        <circle cx="43" cy="12" r="4" fill="#1a3d2b" />
        <circle cx="43" cy="12" r="2.5" fill="#4fb8b2" />
        <circle cx="43" cy="12" r="1" fill="white" opacity="0.7" />

        {/* Eyebrows */}
        <path d="M29,22 Q34,20 38,22" stroke="#5c3010" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M48,22 Q52,20 57,22" stroke="#5c3010" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Eyes */}
        <circle cx="34" cy="27" r="3.5" fill="#1a1010" />
        <circle cx="52" cy="27" r="3.5" fill="#1a1010" />
        <circle cx="35.2" cy="26" r="1.3" fill="white" />
        <circle cx="53.2" cy="26" r="1.3" fill="white" />

        {/* Mustache */}
        <path d="M32,32 Q37,35.5 43,34 Q49,35.5 54,32" stroke="#5c2e0f" strokeWidth="1.8" fill="none" strokeLinecap="round" />

        {/* Smile */}
        <path d="M34,37 Q43,44 52,37" stroke="#7a3f1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function SeasonalRevealCard({ product }: { product: (typeof PRODUCTS)[0] }) {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex-shrink-0"
      style={{
        background: 'rgba(255,255,255,0.11)',
        backdropFilter: 'blur(14px)',
        width: 164,
      }}
    >
      <div className="h-[104px] overflow-hidden relative">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute top-2 left-2 text-[9px] font-bold text-[#d4af37] bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full uppercase tracking-widest">
          🌿 In Season
        </span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-white font-semibold text-sm leading-tight truncate">{product.name}</p>
        <p className="text-white/45 text-[11px] mt-0.5 truncate">{product.nameTamil}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[#d4af37] font-bold text-sm">₹{product.price}</p>
          <p className="text-white/40 text-[10px]">/ {product.unit}</p>
        </div>
      </div>
    </div>
  )
}

interface Props {
  onDone: () => void
}

export default function WelcomeScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<Phase>(0)
  const [exiting, setExiting] = useState(false)
  const [featured] = useState<(typeof PRODUCTS)[0]>(() => {
    const list = SEASONAL.length > 0 ? SEASONAL : PRODUCTS
    return list[Math.floor(Math.random() * list.length)]
  })

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2250),
      setTimeout(() => setPhase(4), 3100),
      setTimeout(() => { setPhase(5); setExiting(true) }, 4400),
      setTimeout(onDone, 5100),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #071510 0%, #1a3d2b 52%, #0a1f14 100%)',
        opacity: exiting ? 0 : 1,
        transition: exiting ? 'opacity 0.75s ease' : 'none',
        pointerEvents: exiting ? 'none' : 'auto',
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 480, height: 480,
            background: 'radial-gradient(circle, rgba(47,106,74,0.22), transparent 70%)',
            top: '-10%', right: '-8%',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 360, height: 360,
            background: 'radial-gradient(circle, rgba(212,175,55,0.08), transparent 70%)',
            bottom: '-8%', left: '-5%',
          }}
        />
        {/* Floating leaf particles */}
        {(['🌿', '🍃', '🌱', '🌿', '🍃', '🌱'] as const).map((leaf, i) => (
          <span
            key={i}
            className="absolute animate-float-leaf select-none"
            style={{
              left: `${6 + i * 16}%`,
              top: `${12 + (i % 3) * 24}%`,
              fontSize: `${0.95 + (i % 2) * 0.4}rem`,
              animationDelay: `${i * 0.45}s`,
              opacity: 0.18,
            }}
          >
            {leaf}
          </span>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-5 w-full max-w-xs sm:max-w-sm">

        {/* Logo + Branding */}
        <div
          className="flex flex-col items-center gap-2.5"
          style={{
            opacity: show(phase, 0) ? 1 : 0,
            transform: show(phase, 0) ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <img
            src="/images/logo.svg"
            alt="Tenkasi Fresh"
            className="w-20 h-20 sm:w-24 sm:h-24"
            style={{ filter: 'drop-shadow(0 0 22px rgba(212,175,55,0.42))' }}
          />
          <div className="text-center">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide leading-tight">
              Tenkasi Fresh
            </h1>
            <p className="text-[#d4af37] text-sm font-medium mt-1 tracking-wider">
              நம்ம ஊர் பழங்கள்
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className="flex items-center gap-3 w-full"
          style={{
            opacity: show(phase, 1) ? 0.35 : 0,
            transition: 'opacity 0.5s ease 0.1s',
          }}
        >
          <div className="flex-1 h-px bg-[#d4af37]/50" />
          <span className="text-[#d4af37] text-xs font-bold tracking-widest uppercase">Season's Best</span>
          <div className="flex-1 h-px bg-[#d4af37]/50" />
        </div>

        {/* Farmer + Product row */}
        <div
          className="flex items-center justify-center gap-3 sm:gap-5 w-full"
          style={{
            opacity: show(phase, 1) ? 1 : 0,
            transform: show(phase, 1) ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.55s ease, transform 0.55s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Farmer avatar with bounce-in */}
          <div
            style={{
              opacity: show(phase, 1) ? 1 : 0,
              transform: show(phase, 1) ? 'scale(1)' : 'scale(0.5)',
              transition: 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            <FarmerAvatar pulling={phase === 2} />
          </div>

          {/* Connecting rope */}
          <div
            className="flex-shrink-0 flex items-center"
            style={{ opacity: show(phase, 2) ? 1 : 0, transition: 'opacity 0.3s ease' }}
          >
            <svg width="32" height="12" viewBox="0 0 32 12" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0,6 Q8,2 16,6 Q24,10 32,6"
                stroke="#d4af37"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="32"
                strokeDashoffset={show(phase, 2) ? 0 : 32}
                style={{ transition: 'stroke-dashoffset 0.4s ease' }}
              />
            </svg>
          </div>

          {/* Seasonal product card */}
          <div
            style={{
              opacity: show(phase, 3) ? 1 : 0,
              transform: show(phase, 3)
                ? 'translateX(0) scale(1) perspective(400px) rotateY(0deg)'
                : 'translateX(36px) scale(0.82) perspective(400px) rotateY(18deg)',
              transition: 'opacity 0.65s ease, transform 0.65s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            <SeasonalRevealCard product={featured} />
          </div>
        </div>

        {/* Welcome text */}
        <div
          className="text-center"
          style={{
            opacity: show(phase, 4) ? 1 : 0,
            transform: show(phase, 4) ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <p className="text-white/40 text-xs mb-0.5">வணக்கம் · Vanakkam</p>
          <p className="text-[#d4af37] text-sm font-semibold">
            {featured.name} is in season 🌿
          </p>
        </div>

      </div>
    </div>
  )
}
