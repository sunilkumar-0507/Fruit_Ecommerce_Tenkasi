import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { AuthProvider } from '../context/AuthContext'
import { BasketProvider } from '../context/BasketContext'
import { CartProvider } from '../context/CartContext'
import { FavProvider } from '../context/FavContext'
import { FeedbackProvider } from '../context/FeedbackContext'
import { OrderProvider } from '../context/OrderContext'
import { LanguageProvider } from '../contexts/LanguageContext'

import appCss from '../styles.css?url'
import themifyUrl from '../themify-icons.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

const ROUNDED_FAVICON_SCRIPT = `(function(){var img=new Image();img.onload=function(){var c=document.createElement('canvas');c.width=64;c.height=64;var ctx=c.getContext('2d');ctx.beginPath();ctx.arc(32,32,32,0,Math.PI*2);ctx.clip();ctx.drawImage(img,0,0,64,64);var link=document.querySelector('link[rel="icon"]');if(!link){link=document.createElement('link');link.rel='icon';document.head.appendChild(link);}link.type='image/png';link.href=c.toDataURL('image/png');};img.src='/images/products/MainLogo.jpeg';})();`

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Tenkasi Fresh — Farm to Home Since 1959' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;600;700;800&display=swap' },
      { rel: 'preload', as: 'image', href: '/images/categories/hero-fruits.jpeg' },
      { rel: 'preload', as: 'image', href: '/images/products/CoopLogo.png' },
      { rel: 'preload', as: 'image', href: '/images/products/MainLogo.jpeg' },
      { rel: 'stylesheet', href: appCss },
      { rel: 'stylesheet', href: themifyUrl },
      { rel: 'icon', type: 'image/jpeg', href: '/images/products/MainLogo.jpeg' },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => null,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const hideChrome = location.pathname === '/admin' || location.pathname === '/login'

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: ROUNDED_FAVICON_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <LanguageProvider>
        <AuthProvider>
        <BasketProvider>
        <CartProvider>
        <FavProvider>
        <FeedbackProvider>
        <OrderProvider>
        {!hideChrome && <Header />}
        {children}
        {!hideChrome && <Footer />}
        </OrderProvider>
        </FeedbackProvider>
        </FavProvider>
        </CartProvider>
        </BasketProvider>
        {!hideChrome && (
          <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
            <a
              href="https://wa.me/917094402579"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 bg-[#25d366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              aria-label="WhatsApp Us"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.855L.057 23.93l6.234-1.635A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.653-.507-5.179-1.392l-.371-.22-3.702.971.988-3.614-.242-.381A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
            </a>
            <a
              href="tel:+917094402579"
              className="w-14 h-14 bg-[#f5821f] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              aria-label="Call Us"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
              </svg>
            </a>
          </div>
        )}
        </AuthProvider>
        </LanguageProvider>
        <Scripts />
      </body>
    </html>
  )
}
