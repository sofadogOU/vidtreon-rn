/**
 * Helpers
 */

type Token = { token?: string }
type UserId = { user_id?: number }
type FeedId = { feed_id?: number }
type VideoId = { video_id?: number }

type Pagination = {
  page: number
  limit: number
}

type VideoTypes =
  | 'latest'
  | 'popular'
  | 'most_commented'
  | 'most_viewed'
  | 'touching_stories'
  | 'sofadog'
  | 'newly_added'
  | 'positive_news'
  | 'related'

type FeedTypes = 'suggested' | 'new' | 'home'
export type ResourceType = 'video' | 'comment'
type OrderType = 'most_recent'
export type CommentingType = 'text' | 'image' | 'video'
type CommentType = CommentingType | 'all'
export type SocialDomains = 'google' | 'facebook' | 'apple'

type Comment = {
  resource_type: ResourceType
  ref: number
  type: CommentType
  order: OrderType
}

// type CommentText = {
//   text: string
//   type: CommentingType
// }
// type CommentImage = {
//   image_url: string
//   height: number
//   width: number
//   type: CommentingType
// }
// type CommentVideo = {
//   aspect_ratio: number[]
//   video_url
// }

/**
 * Requests
 */

export type Login = {
  email: string
  password: string
}

export type SocialLogin = {
  token: string
  domain: SocialDomains
}

export type Registration = Login & {
  first_name: string
  last_name: string
  username?: string
  phone?: string
  confirm_password?: string
}

// export type FeedOptions = Token &
//   UserId &
//   FeedId & {
//     page: number
//     limit: number
//   }

// export type SubscribeOptions = Token & UserId & FeedId
// export type Categories = Token
// export type Tags = Token

export type Feeds = Pagination & UserId & FeedId & FeedTypes & Token

export type Videos = Pagination &
  VideoId &
  VideoTypes &
  Token & {
    id?: number
  }

export type Comments = Pagination & Comment & Token

export type Subscriptions = Pagination & UserId & FeedId & Token
export type Subscribe = UserId & FeedId & Token
export type Watching = Pagination & Token
export type Notifications = Pagination & Token
export type ReadNotification = Token & {
  notification_id: string
  body: Record<string, unknown>
}
export type Like = {
  resource_type: ResourceType
  ref: number
  token: string
}

export type Commenting = {
  resource_type: ResourceType
  ref: number[]
  token: string
}

export type CommentingPayload = {
  text?: string
  image_url?: string
  video_url?: string
  height?: number
  width?: number
  aspect_ratio?: number[]
}

export type CommentRemove = {
  resource_type: ResourceType
  ref: number[]
  token: string
}

export type SubscriptionRemove = {
  user_id: number
  feed_id: number
  token: string
}
