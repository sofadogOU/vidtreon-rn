import faker from 'faker'
import { Category, Channel, ChannelProfile, Tag, VideoPreview } from '@/typings'

export const Channels: Channel[] = new Array(10).fill(null).map(() => ({
  id: faker.datatype.uuid(),
  name: '',
  description: '',
  avatar: '',
  cover: '',
}))

export const Tags: Tag[] = new Array(10).fill(null).map(() => ({
  id: faker.datatype.uuid(),
  name: '',
}))

export const VideoPreviews: VideoPreview[] = new Array(10)
  .fill(null)
  .map(() => ({
    id: faker.datatype.uuid(),
    title: '',
    description: '',
    poster: '',
    viewCount: '',
    duration: '',
    likes: '',
    channel: {
      id: faker.datatype.uuid(),
      name: '',
      description: '',
      avatar: '',
      cover: '',
    },
  }))

export const Categories: Category[] = new Array(15).fill(null).map(() => ({
  id: faker.datatype.uuid(),
  name: '',
}))

export const ChannelDetail: ChannelProfile = {
  id: faker.datatype.uuid(),
  avatar: '',
  cover: '',
  followers: undefined,
  name: undefined,
  description: undefined,
  featuredVideo: undefined,
  videoSuggestions: undefined,
  price: undefined,
}

export const relatedVideos: VideoPreview[] = new Array(3)
  .fill(null)
  .map(() => ({
    id: faker.datatype.uuid(),
    title: '',
    description: '',
    poster: '',
    viewCount: '',
    duration: '',
    likes: '',
    channel: {
      id: faker.datatype.uuid(),
      name: '',
      description: '',
      avatar: '',
      cover: '',
    },
  }))
