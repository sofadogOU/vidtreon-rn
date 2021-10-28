import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react'
import { TranslateOptions } from 'i18n-js'
import * as Localization from 'expo-localization'

import * as i18n from '@/utils/i18n'
import { LanguageKeys, TranslationKeys } from '@/typings'

export interface Context {
  t: (scope: TranslationKeys, options?: TranslateOptions) => string
  locale: LanguageKeys
  setLocale: (lang: LanguageKeys) => void
}
const TranslationContext = createContext({} as Context)

interface Props {
  children: React.ReactNode
}

const TranslationProvider = ({ children }: Props) => {
  const [locale, setLocale] = useState<LanguageKeys>(
    i18n.getLocale(Localization.locale as LanguageKeys)
  )

  useEffect(() => {
    i18n.setupI18n(locale)
  }, [locale])

  const context = useMemo(
    () => ({
      t: (scope: TranslationKeys, options?: TranslateOptions) =>
        i18n.t(scope, { locale, ...options }),
      locale,
      setLocale,
    }),
    [locale]
  )

  return (
    <TranslationContext.Provider value={context}>
      {children}
    </TranslationContext.Provider>
  )
}

export const useTranslation = () => useContext(TranslationContext)
export default TranslationProvider
