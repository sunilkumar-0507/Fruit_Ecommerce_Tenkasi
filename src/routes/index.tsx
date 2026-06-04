import { createFileRoute, Link } from '@tanstack/react-router'
import { ShoppingCart, Leaf, Zap, Award, Truck, Smartphone } from 'lucide-react'
import { useState, useEffect } from 'react'
import ProductCard from '#/components/ProductCard'
import CategoryCard from '#/components/CategoryCard'
import TestimonialCard from '#/components/TestimonialCard'
import WelcomeScreen from '#/components/WelcomeScreen'
import { PRODUCTS, HOME_CATEGORIES } from '#/data/products'
import type { Product } from '#/data/products'
import { api, isApiMode, type ProductDto, type ProductDtoPagedResult } from '#/lib/apiClient'

export const Route = createFileRoute('/')({ component: HomePage })

function mapProduct(p: ProductDto): Product {
  const primary = (p.images ?? []).find((i) => i.isPrimary) ?? (p.images ?? [])[0]
  return {
    id: p.id,
    name: p.nameEn ?? '',
    nameTamil: p.nameTa ?? '',
    category: p.category?.nameEn ?? '',
    categorySlug: p.category?.slug ?? '',
    price: p.price,
    originalPrice: p.originalPrice ?? p.price,
    image: primary?.url ?? '/images/products/p-mango.jpg',
    rating: p.rating ?? 4.5,
    reviews: 0,
    unit: 'per unit',
    featured: true,
  }
}

const DEMO_FEATURED = PRODUCTS.filter((p) => p.featured)

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Regular Customer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    testimonial: "The freshness of fruits from Tenkasi Fresh is unmatched! I've been a customer for 2 years.",
    rating: 5,
  },
  {
    name: 'Rajesh Kumar',
    role: 'Business Owner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    testimonial: 'Perfect for my restaurant. Always consistent quality and timely delivery.',
    rating: 5,
  },
  {
    name: 'Anjali Desai',
    role: 'Home Chef',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    testimonial: 'Premium quality at reasonable prices. My family loves the organic selection!',
    rating: 5,
  },
  {
    name: 'Vikram Singh',
    role: 'Health Enthusiast',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    testimonial: "Best organic fruits I've found. Supporting local farming has never been easier.",
    rating: 5,
  },
]

function HomePage() {
  // Show welcome if: first visit this session (!tf_home_seen) OR coming from login (tf_show_welcome)
  const [showWelcome] = useState(() => {
    try {
      return !sessionStorage.getItem('tf_home_seen') || !!sessionStorage.getItem('tf_show_welcome')
    } catch { return true }
  })
  const [homeVisible, setHomeVisible] = useState(() => {
    try {
      return !!sessionStorage.getItem('tf_home_seen') && !sessionStorage.getItem('tf_show_welcome')
    } catch { return false }
  })
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [featured, setFeatured] = useState<Product[]>(isApiMode() ? [] : DEMO_FEATURED)
  const [featuredLoading, setFeaturedLoading] = useState(isApiMode())

  useEffect(() => {
    if (!isApiMode()) return
    api.get<ProductDtoPagedResult>('/api/Products?PageSize=8')
      .then((result) => setFeatured((result.items ?? []).map(mapProduct)))
      .catch(() => setFeatured(DEMO_FEATURED))
      .finally(() => setFeaturedLoading(false))
  }, [])

  function handleWelcomeDone() {
    try {
      sessionStorage.setItem('tf_home_seen', '1')
      sessionStorage.removeItem('tf_show_welcome')
    } catch {}
    setHomeVisible(true)
  }

  return (
    <>
      {showWelcome && <WelcomeScreen onDone={handleWelcomeDone} />}
      <main
        className="bg-[#faf9f4] min-h-screen overflow-hidden"
        style={{
          opacity: homeVisible ? 1 : 0,
          transform: homeVisible ? 'translateY(0)' : 'translateY(18px)',
          transition: homeVisible ? 'opacity 0.85s ease, transform 0.85s cubic-bezier(0.16,1,0.3,1)' : 'none',
          pointerEvents: homeVisible ? 'auto' : 'none',
        }}
      >
      {/* HERO */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 z-10">
              <div className="inline-flex items-center gap-2 bg-[#e7f3ec] px-4 py-2 rounded-full">
                <span className="text-xl">🌱</span>
                <span className="text-[#2f6a4a] font-semibold text-sm">
                  Mampalam season is here — மாம்பழ பருவம்
                </span>
              </div>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Sun-ripened,<br />
                bounty from the<br />
                foothills of{' '}
                <span className="text-[#2f6a4a]">Tenkasi</span>.
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-lg leading-relaxed">
                Harvested at dawn. Wrapped in banana leaves. Delivered by dusk across{' '}
                <span className="text-[#2f6a4a] font-semibold">Tamil Nadu</span> — directly
                from our 240+ farmer families.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/shop"
                  className="bg-[#2f6a4a] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#1f4a2f] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 no-underline"
                >
                  <ShoppingCart size={20} />
                  Shop Now
                </Link>
                <Link
                  to="/seasonal"
                  className="border-2 border-[#2f6a4a] text-[#2f6a4a] px-8 py-3 rounded-full font-semibold hover:bg-[#2f6a4a] hover:text-white transition-all duration-300 flex items-center justify-center no-underline"
                >
                  Explore Seasonal
                </Link>
              </div>
            </div>

            <div className="relative h-96 sm:h-[500px] lg:h-[540px]">
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/categories/hero-fruits.jpeg"
                  alt="Fresh Fruits"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute top-6 right-6 bg-[#2f6a4a] text-white rounded-2xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🌿</span>
                  <span className="font-bold text-sm">100% Chemical free</span>
                </div>
                <p className="text-[10px] font-bold tracking-widest text-[#d4af37]">
                  NO CARBIDE RIPENING
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#2f6a4a] mb-3">
              Shop by Category
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Browse our carefully curated selection of fresh and organic fruits
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {HOME_CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.name}
                name={cat.name}
                image={cat.image}
                productCount={cat.productCount}
              />
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                Bestseller Products
              </h2>
              <p className="text-gray-400">Most loved by our customers</p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:block text-[#2f6a4a] font-semibold text-sm hover:underline no-underline"
            >
              View all →
            </Link>
          </div>
          {featuredLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-2 border-[#2f6a4a] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.slice(0, 8).map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#2f6a4a] mb-3">
              Why Choose Tenkasi Fresh?
            </h2>
            <p className="text-gray-500 text-lg">We deliver excellence in every bite</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Leaf size={28} />, title: 'Organic & Natural', desc: 'Pesticide-free fruits grown in natural conditions' },
              { icon: <Zap size={28} />, title: 'Farm Fresh', desc: 'Picked and delivered within 24 hours' },
              { icon: <Award size={28} />, title: 'Quality Assured', desc: 'Stringent quality checks at every step' },
              { icon: <Truck size={28} />, title: 'Fast Delivery', desc: 'Same-day delivery available across Tamil Nadu' },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex justify-center mb-4 text-[#2f6a4a]">{item.icon}</div>
                <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FESTIVAL BANNER */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-[#2f6a4a] to-[#1a3d2b] rounded-3xl overflow-hidden p-10 sm:p-16 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 max-w-xl">
              <p className="text-[#d4af37] text-xs font-bold tracking-widest uppercase mb-3">
                Limited Time
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
                Festival Season Mega Sale
              </h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Celebrate with us! Get up to 50% off on premium fruits and festival baskets.
              </p>
              <Link
                to="/baskets"
                className="inline-block bg-[#d4af37] text-[#1a3d2b] px-8 py-3 rounded-full font-bold hover:bg-[#e6c447] transition-colors no-underline"
              >
                Shop Festival Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
              What Our Customers Say
            </h2>
            <p className="text-gray-500 text-lg">Real experiences from real customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {TESTIMONIALS.map((t, idx) => (
              <TestimonialCard key={idx} {...t} />
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="w-11 h-11 rounded-full border-2 border-[#2f6a4a] text-[#2f6a4a] font-bold hover:bg-[#2f6a4a] hover:text-white transition-all"
              aria-label="Previous"
            >
              ←
            </button>
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  aria-label={`Testimonial ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === currentTestimonial ? 'bg-[#2f6a4a] w-7' : 'bg-gray-300 w-2.5'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)}
              className="w-11 h-11 rounded-full border-2 border-[#2f6a4a] text-[#2f6a4a] font-bold hover:bg-[#2f6a4a] hover:text-white transition-all"
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* APP PROMO */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-[#2f6a4a]/90 to-[#4fb8b2]/90 rounded-3xl overflow-hidden p-10 sm:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-white space-y-5">
                <h2 className="font-serif text-4xl sm:text-5xl font-bold">Download Our App</h2>
                <p className="text-white/85 text-lg leading-relaxed">
                  Shop anytime, anywhere! Get exclusive app-only deals and live order tracking.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    className="bg-white text-[#2f6a4a] px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform inline-flex items-center justify-center gap-2"
                  >
                    📱 App Store
                  </button>
                  <button
                    type="button"
                    className="bg-white text-[#2f6a4a] px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform inline-flex items-center justify-center gap-2"
                  >
                    🤖 Play Store
                  </button>
                </div>
                <div className="flex gap-8 pt-2">
                  <div>
                    <p className="text-white/70 text-xs">App Downloads</p>
                    <p className="text-2xl font-bold">500K+</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">User Rating</p>
                    <p className="text-2xl font-bold">4.8 ★</p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="w-44 h-80 bg-white/10 rounded-3xl border-2 border-white/20 flex items-center justify-center">
                  <Smartphone size={72} className="text-white opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  )
}
