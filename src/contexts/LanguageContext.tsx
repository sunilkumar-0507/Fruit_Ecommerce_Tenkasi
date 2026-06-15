import { createContext, useContext, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'ta'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (en: string, ta: string) => string
}

const LanguageContext = createContext<LangCtx>({ lang: 'en', setLang: () => {}, t: (en) => en })

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try { return (localStorage.getItem('tf_lang') as Lang) || 'en' } catch { return 'en' }
  })

  function setLang(l: Lang) {
    setLangState(l)
    try { localStorage.setItem('tf_lang', l) } catch {}
  }

  function t(en: string, ta: string) {
    return lang === 'ta' ? ta : en
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
