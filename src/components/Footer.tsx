import { Link } from '@tanstack/react-router'
import { useLang } from '#/contexts/LanguageContext'

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
    </svg>
  )
}

function WhatsappIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.855L.057 23.93l6.234-1.635A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.653-.507-5.179-1.392l-.371-.22-3.702.971.988-3.614-.242-.381A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  )
}

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="bg-[#0c1d2b] text-white">
      {/* Main Footer */}
      <div className="py-14 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/products/MainLogo.jpeg" alt="Tenkasi Fresh" className="w-14 h-14 rounded-xl object-contain flex-shrink-0" />
              <span className="font-serif text-lg font-bold">{t('Tenkasi Fresh Fruits', 'தென்காசி பிரெஷ் பழங்கள்')}</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-5">
              {t(
                'Nestled in the foothills of the Western Ghats, Tenkasi is home to Tamil Nadu\'s most treasured fruit varieties. We bring you authentic flavors, seasonal harvests, and the freshness of the Western Ghats.',
                'மேற்கு தொடர்ச்சி மலையடிவாரத்தில் அமைந்துள்ள தென்காசி, தமிழ்நாட்டின் மிக விலைமதிப்பான பழ வகைகளின் தொட்டில். நேர்மையான சுவைகளையும், பருவகால அறுவடைகளையும், மேற்கு தொடர்ச்சி மலையின் புதுமையையும் உங்களுக்கு கொண்டு வருகிறோம்.'
              )}
            </p>
            <div className="flex gap-3 mb-5">
              <a href="#" aria-label="Facebook" className="text-white/60 hover:text-white transition-colors">
                <FacebookIcon />
              </a>
              <a href="https://www.instagram.com/p/DZH08RFGF9l/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/60 hover:text-white transition-colors">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="YouTube" className="text-white/60 hover:text-white transition-colors">
                <YoutubeIcon />
              </a>
              <a href="https://wa.me/917094402579" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-white/60 hover:text-white transition-colors">
                <WhatsappIcon />
              </a>
            </div>
            <div className="space-y-1 text-xs leading-relaxed border-t border-white/10 pt-4">
              <p className="font-semibold text-white/85 text-[11px] leading-snug">
                {t(
                  'O.1919 Tenkasi Shencottai Taluks Agricultural Producers Cooperative Marketing Society',
                  'O.1919 தென்காசி செங்கோட்டை தாலுக்கா விவசாய உற்பத்தியாளர் கூட்டுறவு சந்தை சமூகம்'
                )}
              </p>
              <p className="text-white/55">{t('42C/1A Rail Nagar Road, Tenkasi – 627 811', '42C/1A ரெயில் நகர் சாலை, தென்காசி – 627 811')}</p>
              <a href="tel:+917094402579" className="text-white/55 hover:text-white transition-colors no-underline block">
                +91 7094402579
              </a>
              <a
                href="mailto:01919cmstenkasi@gmail.com"
                className="text-[#f5821f]/80 hover:text-[#f5821f] transition-colors no-underline block"
              >
                01919cmstenkasi@gmail.com
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h5 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">{t('Shop', 'கடை')}</h5>
            <ul className="space-y-2.5 text-white/75 text-sm">
              <li><Link to="/shop" className="hover:text-white transition-colors no-underline">{t('All Fruits', 'அனைத்து பழங்கள்')}</Link></li>
              <li><Link to="/seasonal" className="hover:text-white transition-colors no-underline">{t('Seasonal', 'பருவகால பழங்கள்')}</Link></li>
              <li><Link to="/baskets" className="hover:text-white transition-colors no-underline">{t('Festival Baskets', 'விழா பழக்கூடைகள்')}</Link></li>
              <li><a href="#" className="hover:text-white transition-colors no-underline">{t('Bulk Orders', 'மொத்த ஆர்டர்கள்')}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">{t('Support', 'ஆதரவு')}</h5>
            <ul className="space-y-2.5 text-white/75 text-sm">
              <li><a href="#" className="hover:text-white transition-colors no-underline">{t('Track Order', 'ஆர்டர் கண்காணிக்க')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors no-underline">{t('Delivery', 'டெலிவரி')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors no-underline">{t('Returns', 'திரும்பப் பெறல்')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors no-underline">{t('Contact', 'தொடர்பு கொள்ளுங்கள்')}</a></li>
            </ul>
          </div>

          {/* Heritage */}
          <div>
            <h5 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-4">{t('Heritage', 'பாரம்பரியம்')}</h5>
            <ul className="space-y-2.5 text-white/75 text-sm">
              <li><a href="#" className="hover:text-white transition-colors no-underline">{t('Our Story', 'எங்கள் கதை')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors no-underline">{t('Farmer Network', 'விவசாயி வலையமைப்பு')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors no-underline">{t('Sustainability', 'நிலையான வேளாண்மை')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors no-underline">{t('Press', 'செய்தி மையம்')}</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-white/50 text-xs">
          <p>{t('© 2026 Tenkasi Fresh Fruits. From our soil to your soul.', '© 2026 தென்காசி பிரெஷ் பழங்கள். எங்கள் மண்ணிலிருந்து உங்கள் உள்ளத்திற்கு.')}</p>
          <p>{t('Made with ♥ in Tamil Nadu · FSSAI Lic. 22824105000124', 'தமிழ்நாட்டில் ♥ உடன் தயாரிக்கப்பட்டது · FSSAI உரிமம். 22824105000124')}</p>
        </div>
      </div>
    </footer>
  )
}
