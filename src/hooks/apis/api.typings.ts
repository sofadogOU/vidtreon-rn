import translations from '@/translations/en.json'

/*
 * Common Types
 */
type Image = {
  image_url: string
  height: string
  width: string
}

type AdminRole =
  | 'lead_journalist'
  | 'video_editor'
  | 'lead_video_editor'
  | 'feed_manager'
  | 'user_manager'
  | 'super_admin'

type Admin = {
  id: AdminRole | string
  description: string
}

export type ActivityTypes =
  | 'liked_in_video_page'
  | 'subscribed_to_channel'
  | 'commented_in_video_page'
  | 'mentioned_in_video_page'
  | 'published_video'
  | 'finished_transcoding'

export type NotificationTypes = 'video_published' | 'liked' | 'unliked'

type CreatorType = 'sofadog' | 'content_creator'

type Finance = {
  balance: number
}

type NotificationPreferences = {
  interactions: {
    likes: boolean
    comments: boolean
    mentions: boolean
  }
}

type VideoPreferences = {
  followed_channels: boolean
  suggestions: boolean
}

type Preferences = {
  notifications: NotificationPreferences
  video_updates: VideoPreferences
}

type VideoEngagement = {
  total_likes: number
  total_views?: number
  total_comments: number
  comments?: unknown[]
  liked?: boolean
}

type FeedEngagement = {
  total_subscribers: number
  subscribed: boolean
}

type PartialUser = {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  job_title: string
  phone: string
  avatar: Image
}

type SubscriptionsType = 'active' | 'cancelled' | 'price_changed'

export type FeedTypes = 'suggested' | 'new' | 'home'
export type EngagementType = 'video' | 'comment' | 'channel'
export type CommentOrder = 'most_recent'
export type CommentType = 'text' | 'video' | 'image' | 'all'
export type ListType =
  | 'video'
  | 'subscribedVideos'
  | 'exploreVideos'
  | 'channel'
  | 'watching'
  | 'userChannels'
export type TriggerType = 'user' | 'channel' | 'system'

export type VideoTypes =
  | 'latest'
  | 'popular'
  | 'most_commented'
  | 'most_viewed'
  | 'touching_stories'
  | 'sofadog'
  | 'newly_added'
  | 'positive_news'
  | 'related'
  | 'latest_videos'
  | 'most_liked'

export type PagingPayload<T> = {
  id?: string
  user_id?: string
  feed_id?: string
  token?: string | null
  page?: number
  limit?: number
  type?: T
  ref?: string | string[]
  resource_type?: EngagementType
  order?: CommentOrder
  title?: string
  tags?: string
  categories?: string
  query?: string
}

/**
 * Languages
 */

const typeObjKeys = <T>(obj: T) => Object.keys(obj) as Array<keyof typeof obj>

/** i18n */
const _translationKeys = typeObjKeys<typeof translations>(translations)
export type TranslationKeys = typeof _translationKeys[number]
export type LanguageKeys = 'en' | 'en-EE' | 'pt-BR'

export type Language = {
  id: string
  lang: string
  code: LanguageKeys
  flag: string
}

/*
 * Categories
 */

type CategorySchema = {
  id: string
  title: string
  created_at: string
  updated_at: string
  colorHex?: string
}

export type CategoriesSchema = {
  categories: CategorySchema[]
}

export type Category = {
  id: string
  title: string
  colorHex?: string
}

/*
 * Users
 */

export type UserSchema = PartialUser & {
  username: string
  email: string
  first_name: string
  last_name: string
  job_title: string
    avatar?: {
    image_url?: string
    height?: string
    width?: string
  }
  admin_roles:[Admin]
  disabled: boolean
  on_shift: boolean
  creator_type: CreatorType | ''
  preference: Preferences
  finance: Finance
}

export type User = {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatarUrl: string
  avatarHeight: string
  avatarWidth: string
  balance: number
  creatorType?: CreatorType | ''
}

/*
 * Login
 */

export type SocialDomains = 'apple' | 'google' | 'facebook'

export type SocialAuthPayload = {
  token: string
  domain: SocialDomains
  fcm_token: string
}

export type AuthSchema = {
  token: string
  user: UserSchema
}

/*
 * Balance
 */

export type BalanceSchema = {
  balance: number
}

/*
 * Feeeds (Channels)
 */
export type FeedSchema = {
  id: string
  name: string
  description: string
  category_ids: string[]
  cover: Image
  thumbnail: Image
  video_engagements: VideoEngagement
  engagements: FeedEngagement
  subscription_price: number
  creator_type: CreatorType
}

export type FeedsSchema = {
  feeds: FeedSchema[]
}

export type Channel = {
  id: string
  feedId: string
  userId?: string
  name: string
  description: string
  avatarUrl: string
  coverUrl: string
  status?: SubscriptionsType
  price: number
  followerCount: number
  categories: string[]
  subscribed?: boolean
}

/*
 * Subscriptions
 */

type SubscriptionSchema = {
  id: string
  price: number
  status: SubscriptionsType
  last_active_date: string
  user: PartialUser
  feed: FeedSchema
}

export type SubscriptionsSchema = {
  subscriptions: SubscriptionSchema[]
}

/*
 * Videos
 */

type Clip = {
  id: string
  created_at: string
  updated_at: string
  aspect_ratio: string[] | string
  url: string
}

type Thumbnail = {
  id: string
  created_at: string
  updated_at: string
  aspect_ratio: string[] | string
  url: string
}

export type VideoSchema = {
  id: string
  feed_id: string
  duration: number
  created_at: string
  updated_at: string
  title: string
  content: string
  category: number
  category_id: number
  tags: string[]
  clips: Clip[]
  thumbnails: Thumbnail[]
  creator_type: CreatorType
  channel: FeedSchema
  engagements: VideoEngagement & {
    viewed: boolean
    liked: boolean
  }
  watched_history?: {
    created_at: string
    updated_at: string
    duration: number
    progress: number
  }
}

export type VideosSchema = {
  videos: VideoSchema[]
}

export type SingleVideoSchema = {
  video: VideoSchema
}

export type Video = {
  id: string
  title: string
  description: string
  videoUrl: string
  coverUrl: string
  uploaded: string
  posterUrl: string
  viewCount: string
  likes: string
  liked: boolean
  shares?: number
  duration: number
  seekPosition?: number
  channel: Channel
  isPremium?: boolean
}

/**
 * Likes
 */

export type LikesSchema = {
  status: 'liked' | 'unliked'
}

/**
 * Comments
 */

export type MediaSchema = {
  type: 'text' | 'image' | 'video'
  image_url: string
  height: string
  width: string
  aspect_ratio: string | string[]
  video_url: string
}

export type MessageSchema = MediaSchema & {
  text: string
}

export type CommentSchema = {
  id: string
  created_at: string
  updated_at: string
  user: PartialUser
  content: MessageSchema
  engagements: VideoEngagement
}

export type CommentsSchema = {
  comments: CommentSchema[]
}

type CommentUser = {
  id: string
  firstName: string
  lastName: string
  username: string
  avatarUrl: string
}

export type Comment = {
  id: string
  type: 'text' | 'image' | 'video'
  text?: string
  imageUrl?: string
  videoUrl?: string
  created: string
  user: CommentUser
  likes: number
  liked?: boolean
  replies?: number
}

export type CommentPayload = {
  type: 'text' | 'image' | 'video'
  text?: string
  image_url?: string
  video_url?: string
  height?: string
  width?: string
  aspect_ratio?: string | string[]
}

/** Upload */

export type UploadsSchema = {
  file: MediaSchema
}

/*
 * Watchlist
 */
export type WatchlistPayload = {
  duration: number
  progress: number
}

export type WatchlistSchema = {
  status: 'success' | 'error'
}

/**
 * Tags
 */

export type Tag = {
  id: string
  name: string
}

export type TagSchema = {
  id: string
  title: string
  colorHex?: string
  created_at: string
  updated_at: string
}

export type TagsSchema = {
  tags: TagSchema[]
}

/**
 * Creator
 */

export type CreatorFormPayload = {
  channel_pitch: string
  email_address: string
  name: string
}

export type CreatorFormSchema = {
  success: boolean
}

/**
 * User
 */

export type UserPayload = {
  first_name?: string
  last_name?: string
  job_title?: string
  phone?: string
  avatar?: {
    image_url?: string
    height?: string
    width?: string
  }
}

/**
 * Auth
 */

export type RegisterPayload = {
  username?: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  password: string
  confirm_password?: string
}

export type LoginPayload = {
  email: string
  password: string
  fcm_token: string
}

/**
 * Notifications
 */

export type NotificationChannelSchema = {
  id: string
  name: string
  description: string
  cover: Image
  thumbnail: Image
  video_engagements: VideoEngagement
  engagements: FeedEngagement
  subscription_price: number
  creator_type: CreatorType
}

export type NotificationCommentSchema = {
  id: string
  created_at: string
  updated_at: string
  user: PartialUser
  content: {
    type: 'text' | 'image' | 'video'
    text: string
    image_url: string
    height: string
    width: string
    aspect_ratio: string | string[]
    video_url: string
  }
  engagements: VideoEngagement
}

type NotificationSchema = {
  id: string
  created_at: string
  updated_at: string
  type: NotificationTypes
  ref: string
  resource_type: 'Video' | 'Comment'
  resource: VideoSchema | NotificationCommentSchema
  read: boolean
  triggered_by_type: TriggerType
  triggered_by: string
}

export type NotificationsSchema = {
  notifications: NotificationSchema[]
}

// export type NotificationChannel = {
//   id: string
//   name: string
//   description: string
//   coverUrl: string
//   avatarUrl: string
//   videoEngagements: VideoEngagement
//   engagements: FeedEngagement
//   subscriptionPrice: number
//   creatorType: CreatorType
// }

export type NotificationComment = {
  id: string
  createdAt: string
  updatedAt: string
  user: Omit<User, 'balance'>
  content: {
    type: 'text' | 'image' | 'video'
    text: string
    imageUrl: string
    height: string
    width: string
    aspectRatio: string | string[]
    videoUrl: string
  }
  engagements: VideoEngagement
}

export type Notification = {
  id: string
  createdAt: string
  updatedAt: string
  type: NotificationTypes
  ref: string
  resourceType: 'Video' | 'Comment'
  resource: Video | NotificationComment
  read: boolean
  triggeredType: TriggerType
  triggeredBy: string
}

/**
 * Activities
 */

type ActivitySchema = {
  id: string
  created_at: string
  updated_at: string
  type: ActivityTypes
  ref: string
  resource_type: EngagementType
  resource: string
}

export type ActivitiesSchema = {
  activities: ActivitySchema[]
}

export type Activity = {
  id: string
  createdAt: string
  updatedAt: string
  type: ActivityTypes
  ref: string
  resourceType: EngagementType
  resource: string
}

/**
 * Reporting
 */

export type ReportSchema = {
  report: {
    video_id?: string
    comment_id?: string
    user_id: string
    reason: string
  }
}

export type ReportPayload = {
  reason: string
  video_id?: string
  comment_id?: string
}

/*
 * News Items (Creator Videos)
 */
export type NewsItemSchema = {
  id: string
  duration: number
  created_at: string
  updated_at: string
  title: string
  content: string
  feed_id: string
  category_id: string
  tags: string[]
  descriptions: string[]
  category: string
  due_date: null
  news_credits: string[]
  visual_credits: string[]
  comments: string[]
  clips: Clip[]
  thumbnails: Thumbnail[]
  enqued_at: null
  ordinal: number
  owner: unknown
  state: 'ready_for_push'
  creator_type: CreatorType
  delete: boolean
}

export type NewsItemsSchema = { news_items: NewsItemSchema[] }

export type NewsItemStatus = 'ready_for_push' | 'pushed_to_feed' | 'transcoding'

export type NewsItem = {
  id: string
  duration: number
  lastUpdated: string
  status: NewsItemStatus
  title: string
  description?: string
  tags?: string[]
  categoryId?: string
  thumbnail: string
  url: string
  feedId: string
}

export type NewsItemPayload = {
  category: string
  category_id: string
  content: string
  descriptions: { language: string; sentences: string[] }[]
  due_date: string
  feed_id: string
  news_credits: unknown[]
  tags: string[]
  title: string
  visual_credits: unknown[]
}

/** Channels */

export type ChannelSchema = {
  id: string
  name: string
  description: string
  category_ids: string[]
  cover: Image
  thumbnail: Image
  video_engagements: VideoEngagement
  engagements: FeedEngagement
  subscription_price: number
  creator_type: CreatorType
}

export type ChannelsSchema = {
  channels: ChannelSchema[]
}

export type SearchChannel = {
  id: string
  name: string
  description: string
  categoryIds: string[]
  coverUrl: string
  avatarUrl: string
  subscriptionPrice: number
  subscribed: boolean
}
