import * as Req from './Requests'
/**
 * Helpers
 */

// type Pagination = {
//   page: number
//   limit: number
// }

// type List = Req.Token &
//   Pagination & {
//     userId?: string
//     feedId?: string
//   }

// type Video = List &
//   Req.VideoType & {
//     videoId?: number
//   }
// /**
//  * Defined Payloads
//  */

export type ID = {
  userId?: number | string
  feedId?: number | string
}

// type CommentingText = Commenting & {
//   text: string
// }

// type CommentingImage = Commenting & {
//   imageUrl: string
//   height: number
//   width: number
// }

// type CommentingVideo = CommentingImage & {
//   videoUrl: string
//   aspectRatio: number[]
// }

export type Login = {
  email: string
  password: string
}

export type SocialLogin = {
  token?: string
  domain?: Req.SocialDomains
}

export type Registration = Login & {
  firstName: string
  lastName: string
  username?: string
  phone?: string
  confirmPassword?: string
}

// export type Subscription = List
// export type WatchedHistory = List
// export type Feed = (List & Req.FeedType) | Pick<List, 'feedId' | 'token'>
// export type Subscribe = Pick<List, 'feedId' | 'userId' | 'token'>
// export type Balance = Pick<List, 'userId' | 'token'>
// export type Video = Video | Pick<Video, 'videoId' | 'token'>
// export type Categories = Req.Token
// export type Tags = Req.Token
// export type Comments = Pagination & Req.Comment & Req.Token

export type Feeds = Req.Pagination &
  ID & {
    type?: Req.FeedTypes
    token?: string
  }

export type Videos = Req.Pagination &
  ID & {
    id?: string | number
    type?: Req.VideoTypes
    title?: string
    categories?: number[]
    tags?: string[]
    token?: string
  }

export type Subscriptions = Req.Pagination &
  ID & {
    token?: string
  }

export type Subscribe = ID & {
  token?: string
}

export type Notifications = Req.Pagination & {
  token?: string
}

export type Watching = Req.Pagination & {
  token?: string
}

export type Comments = Req.Pagination & {
  ref: number[] | string[]
  resourceType: Req.ResourceType
  type: Req.CommentType
  order?: Req.OrderType
}

export type ReadNotification = {
  notificationId: string
  body: Record<string, unknown>
  token: string
}

export type Like = {
  resourceType: Req.ResourceType
  ref: number[] | string[]
  token: string
}

export type Commenting = {
  resourceType: Req.ResourceType
  ref: number[] | string[]
  token?: string
}

export type CommentingPayload = {
  type?: Req.CommentingType
  text?: string
  imageUrl?: string
  height?: number
  width?: number
  videoUrl?: string
  aspectRatio?: number[]
}

export type CommentRemove = {
  resourceType: Req.ResourceType
  ref: number[]
  token: string
}

export type SubscriptionRemove = {
  userId?: string
  feedId?: string
  token?: string
}
