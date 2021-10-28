import { IconNamesEnum } from '@/components/icon.component'
import translations from '@/translations/en.json'

/** Helpers */

const typeObjKeys = <T>(obj: T) => Object.keys(obj) as Array<keyof typeof obj>

/** i18n */
const _translationKeys = typeObjKeys<typeof translations>(translations)
export type TranslationKeys = typeof _translationKeys[number]
export type LanguageKeys = 'en' | 'en-EE' | 'pt-BR'

/** Local Data */

export type ListType = 'video' | 'channel' | 'watching' | 'userChannels'

export type Channel = {
  id: string
  name: string
  description: string
  avatar: string
  cover: string
  categories?: string[]
  followerCount?: string | number
  status?: string
  price?: number
}

export type ChannelProfile = {
  id: string
  avatar: string
  name?: string
  cover: string
  followers?: string
  description?: string
  featuredVideo?: [VideoPreview]
  videoSuggestions?: VideoPreview[]
  price?: number
}

export type User = {
  token: string
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar: string
  balance: number
  roles?: string[]
  preferences: {
    notifications: {
      interactions: {
        likes: boolean
        comments: boolean
        mentions: boolean
      }
      media: {
        followed?: boolean
        suggestions?: boolean
      }
    }
  }
}

export type VideoPreview = {
  id: string
  title: string
  description: string
  poster: string
  viewCount: string | number
  duration: string | number
  likes: string
  seekPosition?: number
  channel: Channel
  isPremium?: boolean
}

export type Category = {
  id: string
  name: string
  hex?: string
}

export type Tag = {
  id: string
  name: string
}

export type Media = VideoPreview & {
  url: string
  cover: string
  uploaded: number | string
  likes: string
  liked?: boolean
  shares: number
  // comments?: Comment[]
}
export type CommentType = 'text' | 'video' | 'image'

export type Comment = {
  id: string
  text?: string
  imageUrl?: string
  videoUrl?: string
  videoPoster?: string
  type: CommentType
  date: number | string
  parentId?: string
  liked?: boolean
  likes: number
  user: {
    id: string
    firstName: string
    lastName: string
    username?: string
    avatar: string
  }
}

type ProfileItemType =
  | 'field'
  | 'list'
  | 'lang'
  | 'link'
  | 'theme'
  | 'contact'
  | 'lang'
  | 'logout'
  | 'subscription'

export type SettingSection = { title: string; items: Setting[] }

export type Setting = {
  id: string
  icon: IconNamesEnum
  label: string
  description: string
  value?: string
  path?: string
  type: ProfileItemType
  items?: unknown[]
}

export type Language = {
  id: string
  lang: string
  code: LanguageKeys
  flag: string
}

export type FeaturedChannel = {
  id: string
  channelId: string
  title: string
  description: string
  avatar: string
  cover: string
}
