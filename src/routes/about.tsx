import { createFileRoute, Link } from '@tanstack/react-router'
import { MapPin, Phone, Users, Leaf, Truck, Award } from 'lucide-react'

export const Route = createFileRoute('/about')({ component: AboutPage })

const MILESTONES = [
  { year: '1987', title: 'Founded', desc: 'O.1919 Tenkasi Cooperative established by local farmers of the Western Ghats foothills.' },
  { year: '2005', title: 'Expanded Network', desc: 'Grew from 40 founding families to 100+ certified farmer partners across Tenkasi & Shencottai taluks.' },
  { year: '2018', title: 'Direct Delivery', desc: 'Launched doorstep delivery across Tamil Nadu — eliminating the middlemen, passing savings to customers.' },
  { year: '2024', title: 'Digital Platform', desc: 'Launched Tenkasi Fresh online — bringing 240+ farming families to customers across India.' },
]

const HOW_IT_WORKS = [
  { step: '01', icon: <Leaf size={22} className="text-[#2f6a4a]" />, title: 'Harvested at Dawn', desc: 'Our farmers handpick fruits at peak ripeness every morning before sunrise — no carbide, no chemicals, no shortcuts.' },
  { step: '02', icon: <Award size={22} className="text-[#2f6a4a]" />, title: 'Quality Checked', desc: 'Each lot is graded and inspected at the cooperative centre in Tenkasi for size, colour, and freshness before packing.' },
  { step: '03', icon: <Truck size={22} className="text-[#2f6a4a]" />, title: 'Packed & Dispatched', desc: 'Wrapped in banana leaves or eco-boxes and loaded into refrigerated vehicles by mid-morning for same-day dispatch.' },
  { step: '04', icon: <MapPin size={22} className="text-[#2f6a4a]" />, title: 'Delivered to Your Door', desc: 'Orders reach customers across Tamil Nadu by dusk — farm to home in under 12 hours.' },
]

const TEAM = [
  { name: 'Murugesan P.', role: 'President, Cooperative', location: 'Tenkasi' },
  { name: 'Rajan T.', role: 'Logistics Head', location: 'Courtallam' },
  { name: 'Selvam K.', role: 'Quality Manager', location: 'Alangulam' },
  { name: 'Lakshmi A.', role: 'Farmer Relations', location: 'Kadayanallur' },
]

function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf9f4]">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a3d2b] via-[#2f6a4a] to-[#4fb8b2] text-white px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#d4af37] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#d4af37] text-xs font-bold tracking-widest uppercase mb-4">Est. 1987 · Tenkasi, Tamil Nadu</p>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold mb-5 leading-tight">
              From our soil<br />to your soul.
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">
              We are a farmer cooperative — 240+ families from the Western Ghats — who grow, harvest, and deliver tropical fruits directly to your door, cutting out every middleman.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="inline-block bg-[#d4af37] text-[#1a3d2b] px-8 py-3 rounded-full font-bold hover:bg-[#e6c447] transition-colors no-underline text-center">
                Shop Now
              </Link>
              <a href="tel:+917094402579" className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-3 rounded-full font-semibold hover:border-white transition-colors no-underline">
                <Phone size={16} />
                Call Us
              </a>
            </div>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="bg-white/10 border-4 border-white/20 rounded-3xl p-10 shadow-2xl">
              <img src="/images/products/logo.png" alt="Tenkasi Fresh" className="w-52 h-52 object-contain rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#2f6a4a] text-xs font-bold tracking-widest uppercase mb-3">Who We Are</p>
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-5 leading-tight">A cooperative built on trust and terroir</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                O.1919 Tenkasi Shencottai Taluks Agricultural Producers Cooperative Marketing Society has been the backbone of fruit farming in the Tenkasi district since 1987. We are registered under the Tamil Nadu Cooperative Societies Act and operate from our centre at Rail Nagar Road, Tenkasi – 627 811.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our mandate is simple: ensure farmers receive fair prices, customers receive genuinely fresh produce, and the unique flavours of Western Ghats fruits reach every corner of Tamil Nadu without chemical intervention.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '240+', label: 'Farming Families' },
                  { value: '35+', label: 'Years of Heritage' },
                  { value: '12 hrs', label: 'Farm to Doorstep' },
                ].map((s) => (
                  <div key={s.label} className="text-center bg-[#e7f3ec] rounded-2xl py-5 px-3">
                    <p className="font-serif text-2xl font-bold text-[#2f6a4a]">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {MILESTONES.map((m) => (
                <div key={m.year} className="flex gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-14 h-14 bg-[#1a3d2b] rounded-xl flex items-center justify-center">
                    <span className="text-[#d4af37] font-bold text-sm">{m.year}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{m.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 px-4 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#2f6a4a] text-xs font-bold tracking-widest uppercase mb-3">The Process</p>
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">From the orchard to your table — every step is traceable, transparent, and timed to deliver peak freshness.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((h) => (
              <div key={h.step} className="relative bg-[#faf9f4] rounded-2xl p-6 border border-gray-100">
                <span className="absolute top-5 right-5 font-serif text-4xl font-bold text-gray-100">{h.step}</span>
                <div className="w-11 h-11 bg-[#e7f3ec] rounded-xl flex items-center justify-center mb-4 relative z-10">
                  {h.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 relative z-10">{h.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed relative z-10">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#2f6a4a] text-xs font-bold tracking-widest uppercase mb-3">Where We Are</p>
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-5">Located at the heart of Tenkasi</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our cooperative centre sits at the foothills of the Western Ghats — one of the world's richest biodiversity hotspots. The combination of altitude, rainfall, and red laterite soil makes Tenkasi ideal for growing intensely flavourful tropical fruits without artificial inputs.
              </p>
              <div className="space-y-3">
                {[
                  { icon: <MapPin size={16} className="text-[#2f6a4a]" />, text: '42C/1A Rail Nagar Road, Tenkasi – 627 811, Tamil Nadu' },
                  { icon: <Phone size={16} className="text-[#2f6a4a]" />, text: '+91 7094402579' },
                  { icon: <Users size={16} className="text-[#2f6a4a]" />, text: '240+ partner farmers across Tenkasi & Shencottai taluks' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3">
                    <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                    <p className="text-sm text-gray-700">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#1a3d2b] rounded-3xl p-8 text-white">
              <h3 className="font-serif text-2xl font-bold mb-6">Our Farming Regions</h3>
              <div className="space-y-4">
                {[
                  { region: 'Tenkasi', produce: 'Mango, Banana, Jackfruit', farmers: 80 },
                  { region: 'Courtallam', produce: 'Guava, Papaya, Soursop', farmers: 55 },
                  { region: 'Alangulam', produce: 'Banana, Jackfruit, Passion Fruit', farmers: 48 },
                  { region: 'Kadayanallur', produce: 'Pomegranate, Grapes', farmers: 35 },
                  { region: 'Sankarankovil', produce: 'Watermelon, Pineapple', farmers: 22 },
                ].map((r) => (
                  <div key={r.region} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-white">{r.region}</span>
                        <span className="text-xs text-white/50">{r.farmers} farmers</span>
                      </div>
                      <p className="text-xs text-white/60">{r.produce}</p>
                      <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#d4af37] rounded-full" style={{ width: `${(r.farmers / 80) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-3">The people behind the harvest</h2>
            <p className="text-gray-500">Dedicated leaders ensuring quality from field to doorstep.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((m) => (
              <div key={m.name} className="bg-[#faf9f4] rounded-2xl border border-gray-100 p-5 text-center">
                <div className="w-14 h-14 bg-[#e7f3ec] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users size={22} className="text-[#2f6a4a]" />
                </div>
                <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
                <p className="text-xs text-[#2f6a4a] font-medium mt-0.5">{m.role}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <MapPin size={10} /> {m.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#faf9f4] border-t border-gray-100">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-3">Taste the difference</h2>
          <p className="text-gray-500 mb-8">From 240+ farmer families in Tenkasi — straight to your table.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop" className="inline-block bg-[#2f6a4a] text-white px-8 py-3 rounded-full font-bold hover:bg-[#1f4a2f] transition-colors no-underline text-center">
              Shop Now
            </Link>
            <a href="https://wa.me/917094402579" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border-2 border-[#2f6a4a] text-[#2f6a4a] px-8 py-3 rounded-full font-semibold hover:bg-[#2f6a4a] hover:text-white transition-colors no-underline">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
