import { I18nManager } from 'react-native'
import * as Localization from 'expo-localization'
import i18n, { TranslateOptions } from 'i18n-js'
import memoize from 'lodash-es/memoize'

import { LanguageKeys, TranslationKeys } from '@/typings'
import en from '@/translations/en.json'
import ee from '@/translations/ee.json'
import pt from '@/translations/pt-br.json'

i18n.defaultLocale = 'en'
i18n.translations = {
  en: en,
  'en-EE': ee,
  'pt-BR': pt,
} as Record<LanguageKeys, Record<TranslationKeys, string>>

const translate = memoize(
  (key: TranslationKeys, config?: TranslateOptions) =>
    i18n.t(key, config).includes('missing') ? key : i18n.t(key, config),
  (key: TranslationKeys, config?: TranslateOptions) =>
    config ? key + JSON.stringify(config) : key
)

export const getLocale = (locale: LanguageKeys): LanguageKeys => {
  const hasTranslations = i18n.translations.hasOwnProperty(locale)
  return hasTranslations ? locale : (i18n.defaultLocale as LanguageKeys)
}

export const t = translate

export const setupI18n = (langTag?: LanguageKeys, isRTL?: boolean) => {
  const locale = langTag || Localization.locale
  const _isRTL = isRTL || Localization.isRTL

  translate.cache.clear?.()
  I18nManager.forceRTL(_isRTL)
  i18n.locale = getLocale(locale as LanguageKeys)
  i18n.fallbacks = true
}
