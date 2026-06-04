interface MarqueeProps {
  items: string[]
  speed?: number
}

export default function Marquee({ items }: MarqueeProps) {
  return (
    <div className="overflow-hidden bg-gradient-to-r from-[#3d7a20] via-[#4fb8b2] to-[#3d7a20] py-4">
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-content {
          animation: marquee 30s linear infinite;
        }
      `}</style>
      <div className="marquee-content flex gap-8 whitespace-nowrap">
        {/* Duplicate items for seamless loop */}
        {[...items, ...items].map((item, idx) => (
          <div key={idx} className="inline-flex items-center gap-8 flex-shrink-0">
            <span className="text-2xl sm:text-3xl text-white">{item}</span>
            <span className="text-2xl text-white/40">✦</span>
          </div>
        ))}
      </div>
    </div>
  )
}
