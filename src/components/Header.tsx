import { Link, useNavigate } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '#/context/AuthContext'
import { useCart } from '#/context/CartContext'
import { useFav } from '#/context/FavContext'
import TiIcon from '#/components/TiIcon'
import { useLang } from '#/contexts/LanguageContext'

const TICKER_EN = ['Farm Fresh', 'Premium Quality', 'Fast Delivery', 'Best Prices', '240+ Farmers', 'Direct from Farm']
const TICKER_TA = ['பண்ணை புதிய பழங்கள்', 'உயர் தரம்', 'விரைவான டெலிவரி', 'சிறந்த விலை', '240+ விவசாயிகள்', 'நேரடியாக பண்ணையிலிருந்து']

function HeaderTicker({ lang }: { lang: 'en' | 'ta' }) {
  const items = lang === 'ta' ? TICKER_TA : TICKER_EN
  return (
    <div className="overflow-hidden bg-[#f5821f] py-1.5">
      <style>{`
        @keyframes header-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .header-ticker-content { animation: header-ticker 30s linear infinite; display: flex; white-space: nowrap; }
      `}</style>
      <div className="header-ticker-content">
        {[...items, ...items].map((item, idx) => (
          <span key={idx} className="text-[#0c1d2b] text-xs font-bold tracking-wide flex-shrink-0 px-5">
            {item}&nbsp;&nbsp;·
          </span>
        ))}
      </div>
    </div>
  )
}

const BASE_NAV = [
  { en: 'Home',     ta: 'முகப்பு',  to: '/' },
  { en: 'Shop',     ta: 'கடை',      to: '/shop' },
  { en: 'Seasonal', ta: 'பருவகால', to: '/seasonal' },
  { en: 'Baskets',  ta: 'கூடைகள்', to: '/baskets' },
] as const

function FavPopup({ onClose }: { onClose: () => void }) {
  const { items, toggle } = useFav()
  const { t } = useLang()

  return (
    <div className="absolute right-0 top-full mt-2 z-50 w-[min(320px,calc(100vw-1rem))] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-[#faf9f4]">
        <div className="flex items-center gap-2">
          <TiIcon name="heart" size={16} className="text-red-500" />
          <span className="font-serif font-bold text-gray-900 text-sm">{t('Wishlist', 'விருப்பப்பட்டியல்')}</span>
          {items.length > 0 && (
            <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          )}
        </div>
        <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition" aria-label="Close wishlist">
          <TiIcon name="close" size={15} className="text-gray-400" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <TiIcon name="heart" size={36} className="text-gray-200 mb-3" />
          <p className="text-gray-600 text-sm font-semibold">{t('Your wishlist is empty', 'உங்கள் விருப்பப்பட்டியல் காலியாக உள்ளது')}</p>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed">{t('Tap the ♥ on any product to save it here', 'எந்த பொருளிலும் ♥ அழுத்தி சேமியுங்கள்')}</p>
          <Link to="/shop" onClick={onClose} className="inline-block mt-4 bg-[#3d7a20] text-white text-xs font-bold px-5 py-2 rounded-full no-underline hover:bg-[#2a5a14] transition-colors">
            {t('Browse Products', 'பொருட்களை உலாவுங்கள்')}
          </Link>
        </div>
      ) : (
        <>
          <ul className="max-h-[300px] sm:max-h-[360px] overflow-y-auto divide-y divide-gray-50">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 hover:bg-gray-50 transition-colors">
                <Link
                  to="/product/$productId"
                  params={{ productId: item.id }}
                  onClick={onClose}
                  className="flex items-center gap-3 flex-1 min-w-0 px-4 py-3 no-underline"
                >
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{item.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{item.nameTamil}</p>
                    <p className="text-sm font-bold text-[#3d7a20] mt-0.5">
                      ₹{item.price}<span className="text-[10px] font-normal text-gray-400 ml-0.5">/{item.unit}</span>
                    </p>
                  </div>
                </Link>
                <button type="button" onClick={() => toggle(item)} className="p-1.5 mr-3 hover:bg-red-50 rounded-lg transition flex-shrink-0 group" aria-label={`Remove ${item.name}`}>
                  <TiIcon name="close" size={15} className="text-gray-300 group-hover:text-red-500 transition-colors" />
                </button>
              </li>
            ))}
          </ul>
          <div className="px-4 py-3 bg-[#faf9f4] border-t border-gray-100">
            <Link to="/shop" onClick={onClose} className="block w-full text-center text-sm font-bold text-white bg-[#3d7a20] py-2.5 rounded-xl no-underline hover:bg-[#2a5a14] transition-colors">
              {t('Shop Now', 'இப்போது வாங்குங்கள்')}
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [favOpen, setFavOpen] = useState(false)
  const { user, isAdmin, logout } = useAuth()
  const { count: cartCount } = useCart()
  const { items: favItems } = useFav()
  const { lang, setLang, t } = useLang()
  const navigate = useNavigate()
  const favRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!favOpen && !userMenuOpen) return
    function handleClick(e: MouseEvent) {
      if (favOpen && favRef.current && !favRef.current.contains(e.target as Node)) setFavOpen(false)
      if (userMenuOpen && userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [favOpen, userMenuOpen])

  function handleLogout() {
    logout()
    setUserMenuOpen(false)
    void navigate({ to: '/' })
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Top Banner */}
      <div className="bg-[#0c1d2b] border-b border-[#f5821f]/20 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5821f] inline-block" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase text-[#f5821f]">
              {t('Fresh Fruits Delivered Across Tamil Nadu', 'தமிழ்நாடு முழுவதும் புதிய பழங்கள்')}
            </span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="tel:+917094402579" className="flex items-center gap-1.5 text-white/70 hover:text-[#f5821f] transition-colors text-[10px] sm:text-[11px] font-medium no-underline">
              <TiIcon name="headphone" size={12} className="text-[#f5821f]" />
              <span className="hidden xs:inline">+91 7094402579</span>
              <span className="xs:hidden">Call Us</span>
            </a>
            <span className="hidden sm:flex items-center gap-1.5 text-white/70 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] inline-block animate-pulse" />
              {t('Fresh Daily Delivery', 'தினமும் புதிய டெலிவரி')}
            </span>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <HeaderTicker lang={lang} />

      {/* Main Header */}
      <nav className="bg-[#0c1d2b] border-b border-[#f5821f]/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2">
            <Link to="/" className="flex items-center gap-2 no-underline flex-shrink-0">
              <img src="/images/products/CoopLogo.png" alt="Tenkasi Fresh Coop" className="h-[80px] w-[80px] object-contain rounded-2xl" />
              <img src="/images/products/MainLogo.jpeg" alt="Tenkasi Fresh" className="h-[80px] w-auto object-contain rounded-2xl" />
            </Link>

            <div className="hidden md:flex items-center gap-7">
              {BASE_NAV.map((link) => (
                <Link key={link.to} to={link.to} className="header-nav-link" activeProps={{ className: 'header-nav-link active' }}>
                  {lang === 'ta' ? link.ta : link.en}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" className="header-nav-link" activeProps={{ className: 'header-nav-link active' }}>
                  {lang === 'ta' ? 'நிர்வாகி' : 'Admin'}
                </Link>
              )}
            </div>

            <div className="hidden lg:flex items-center bg-white/10 rounded-full px-4 py-2 w-56 gap-2 border border-white/10">
              <TiIcon name="search" size={15} className="text-white/50 flex-shrink-0" />
              <input type="text" placeholder="Search mangoes, baskets..." className="bg-transparent w-full outline-none text-sm text-white/80 placeholder-white/40" />
            </div>

            <div className="flex items-center gap-1">
              {/* Language toggle */}
              <div className="flex items-center rounded-full border border-white/20 overflow-hidden mr-1">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-3 py-1.5 text-[11px] font-bold tracking-wide transition-colors ${lang === 'en' ? 'bg-[#f5821f] text-[#0c1d2b]' : 'text-white/55 hover:text-white'}`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLang('ta')}
                  className={`px-3 py-1.5 text-[11px] font-bold tracking-wide transition-colors ${lang === 'ta' ? 'bg-[#f5821f] text-[#0c1d2b]' : 'text-white/55 hover:text-white'}`}
                >
                  தமிழ்
                </button>
              </div>

              {user ? (
                <div className="relative" ref={userRef}>
                  <button type="button" onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/10 rounded-full transition" aria-label="Account menu">
                    <div className="w-8 h-8 bg-[#f5821f] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-[#0c1d2b] font-bold text-sm leading-none">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-white/85 max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        {isAdmin && <span className="inline-block mt-1 text-[10px] font-bold text-[#3d7a20] bg-[#fdf4e8] px-2 py-0.5 rounded-full tracking-wide uppercase">{t('Admin', 'நிர்வாகி')}</span>}
                      </div>
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors no-underline">
                        <TiIcon name="bag" size={15} className="text-gray-500" />
                        {t('My Orders', 'என் ஆர்டர்கள்')}
                      </Link>
                      <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left border-t border-gray-50">
                        <TiIcon name="power-off" size={15} className="text-red-600" />
                        {t('Sign Out', 'வெளியேறு')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#f5821f] text-[#0c1d2b] text-sm font-bold rounded-full hover:bg-[#ffab4a] transition-colors no-underline">
                  <TiIcon name="user" size={15} className="text-[#0c1d2b]" />
                  <span className="hidden sm:inline">{t('Sign In', 'உள்நுழைவு')}</span>
                </Link>
              )}

              {/* Favourites */}
              <div className="relative" ref={favRef}>
                <button type="button" onClick={() => { setFavOpen(!favOpen); setUserMenuOpen(false) }} className="relative p-2 hover:bg-white/10 rounded-full transition" aria-label="Wishlist">
                  <TiIcon name="heart" size={20} className={favItems.length > 0 ? 'text-red-400' : 'text-white/75'} />
                  {favItems.length > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                      {favItems.length > 9 ? '9+' : favItems.length}
                    </span>
                  )}
                </button>
                {favOpen && <FavPopup onClose={() => setFavOpen(false)} />}
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition" aria-label="Cart">
                <TiIcon name="shopping-cart" size={20} className="text-white/75" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-[#f5821f] text-[#0c1d2b] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button type="button" className="md:hidden p-2 hover:bg-white/10 rounded-full transition ml-1" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                <TiIcon name={isMenuOpen ? 'close' : 'menu'} size={22} className="text-white" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-3 space-y-1">
              {/* Mobile language toggle */}
              <div className="flex items-center gap-2 px-4 py-2">
                <span className="text-white/50 text-xs font-semibold uppercase tracking-wide">{t('Language', 'மொழி')}</span>
                <div className="flex items-center rounded-full border border-white/20 overflow-hidden ml-2">
                  <button type="button" onClick={() => setLang('en')} className={`px-3 py-1 text-[11px] font-bold transition-colors ${lang === 'en' ? 'bg-[#f5821f] text-[#0c1d2b]' : 'text-white/55'}`}>EN</button>
                  <button type="button" onClick={() => setLang('ta')} className={`px-3 py-1 text-[11px] font-bold transition-colors ${lang === 'ta' ? 'bg-[#f5821f] text-[#0c1d2b]' : 'text-white/55'}`}>தமிழ்</button>
                </div>
              </div>
              {BASE_NAV.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 text-white/80 font-semibold text-sm hover:bg-white/10 hover:text-white rounded-lg no-underline transition-colors"
                  activeProps={{ className: 'block px-4 py-2.5 text-[#ffab4a] font-bold text-sm bg-white/10 rounded-lg no-underline border-l-4 border-[#f5821f]' }}>
                  {lang === 'ta' ? link.ta : link.en}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 text-white/80 font-semibold text-sm hover:bg-white/10 hover:text-white rounded-lg no-underline transition-colors"
                  activeProps={{ className: 'block px-4 py-2.5 text-[#ffab4a] font-bold text-sm bg-white/10 rounded-lg no-underline border-l-4 border-[#f5821f]' }}>
                  {lang === 'ta' ? 'நிர்வாகி' : 'Admin'}
                </Link>
              )}
              <button type="button" onClick={() => { setIsMenuOpen(false); setFavOpen(true) }} className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-white/80 font-semibold text-sm hover:bg-white/10 rounded-lg transition-colors">
                <TiIcon name="heart" size={16} className={favItems.length > 0 ? 'text-red-400' : 'text-white/60'} />
                {t('Wishlist', 'விருப்பப்பட்டியல்')}
                {favItems.length > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto">{favItems.length}</span>}
              </button>
              {!user && (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-[#0c1d2b] font-bold text-sm bg-[#f5821f] rounded-lg no-underline">
                  {t('Sign In / Register', 'உள்நுழைவு / பதிவு')}
                </Link>
              )}
              {user && (
                <>
                  <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2.5 text-white/80 font-semibold text-sm hover:bg-white/10 rounded-lg no-underline transition-colors">
                    {t('My Orders', 'என் ஆர்டர்கள்')}
                  </Link>
                  <button type="button" onClick={() => { handleLogout(); setIsMenuOpen(false) }} className="w-full text-left block px-4 py-2.5 text-red-300 font-medium text-sm hover:bg-white/10 rounded-lg">
                    {t('Sign Out', 'வெளியேறு')}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
