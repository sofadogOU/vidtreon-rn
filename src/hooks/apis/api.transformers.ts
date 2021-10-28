import numeral from 'numeral'

import {
  BalanceSchema,
  SubscriptionsSchema,
  Channel,
  Comment,
  User,
  UserSchema,
  VideosSchema,
  VideoSchema,
  Video,
  FeedsSchema,
  FeedSchema,
  SingleVideoSchema,
  CommentsSchema,
  CategoriesSchema,
  Category,
  TagsSchema,
  Tag,
  NotificationsSchema,
  Notification,
  ActivitiesSchema,
  Activity,
  NotificationCommentSchema,
  NotificationComment,
  NewsItemsSchema,
  NewsItem,
  ChannelsSchema,
  SearchChannel,
} from './api.typings'

import { calcProgressPerc } from '@/utils/video-helpers.util'

export const user = (data: UserSchema): User => ({
  id: data.id,
  username: data.username,
  firstName: data.first_name,
  lastName: data.last_name,
  email: data.email,
  avatarUrl: data.avatar.image_url,
  avatarHeight: data.avatar.height,
  avatarWidth: data.avatar.width,
  balance: data.finance.balance,
  creatorType: data.creator_type,
})

export const balance = ({ balance }: BalanceSchema): number => balance

export const subscriptions = ({
  subscriptions,
}: SubscriptionsSchema): Channel[] =>
  subscriptions?.map(item => {
    return {
      id: item.id,
      feedId: item.feed.id,
      userId: item.user.id,
      name: item.feed.name,
      description: item.feed.description,
      avatarUrl: item.feed.thumbnail.image_url,
      coverUrl: item.feed.cover.image_url,
      status: item.status,
      price: item.price,
      followerCount: item.feed.engagements.total_subscribers,
      categories: item.feed.category_ids,
    }
  })

const _feed = (item: FeedSchema): Channel => ({
  id: item.id,
  feedId: item.id,
  name: item.name,
  description: item.description,
  avatarUrl: item.thumbnail.image_url,
  coverUrl: item.cover.image_url,
  price: item.subscription_price,
  followerCount: item.engagements.total_subscribers,
  categories: item.category_ids,
  subscribed: item.engagements.subscribed,
})

export const feeds = ({ feeds }: FeedsSchema): Channel[] =>
  feeds?.map(item => {
    return _feed(item)
  })

export const feed = ({ feed }: { feed: FeedSchema }): Channel => _feed(feed)

const _video = (item: VideoSchema): Video => {
  const views = item.engagements.total_views || 0
  const formatter = views < 1000000 ? '0a' : '0.0a'
  const viewCount = numeral(views).format(formatter)
  return {
    id: item.id,
    title: item.title,
    description: item.content,
    videoUrl: item.clips[0].url,
    coverUrl: item.thumbnails[0].url,
    posterUrl: item.thumbnails[0].url,
    uploaded: item.created_at,
    viewCount,
    likes: `${item.engagements.total_likes}`,
    liked: !!item.engagements.liked,
    duration: item.duration,
    seekPosition: item.watched_history
      ? calcProgressPerc(item.watched_history?.progress, item.duration)
      : item.watched_history,
    channel: {
      id: item.channel.id,
      feedId: item.feed_id,
      name: item.channel.name,
      description: item.channel.description,
      price: item.channel.subscription_price,
      avatarUrl: item.channel.thumbnail.image_url,
      coverUrl: item.channel.cover.image_url,
      followerCount: item.channel.engagements.total_subscribers,
      categories: item.channel.category_ids,
      subscribed: item.channel.engagements.subscribed || false,
    },
  }
}

export const videos = ({ videos }: VideosSchema): Video[] =>
  videos?.map(item => _video(item))

export const video = ({ video }: SingleVideoSchema): Video => _video(video)

const filterEmpty = (v: string) => (v !== '' ? v : undefined)

export const comments = ({ comments }: CommentsSchema): Comment[] =>
  comments?.map(item => {
    return {
      id: item.id,
      type: item.content.type,
      text: filterEmpty(item.content.text),
      imageUrl: filterEmpty(item.content.image_url),
      videoUrl: filterEmpty(item.content.video_url),
      created: item.created_at,
      liked: !!item.engagements.liked,
      likes: item.engagements.total_likes,
      replies: item.engagements.total_comments,
      user: {
        id: item.user.id,
        firstName: item.user.first_name,
        lastName: item.user.last_name,
        username: item.user.username,
        avatarUrl: item.user.avatar.image_url,
      },
    }
  })

export const categories = ({ categories }: CategoriesSchema): Category[] =>
  categories?.map(item => ({
    id: item.id,
    colorHex: item.colorHex,
    title: item.title,
  }))

const _notificationComment = (
  item: NotificationCommentSchema
): NotificationComment => ({
  id: item.id,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
  user: {
    id: item.user.id,
    email: item.user.email,
    username: item.user.username,
    firstName: item.user.first_name,
    lastName: item.user.last_name,
    avatarUrl: item.user.avatar.image_url,
    avatarHeight: item.user.avatar.height,
    avatarWidth: item.user.avatar.width,
  },
  content: {
    type: item.content.type,
    text: item.content.text,
    imageUrl: item.content.image_url,
    height: item.content.height,
    width: item.content.width,
    aspectRatio: item.content.aspect_ratio,
    videoUrl: item.content.video_url,
  },
  engagements: item.engagements,
})

export const notifications = ({
  notifications,
}: NotificationsSchema): Notification[] =>
  notifications?.map(item => ({
    id: item.id,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    type: item.type,
    ref: item.ref,
    resourceType: item.resource_type,
    resource:
      item.resource_type === 'Video'
        ? _video(item.resource as VideoSchema)
        : _notificationComment(item.resource as NotificationCommentSchema),
    read: item.read,
    triggeredType: item.triggered_by_type,
    triggeredBy: item.triggered_by,
  }))

// const _notificationChannel = (
//   item: NotificationChannelSchema
// ): NotificationChannel => ({
//   id: item.id,
//   name: item.name,
//   description: item.description,
//   coverUrl: item.cover.image_url,
//   avatarUrl: item.thumbnail.image_url,
//   videoEngagements: item.video_engagements,
//   engagements: item.engagements,
//   subscriptionPrice: item.subscription_price,
//   creatorType: item.creator_type,
// })

export const tags = ({ tags }: TagsSchema): Tag[] => {
  const formatted = tags?.map(item => ({
    id: item.id,
    name: item.title.replace(/(\r\n|\n|\r)/gm, ''),
  }))
  const filtered = formatted.filter(item => item.name !== '')
  filtered?.unshift({ id: 'ALL', name: 'All' })
  return filtered
}

export const activities = ({ activities }: ActivitiesSchema): Activity[] =>
  activities?.map(item => ({
    id: item.id,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    type: item.type,
    ref: item.ref,
    resourceType: item.resource_type,
    resource: item.resource,
  }))

export const newsItems = ({ news_items }: NewsItemsSchema): NewsItem[] =>
  news_items?.map(item => ({
    id: item.id,
    duration: item.duration,
    lastUpdated: item.updated_at,
    status: item.state,
    title: item.title,
    url: item.clips[0]?.url,
    thumbnail: item.thumbnails[0]?.url,
    description: item.content,
    tags: item.tags,
    categoryId: item.category_id,
    feedId: item.feed_id,
  }))

export const channels = ({ channels }: ChannelsSchema): SearchChannel[] =>
  channels?.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    categoryIds: item.category_ids,
    coverUrl: item.cover.image_url,
    avatarUrl: item.thumbnail.image_url,
    subscriptionPrice: item.subscription_price,
    subscribed: item.engagements.subscribed,
  }))
