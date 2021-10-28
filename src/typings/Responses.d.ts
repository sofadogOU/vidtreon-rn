/**
 * Helpers
 */

type Image = {
  image_url: string
  height: string
  width: string
}

type CreatorType = 'sofadog' | 'content_creator'
type CreatorStatus = 'active' | 'cancelled' | 'price_changed'

type AdminRoles = {
  id: string
  description: string
}

type Interactions = {
  likes: boolean
  comments: boolean
  mentions: boolean
}

type VideoUpdates = {
  followed_channels: boolean
  suggestions: boolean
}

type VideoEngagements = {
  total_likes: number
  total_views: number
  total_comments: number
  comments?: Comment[]
  liked?: boolean
  viewed?: boolean
}

type ChannelEngagements = {
  total_subscribers: number
  subscribed: boolean
}

type Preferences = {
  notifications: {
    interactions: Interactions
    video_updates?: VideoUpdates
  }
}

type Finance = {
  balance: number
}

type PartialUser = {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  phone: string
  avatar: Image
  job_title?: string
}

export type FullUser = PartialUser & {
  admin_roles: AdminRoles[]
  disabled: boolean
  on_shift: boolean
  preference: Preferences
  finance: Finance
  creator_type?: CreatorType
}

type Clip = {
  id: string
  created_at: string
  updated_at: string
  aspect_ratio: string
  url: string
}

type Thumbnail = {
  id: string
  created_at: string
  updated_at: string
  aspect_ratio: string
  url: string
}

type WatchHistory = {
  duration: number
  progress: number
  updated_at: string
  created_at: string
}

type FeedType = {
  id: string
  name: string
  description: string
  cover: Image
  thumbnail: Image
  video_engagements: VideoEngagements
  engagements: ChannelEngagements
  subscription_price: number
  creator_type: CreatorType
  category_ids?: string[]
}

export type SubscriptionType = {
  id: string
  price: number
  status: CreatorStatus
  last_active_date: string
  feed: FeedType
  user: PartialUser
}

type VideoType = {
  id: string
  created_at: string
  updated_at: string
  title: string
  content: string
  feed_id: number
  category: number
  category_id: number
  tags: string[]
  clips: Clip[]
  thumbnails: Thumbnail[]
  engagements: VideoEngagements
  channel: FeedType
  creator_type: CreatorType
  watched_history?: WatchHistory
  duration: number
}

type Tag = {
  id: string
  title: string
  colorHex?: string
  created_at: string
  updated_at: string
}

type Category = Tag

type CommentType = 'text' | 'image' | 'video'

type CommentContent = {
  type: CommentType
  text: string
  image_url: string
  height: string
  width: string
  aspect_ratio: string
  video_url: string
}

type Comment = {
  id: string
  created_at: string
  updated_at: string
  user: PartialUser
  content: CommentContent
  engagements: VideoEngagements
}

type CommentsType = {
  id: string
  total_comments: number
  comments: Comment[]
}

type NotificationTypes =
  | 'liked_in_video_page'
  | 'subscribed_to_channel'
  | 'commented_in_video_page'
  | 'mentioned_in_video_page'
  | 'published_video'
  | 'finished_transcoding'
type NotificationResource = 'video' | 'comment' | 'channel'
type NotificationTrigger = 'user' | 'channel' | 'system'

type Notification = {
  id: string
  created_at: string
  updated_at: string
  type: NotificationTypes
  ref: number[]
  resource_type: NotificationResource
  resource: string
  read: boolean
  triggered_by_type: NotificationTrigger
  triggered_by: string
}

/**
 * API Responses
 */

export type Token = { token: string }
export type User = Token & { user: FullUser }
export type Subscriptions = { subscriptions: SubscriptionType[] }
export type Subscription = { subscription: SubscriptionType }
export type WatchedHistory = { videos: VideoType[] }
export type Feeds = { feeds: FeedType[] }
export type Feed = { feed: FeedType }
export type Tags = { tags: Tag[] }
export type Categories = { categories: Category[] }
export type Videos = { videos: VideoType[] }
export type Video = { video: VideoType }
export type Comments = CommentsType
export type Notifications = { notifications: Notification[] }
export type Like = { status: 'liked' | 'unliked' }
export type Commenting = { comment: Comment }
export type CommentRemove = { status: 'deleted' }
export type SubscriptionRemove = { subscription: SubscriptionType }
export type Upload = {
  type: 'image' | 'video'
  image_url: string
  video_url: string
  height: number
  width: number
  aspect_ratio: number[]
}
