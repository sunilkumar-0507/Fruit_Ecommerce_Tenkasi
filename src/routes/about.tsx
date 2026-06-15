import { createFileRoute, Link } from '@tanstack/react-router'
import { MapPin, Phone, Users, Leaf, Truck, Award } from 'lucide-react'
import { useLang } from '#/contexts/LanguageContext'

export const Route = createFileRoute('/about')({ component: AboutPage })

const MILESTONES = [
  { year: '1959', titleEn: 'Founded', titleTa: 'நிறுவப்பட்டது', descEn: 'O.1919 Tenkasi Cooperative established by local farmers of the Western Ghats foothills to serve the farming community.', descTa: 'மேற்கு தொடர்ச்சி மலையடிவாரத்தின் உள்ளூர் விவசாயிகளால் O.1919 டெங்காசி கூட்டுறவு நிறுவப்பட்டது.' },
  { year: '2005', titleEn: 'Expanded Network', titleTa: 'வலையமைப்பு விரிவாக்கம்', descEn: 'Grew from founding families to 100+ certified farmer partners across Tenkasi & Shencottai taluks.', descTa: 'டெங்காசி & செங்கோட்டை தாலுகாக்களில் 100+ சான்றளிக்கப்பட்ட விவசாயி கூட்டாளிகளாக வளர்ந்தது.' },
  { year: '2018', titleEn: 'Direct Delivery', titleTa: 'நேரடி டெலிவரி', descEn: 'Launched doorstep delivery across Tamil Nadu — eliminating middlemen, passing savings to customers.', descTa: 'தமிழ்நாடு முழுவதும் வீட்டு வாசல் டெலிவரி தொடங்கியது — இடைத்தரகர்களை நீக்கி சேமிப்பை வாடிக்கையாளர்களுக்கு வழங்கியது.' },
  { year: '2024', titleEn: 'Digital Platform', titleTa: 'டிஜிட்டல் மேடை', descEn: 'Launched Tenkasi Fresh online — bringing 240+ farming families to customers across India.', descTa: 'டெங்காசி பிரெஷ் ஆன்லைன் தொடங்கியது — 240+ விவசாயி குடும்பங்களை இந்தியா முழுவதும் உள்ள வாடிக்கையாளர்களிடம் கொண்டு சேர்த்தது.' },
]

const HOW_IT_WORKS = [
  { step: '01', icon: <Leaf size={22} className="text-[#3d7a20]" />, titleEn: 'Harvested at Dawn', titleTa: 'விடியற்காலையில் அறுவடை', descEn: 'Our farmers handpick fruits at peak ripeness every morning before sunrise — no carbide, no chemicals, no shortcuts.', descTa: 'எங்கள் விவசாயிகள் ஒவ்வொரு காலையும் சூரிய உதயத்திற்கு முன் உச்சகட்ட பழுத்த நிலையில் கையால் பறிக்கிறார்கள்.' },
  { step: '02', icon: <Award size={22} className="text-[#3d7a20]" />, titleEn: 'Quality Checked', titleTa: 'தரம் சோதிக்கப்படுகிறது', descEn: 'Each lot is graded and inspected at the cooperative centre in Tenkasi for size, colour, and freshness before packing.', descTa: 'ஒவ்வொரு தொகுதியும் அளவு, நிறம் மற்றும் புதுமை ஆகியவற்றிற்கு டெங்காசி கூட்டுறவு மையத்தில் சோதிக்கப்படுகிறது.' },
  { step: '03', icon: <Truck size={22} className="text-[#3d7a20]" />, titleEn: 'Packed & Dispatched', titleTa: 'பொதிந்து அனுப்பப்படுகிறது', descEn: 'Wrapped in banana leaves or eco-boxes and loaded into refrigerated vehicles by mid-morning for same-day dispatch.', descTa: 'வாழை இலைகளில் அல்லது சுற்றுச்சூழல் பெட்டிகளில் மூடி, அதே நாள் அனுப்புவதற்கு குளிர்சாதன வாகனங்களில் ஏற்றப்படுகிறது.' },
  { step: '04', icon: <MapPin size={22} className="text-[#3d7a20]" />, titleEn: 'Delivered to Your Door', titleTa: 'உங்கள் வீட்டுக்கு டெலிவரி', descEn: 'Orders reach customers across Tamil Nadu by dusk — farm to home in under 12 hours.', descTa: 'ஆர்டர்கள் சாயங்காலத்திற்குள் தமிழ்நாடு முழுவதும் உள்ள வாடிக்கையாளர்களை சென்றடைகின்றன — 12 மணி நேரத்திற்குள் பண்ணையிலிருந்து வீட்டுக்கு.' },
]

function AboutPage() {
  const { lang, t } = useLang()

  return (
    <main className="min-h-screen bg-[#faf9f4]">

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0c1d2b] via-[#3d7a20] to-[#4fb8b2] text-white px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#f5821f] blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#f5821f] text-xs font-bold tracking-widest uppercase mb-4">{t('Est. 1959 · Tenkasi, Tamil Nadu', 'நி.ஆ. 1959 · டெங்காசி, தமிழ்நாடு')}</p>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold mb-5 leading-tight">
              {lang === 'ta' ? (
                <>எங்கள் மண்ணிலிருந்து<br />உங்கள் உள்ளத்திற்கு.</>
              ) : (
                <>From our soil<br />to your soul.</>
              )}
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">
              {t(
                'A farmer-centric cooperative initiative — 240+ families from the Western Ghats — creating a sustainable bridge between agricultural producers and consumers.',
                'விவசாயி மையமான கூட்டுறவு முயற்சி — மேற்கு தொடர்ச்சி மலையிலிருந்து 240+ குடும்பங்கள் — விவசாய உற்பத்தியாளர்களுக்கும் நுகர்வோருக்கும் இடையே நிலையான பாலமாக செயல்படுகிறது.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/shop" className="inline-block bg-[#f5821f] text-[#0c1d2b] px-8 py-3 rounded-full font-bold hover:bg-[#f59a2e] transition-colors no-underline text-center">
                {t('Shop Now', 'இப்போது வாங்குங்கள்')}
              </Link>
              <a href="tel:+917094402579" className="inline-flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-3 rounded-full font-semibold hover:border-white transition-colors no-underline">
                <Phone size={16} />
                {t('Call Us', 'அழைக்கவும்')}
              </a>
            </div>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="bg-white rounded-3xl p-10 shadow-2xl">
              <img src="/images/products/LogoTop.jpeg" alt="Tenkasi Fresh" className="w-52 h-52 object-contain rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* About Tenkasi Fresh */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[#3d7a20] text-xs font-bold tracking-widest uppercase mb-3">{t('About Tenkasi Fresh', 'டெங்காசி பிரெஷ் பற்றி')}</p>
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-5 leading-tight">{t('A cooperative built on trust and community', 'நம்பிக்கையிலும் சமூகத்திலும் கட்டப்பட்ட கூட்டுறவு')}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {t(
                  'Tenkasi Fresh is a farmer-centric cooperative initiative established to create a sustainable bridge between agricultural producers and consumers.',
                  'டெங்காசி பிரெஷ் என்பது விவசாய உற்பத்தியாளர்களுக்கும் நுகர்வோருக்கும் இடையே நிலையான பாலத்தை உருவாக்குவதற்கு நிறுவப்பட்ட விவசாயி மையமான கூட்டுறவு முயற்சியாகும்.'
                )}
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                {t(
                  'Supported by the cooperative ecosystem of Tenkasi District, we work closely with local farmers to source fresh, quality produce directly from farms. Our objective is to eliminate unnecessary intermediaries, ensure better returns for farmers, and provide consumers with safe and affordable agricultural products.',
                  'டெங்காசி மாவட்டத்தின் கூட்டுறவு சூழலால் ஆதரிக்கப்பட்டு, நாங்கள் உள்ளூர் விவசாயிகளுடன் நெருக்கமாக பணியாற்றுகிறோம். தேவையற்ற இடைத்தரகர்களை நீக்குவதும், விவசாயிகளுக்கு சிறந்த வருமானம் உறுதி செய்வதும், நுகர்வோருக்கு பாதுகாப்பான மற்றும் மலிவான விவசாய பொருட்கள் வழங்குவதும் எங்கள் குறிக்கோளாகும்.'
                )}
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t(
                  'We believe in transparency, sustainability, and community development. Every purchase through Tenkasi Fresh contributes to strengthening local agriculture and rural livelihoods.',
                  'நாங்கள் வெளிப்படைத்தன்மை, நிலைத்தன்மை மற்றும் சமூக வளர்ச்சியில் நம்பிக்கை கொள்கிறோம். டெங்காசி பிரெஷ் மூலம் ஒவ்வொரு கொள்முதலும் உள்ளூர் விவசாயம் மற்றும் கிராமப்புற வாழ்வாதாரங்களை வலுப்படுத்த பங்களிக்கிறது.'
                )}
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: '240+', labelEn: 'Farming Families', labelTa: 'விவசாயி குடும்பங்கள்' },
                  { value: '65+', labelEn: 'Years of Heritage', labelTa: 'ஆண்டுகள் பாரம்பரியம்' },
                  { value: '12 hrs', labelEn: 'Farm to Doorstep', labelTa: 'பண்ணையிலிருந்து வீடு' },
                ].map((s) => (
                  <div key={s.labelEn} className="text-center bg-[#fdf4e8] rounded-2xl py-5 px-3">
                    <p className="font-serif text-2xl font-bold text-[#3d7a20]">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-tight">{lang === 'ta' ? s.labelTa : s.labelEn}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {MILESTONES.map((m) => (
                <div key={m.year} className="flex gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-14 h-14 bg-[#0c1d2b] rounded-xl flex items-center justify-center">
                    <span className="text-[#f5821f] font-bold text-sm">{m.year}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{lang === 'ta' ? m.titleTa : m.titleEn}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{lang === 'ta' ? m.descTa : m.descEn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 sm:py-24 px-4 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#3d7a20] text-xs font-bold tracking-widest uppercase mb-3">{t('Our Purpose', 'எங்கள் நோக்கம்')}</p>
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-3">{t('Vision & Mission', 'தொலைநோக்கு மற்றும் பணி')}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-gradient-to-br from-[#0c1d2b] to-[#3d7a20] rounded-3xl p-8 text-white">
              <div className="w-12 h-12 bg-[#f5821f] rounded-2xl flex items-center justify-center mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-4">{t('Our Vision', 'எங்கள் தொலைநோக்கு')}</h3>
              <p className="text-white/85 text-lg leading-relaxed">
                {t(
                  "To become Tamil Nadu's most trusted cooperative marketplace for fresh agricultural products.",
                  'புதிய விவசாய பொருட்களுக்கான தமிழ்நாட்டின் மிகவும் நம்பகமான கூட்டுறவு சந்தையாக மாறுவது.'
                )}
              </p>
            </div>
            {/* Mission */}
            <div className="bg-[#fdf4e8] rounded-3xl p-8 border border-[#f5821f]/20">
              <div className="w-12 h-12 bg-[#3d7a20] rounded-2xl flex items-center justify-center mb-5">
                <Award size={22} className="text-white" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">{t('Our Mission', 'எங்கள் பணி')}</h3>
              <ul className="space-y-3">
                {[
                  { en: 'Empower local farmers through fair market access.', ta: 'நியாயமான சந்தை அணுகல் மூலம் உள்ளூர் விவசாயிகளுக்கு சக்தி அளிக்கவும்.' },
                  { en: 'Deliver fresh and quality products to consumers.', ta: 'நுகர்வோருக்கு புதிய மற்றும் தரமான பொருட்களை வழங்கவும்.' },
                  { en: 'Promote cooperative values and community welfare.', ta: 'கூட்டுறவு மதிப்புகள் மற்றும் சமூக நலனை ஊக்குவிக்கவும்.' },
                  { en: 'Support sustainable agricultural practices.', ta: 'நிலையான வேளாண்மை முறைகளை ஆதரிக்கவும்.' },
                ].map((item) => (
                  <li key={item.en} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 bg-[#3d7a20] rounded-full flex items-center justify-center mt-0.5">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="text-gray-700 leading-relaxed">{lang === 'ta' ? item.ta : item.en}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 px-4 bg-[#faf9f4] border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#3d7a20] text-xs font-bold tracking-widest uppercase mb-3">{t('The Process', 'செயல்முறை')}</p>
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-3">{t('How it works', 'இது எப்படி செயல்படுகிறது')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t('From the orchard to your table — every step is traceable, transparent, and timed to deliver peak freshness.', 'தோட்டத்திலிருந்து உங்கள் மேஜை வரை — ஒவ்வொரு படியும் கண்காணிக்கக்கூடியது, வெளிப்படையானது மற்றும் உச்ச புதுமையை வழங்க நேரமாகியது.')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((h) => (
              <div key={h.step} className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <span className="absolute top-5 right-5 font-serif text-4xl font-bold text-gray-100">{h.step}</span>
                <div className="w-11 h-11 bg-[#fdf4e8] rounded-xl flex items-center justify-center mb-4 relative z-10">
                  {h.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 relative z-10">{lang === 'ta' ? h.titleTa : h.titleEn}</h3>
                <p className="text-sm text-gray-500 leading-relaxed relative z-10">{lang === 'ta' ? h.descTa : h.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 sm:py-24 px-4 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#3d7a20] text-xs font-bold tracking-widest uppercase mb-3">{t('Where We Are', 'நாங்கள் எங்கே இருக்கிறோம்')}</p>
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-5">{t('Located at the heart of Tenkasi', 'டெங்காசியின் இதயத்தில் அமைந்துள்ளது')}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t(
                  "Our cooperative centre sits at the foothills of the Western Ghats — one of the world's richest biodiversity hotspots. The combination of altitude, rainfall, and red laterite soil makes Tenkasi ideal for growing intensely flavourful tropical fruits without artificial inputs.",
                  'எங்கள் கூட்டுறவு மையம் மேற்கு தொடர்ச்சி மலையின் அடிவாரத்தில் உள்ளது — உலகின் மிகவும் செழுமையான உயிரியல் பல்வகைமை அதிவிருப்புப் பகுதிகளில் ஒன்று. உயரம், மழை மற்றும் சிவப்பு லேட்டரைட் மண் ஆகியவற்றின் கலவை செயற்கை இடுபொருட்கள் இல்லாமல் மிகவும் சுவையான வெப்பமண்டல பழங்களை வளர்க்க டெங்காசியை சிறந்ததாக ஆக்குகிறது.'
                )}
              </p>
              <div className="space-y-3">
                {[
                  { icon: <MapPin size={16} className="text-[#3d7a20]" />, en: '42C/1A Rail Nagar Road, Tenkasi – 627 811, Tamil Nadu', ta: '42C/1A ரெயில் நகர் சாலை, டெங்காசி – 627 811, தமிழ்நாடு' },
                  { icon: <Phone size={16} className="text-[#3d7a20]" />, en: '+91 7094402579', ta: '+91 7094402579' },
                  { icon: <Users size={16} className="text-[#3d7a20]" />, en: '240+ partner farmers across Tenkasi & Shencottai taluks', ta: 'டெங்காசி & செங்கோட்டை தாலுகாக்களில் 240+ கூட்டாளி விவசாயிகள்' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-[#faf9f4] rounded-xl border border-gray-100 px-4 py-3">
                    <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
                    <p className="text-sm text-gray-700">{lang === 'ta' ? item.ta : item.en}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#0c1d2b] rounded-3xl p-8 text-white">
              <h3 className="font-serif text-2xl font-bold mb-6">{t('Our Farming Regions', 'எங்கள் விவசாய பகுதிகள்')}</h3>
              <div className="space-y-4">
                {[
                  { region: 'Tenkasi',       produce: t('Mango, Banana, Jackfruit', 'மாம்பழம், வாழை, பலாப்பழம்'),             farmers: 80,  barW: 'w-full' },
                  { region: 'Courtallam',    produce: t('Guava, Papaya, Soursop', 'கொய்யா, பப்பாளி, சீதா பழம்'),               farmers: 55,  barW: 'w-[69%]' },
                  { region: 'Alangulam',     produce: t('Banana, Jackfruit, Passion Fruit', 'வாழை, பலாப்பழம், பாஷன் பழம்'),   farmers: 48,  barW: 'w-[60%]' },
                  { region: 'Kadayanallur',  produce: t('Pomegranate, Grapes', 'மாதுளம், திராட்சை'),                           farmers: 35,  barW: 'w-[44%]' },
                  { region: 'Sankarankovil', produce: t('Watermelon, Pineapple', 'தர்பூசணி, அன்னாசி'),                        farmers: 22,  barW: 'w-[28%]' },
                ].map((r) => (
                  <div key={r.region} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-white">{r.region}</span>
                        <span className="text-xs text-white/50">{r.farmers} {t('farmers', 'விவசாயிகள்')}</span>
                      </div>
                      <p className="text-xs text-white/60">{r.produce}</p>
                      <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full bg-[#f5821f] rounded-full ${r.barW}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#faf9f4] border-t border-gray-100">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-3">{t('Taste the difference', 'வித்தியாசத்தை சுவையுங்கள்')}</h2>
          <p className="text-gray-500 mb-8">{t('From 240+ farmer families in Tenkasi — straight to your table.', 'டெங்காசியில் 240+ விவசாயி குடும்பங்களிடமிருந்து — நேரடியாக உங்கள் மேஜைக்கு.')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/shop" className="inline-block bg-[#3d7a20] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2a5a14] transition-colors no-underline text-center">
              {t('Shop Now', 'இப்போது வாங்குங்கள்')}
            </Link>
            <a href="https://wa.me/917094402579" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 border-2 border-[#3d7a20] text-[#3d7a20] px-8 py-3 rounded-full font-semibold hover:bg-[#3d7a20] hover:text-white transition-colors no-underline">
              {t('WhatsApp Us', 'வாட்ஸ்அப் செய்யுங்கள்')}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
