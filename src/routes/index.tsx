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
import { extractFruitType } from '#/lib/fruitKeywords'
import { useLang } from '#/contexts/LanguageContext'

export const Route = createFileRoute('/')({ component: HomePage })

function mapProduct(p: ProductDto): Product {
  const primary = (p.images ?? []).find((i) => i.isPrimary) ?? (p.images ?? [])[0]
  return {
    id: p.id,
    slug: p.slug ?? undefined,
    name: p.nameEn ?? '',
    nameTamil: p.nameTa ?? '',
    category: p.category?.nameEn ?? '',
    categorySlug: p.category?.slug ?? '',
    price: p.price,
    originalPrice: p.originalPrice ?? p.price,
    image: primary?.url ?? '/images/products/p-mango.jpg',
    rating: p.rating ?? 4.5,
    reviews: 0,
    unit: 'per kg',
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
  const { lang, t } = useLang()
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
  type HomeCat = { name: string; image: string; productCount: number }
  const [liveCategories, setLiveCategories] = useState<HomeCat[]>([])

  useEffect(() => {
    if (!isApiMode()) return
    let alive = true
    api.get<ProductDtoPagedResult>('/api/Products?PageSize=100')
      .then((result) => {
        if (!alive) return
        const products = (result.items ?? []).map(mapProduct)
        setFeatured(products.slice(0, 8))
        setFeaturedLoading(false)

        // Group by fruit type extracted from product name (e.g. "Alphonso Mango" → "Mango")
        const catMap = new Map<string, { count: number; image: string }>()
        for (const p of products) {
          const key = extractFruitType(p.name) ?? p.category
          if (!key) continue
          if (!catMap.has(key)) catMap.set(key, { count: 0, image: p.image })
          catMap.get(key)!.count++
        }
        setLiveCategories(
          Array.from(catMap.entries()).map(([name, { count, image }]) => ({ name, image, productCount: count }))
        )
      })
      .catch(() => {
        if (!alive) return
        setFeatured(DEMO_FEATURED)
        setFeaturedLoading(false)
      })
    return () => { alive = false }
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
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                {lang === 'ta' ? (
                  <>வெயிலில் பழுத்த,<br />மேற்கு தொடர்ச்சி மலை<br /><span className="text-[#3d7a20]">டெங்காசியின்</span> கொடை.</>
                ) : (
                  <>Sun-ripened,<br />bounty from the<br />foothills of{' '}<span className="text-[#3d7a20]">Tenkasi</span>.</>
                )}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-lg leading-relaxed">
                {lang === 'ta' ? (
                  <>விடியற்காலையில் அறுவடை. வாழை இலைகளில் மூட்டு. <span className="text-[#3d7a20] font-semibold">தமிழ்நாடு</span> முழுவதும் சாயங்காலத்திற்கு முன் டெலிவரி — நேரடியாக எங்கள் 240+ விவசாயி குடும்பங்களிடமிருந்து.</>
                ) : (
                  <>Harvested at dawn. Wrapped in banana leaves. Delivered by dusk across{' '}<span className="text-[#3d7a20] font-semibold">Tamil Nadu</span> — directly from our 240+ farmer families.</>
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/shop"
                  className="bg-[#3d7a20] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2a5a14] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 no-underline"
                >
                  <ShoppingCart size={20} />
                  {t('Shop Now', 'இப்போது வாங்குங்கள்')}
                </Link>
                <Link
                  to="/seasonal"
                  className="border-2 border-[#3d7a20] text-[#3d7a20] px-8 py-3 rounded-full font-semibold hover:bg-[#3d7a20] hover:text-white transition-all duration-300 flex items-center justify-center no-underline"
                >
                  {t('Explore Seasonal', 'பருவகாலத்தை ஆராயுங்கள்')}
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
              <div className="absolute top-6 right-6 bg-[#3d7a20] text-white rounded-2xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🌿</span>
                  <span className="font-bold text-sm">{t('100% Farm Fresh', '100% பண்ணை புதியது')}</span>
                </div>
                <p className="text-[10px] font-bold tracking-widest text-[#f5821f]">
                  {t('DIRECT FROM FARMERS', 'நேரடியாக விவசாயிகளிடமிருந்து')}
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
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#3d7a20] mb-3">
              {t('Shop by Category', 'வகைப்படி கடையில் வாங்குங்கள்')}
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              {t('Browse our carefully curated selection of fresh and organic fruits', 'புதிய மற்றும் இயற்கை பழங்களின் எங்கள் தெரிவுசெய்யப்பட்ட தொகுப்பை உலாவுங்கள்')}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {(isApiMode() && liveCategories.length > 0 ? liveCategories : HOME_CATEGORIES).map((cat) => (
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
                {t('Bestseller Products', 'அதிகம் விற்பனையான பொருட்கள்')}
              </h2>
              <p className="text-gray-400">{t('Most loved by our customers', 'எங்கள் வாடிக்கையாளர்கள் அதிகம் விரும்புவது')}</p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:block text-[#3d7a20] font-semibold text-sm hover:underline no-underline"
            >
              {t('View all →', 'அனைத்தும் காண →')}
            </Link>
          </div>
          {featuredLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-2 border-[#3d7a20] border-t-transparent rounded-full animate-spin" />
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
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-[#3d7a20] mb-3">
              {t('Why Choose Tenkasi Fresh?', 'ஏன் டெங்காசி பிரெஷ் தேர்வு செய்ய வேண்டும்?')}
            </h2>
            <p className="text-gray-500 text-lg">{t('We deliver excellence in every bite', 'ஒவ்வொரு கடியிலும் சிறந்த தரம் வழங்குகிறோம்')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Leaf size={28} />, title: t('Organic & Natural', 'இயற்கை மற்றும் கேமிக்கல் இல்லாதது'), desc: t('Pesticide-free fruits grown in natural conditions', 'இயற்கை சூழலில் பூச்சிக்கொல்லி இல்லாமல் வளர்க்கப்பட்ட பழங்கள்') },
              { icon: <Zap size={28} />, title: t('Farm Fresh', 'பண்ணை புதியது'), desc: t('Picked and delivered within 24 hours', '24 மணி நேரத்திற்குள் பறித்து டெலிவரி செய்யப்படும்') },
              { icon: <Award size={28} />, title: t('Quality Assured', 'தரம் உறுதி'), desc: t('Stringent quality checks at every step', 'ஒவ்வொரு கட்டத்திலும் கடுமையான தர சோதனை') },
              { icon: <Truck size={28} />, title: t('Fast Delivery', 'விரைவான டெலிவரி'), desc: t('Quick delivery available across Tamil Nadu', 'தமிழ்நாடு முழுவதும் விரைவான டெலிவரி கிடைக்கும்') },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex justify-center mb-4 text-[#3d7a20]">{item.icon}</div>
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
          <div className="bg-gradient-to-r from-[#3d7a20] to-[#0c1d2b] rounded-3xl overflow-hidden p-10 sm:p-16 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#f5821f]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 max-w-xl">
              <p className="text-[#f5821f] text-xs font-bold tracking-widest uppercase mb-3">
                {t('Limited Time', 'குறைந்த காலம் மட்டுமே')}
              </p>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
                {t('Festival Season Mega Sale', 'விழா காலத்தில் மகா தள்ளுபடி')}
              </h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                {t('Celebrate with us! Get up to 50% off on premium fruits and festival baskets.', 'எங்களுடன் கொண்டாடுங்கள்! உயர்தர பழங்கள் மற்றும் விழா கூடைகளில் 50% வரை தள்ளுபடி.')}
              </p>
              <Link
                to="/baskets"
                className="inline-block bg-[#f5821f] text-[#0c1d2b] px-8 py-3 rounded-full font-bold hover:bg-[#f59a2e] transition-colors no-underline"
              >
                {t('Shop Festival Deals', 'விழா சலுகைகளை வாங்குங்கள்')}
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
              {t('What Our Customers Say', 'எங்கள் வாடிக்கையாளர்கள் என்ன சொல்கிறார்கள்')}
            </h2>
            <p className="text-gray-500 text-lg">{t('Real experiences from real customers', 'உண்மையான வாடிக்கையாளர்களின் உண்மையான அனுபவங்கள்')}</p>
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
              className="w-11 h-11 rounded-full border-2 border-[#3d7a20] text-[#3d7a20] font-bold hover:bg-[#3d7a20] hover:text-white transition-all"
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
                    idx === currentTestimonial ? 'bg-[#3d7a20] w-7' : 'bg-gray-300 w-2.5'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)}
              className="w-11 h-11 rounded-full border-2 border-[#3d7a20] text-[#3d7a20] font-bold hover:bg-[#3d7a20] hover:text-white transition-all"
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-[#0c1d2b] to-[#3d7a20] rounded-3xl overflow-hidden p-10 sm:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-white space-y-5">
                <p className="text-[#f5821f] text-xs font-bold tracking-widest uppercase">{t('About Us', 'எங்களைப் பற்றி')}</p>
                <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
                  {lang === 'ta' ? (
                    <>டெங்காசியில் வேரூன்றியது,<br />தமிழ்நாடு முழுவதும் நம்பகமானது</>
                  ) : (
                    <>Rooted in Tenkasi,<br />trusted across Tamil Nadu</>
                  )}
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  {t(
                    'Established in 1959, O.1919 Tenkasi Shencottai Taluks Agricultural Producers Cooperative is a network of 240+ farming families from the Western Ghats foothills. We cut out the middlemen and bring tropical fruits from our soil to your doorstep — fresh, chemical-free, and fairly priced.',
                    '1959இல் நிறுவப்பட்ட O.1919 டெங்காசி செங்கோட்டை தாலுக்கா விவசாய உற்பத்தியாளர் கூட்டுறவு, மேற்கு தொடர்ச்சி மலையடிவாரத்திலிருந்து 240+ விவசாயி குடும்பங்களின் வலையமைப்பு. இடைத்தரகர்களை கடந்து, எங்கள் மண்ணிலிருந்து நேரடியாக உங்கள் வீட்டுக்கு — புதியதாக, கேமிக்கல் இல்லாமல், நியாயமான விலையில்.'
                  )}
                </p>
                <Link
                  to="/about"
                  className="inline-block bg-[#f5821f] text-[#0c1d2b] px-8 py-3 rounded-full font-bold hover:bg-[#f59a2e] transition-colors no-underline mt-2"
                >
                  {t('Read More →', 'மேலும் படிக்க →')}
                </Link>
              </div>
              <div className="hidden lg:flex justify-center items-center">
                <div className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-5">
                  <img src="/images/products/CoopLogo.png" alt="O.1919 Cooperative" className="w-40 h-40 object-contain" />
                  <div className="w-full h-px bg-gray-100" />
                  <img src="/images/products/LogoTop.jpeg" alt="Tenkasi Fresh" className="w-36 h-36 object-contain rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* APP PROMO */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-[#3d7a20]/90 to-[#4fb8b2]/90 rounded-3xl overflow-hidden p-10 sm:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-white space-y-5">
                <h2 className="font-serif text-4xl sm:text-5xl font-bold">{t('Download Our App', 'எங்கள் செயலியை பதிவிறக்குங்கள்')}</h2>
                <p className="text-white/85 text-lg leading-relaxed">
                  {t('Shop anytime, anywhere! Get exclusive app-only deals and live order tracking.', 'எப்போதும், எங்கும் வாங்குங்கள்! செயலி மட்டும் சலுகைகளும் நேரடி ஆர்டர் கண்காணிப்பும் பெறுங்கள்.')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {/* App Store */}
                  <button type="button" className="flex items-center gap-2.5 bg-black text-white px-5 py-3 rounded-xl hover:scale-105 transition-transform">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-[10px] opacity-70 leading-none">Download on the</p>
                      <p className="font-bold leading-tight text-sm">App Store</p>
                    </div>
                  </button>
                  {/* Google Play */}
                  <button type="button" className="flex items-center gap-2.5 bg-black text-white px-5 py-3 rounded-xl hover:scale-105 transition-transform">
                    <svg width="20" height="20" viewBox="0 0 512 512">
                      <path fill="#EA4335" d="M325.3 234.3L104.6 13l280.8 161.2z"/>
                      <path fill="#FBBC04" d="M396.8 293l-71.5-58.7-220.7 .3 220.7 221.7z"/>
                      <path fill="#34A853" d="M104.6 13L325.3 234.3l71.5-58.7z"/>
                      <path fill="#4285F4" d="M104.6 13L47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3L325.3 234.3z"/>
                    </svg>
                    <div className="text-left">
                      <p className="text-[10px] opacity-70 leading-none">Get it on</p>
                      <p className="font-bold leading-tight text-sm">Google Play</p>
                    </div>
                  </button>
                </div>
                <div className="flex gap-8 pt-2">
                  <div>
                    <p className="text-white/70 text-xs">{t('App Downloads', 'செயலி பதிவிறக்கங்கள்')}</p>
                    <p className="text-2xl font-bold">500K+</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">{t('User Rating', 'பயனர் மதிப்பீடு')}</p>
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
