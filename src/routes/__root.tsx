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
          <a
            href="tel:+917094402579"
            className="fixed bottom-6 right-6 w-14 h-14 bg-[#f5821f] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
            aria-label="Call Us"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
          </a>
        )}
        </AuthProvider>
        </LanguageProvider>
        <Scripts />
      </body>
    </html>
  )
}
