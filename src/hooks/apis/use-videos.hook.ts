import * as React from 'react'
import { useQuery } from 'react-query'

import * as api from '@/services/networking.service'
import * as transform from './api.transformers'
import { VideoTypes, VideosSchema, Video, PagingPayload, ChannelIdSchema} from './api.typings'
import { useStore } from '../use-store.hook'

type Params = {
  type?: VideoTypes
  feedId?: string
  videoId?: string
  page?: number
  limit?: number
  title?: string
  tags?: string[]
  categories?: string[]
}

export const useVideos = ({
  type,
  feedId,
  videoId,
  page = 1,
  limit = 20,
  title,
  tags,
  categories,
}: Params) => {
  const store = useStore()
  const token = store.token
  const userId = store.user?.id
  return useQuery<Video[], unknown>(
    ['videos', `${type}${feedId}${tags}${title}${categories}${token}`],
    api.get<VideosSchema, PagingPayload<VideoTypes>>('videos', undefined, {
      id: videoId,
      feed_id: feedId,
      page,
      limit,
      type,
      title,
      tags: tags?.join(','),
      categories: categories?.join(','),
      token,
      user_id: userId,
    }),
    {
      notifyOnChangeProps: ['data', 'error', 'isLoading', 'isFetching'],
      select: React.useCallback(data => transform.videos(data), []),
    }
  )
}

export const useSubscribedVideos = ({
  type,
  feedId,
  videoId,
  page = 1,
  limit = 20,
  title,
  tags,
  categories,
}: Params) => {
  const store = useStore()
  const token = store.token
  return useQuery<Video[], unknown>(
    ['videos', `${type}${feedId}${tags}${title}${categories}${token}`],
    api.getNonDsa<VideosSchema, PagingPayload<VideoTypes>>(
      'videos',
      'subscribed',
      {
        id: videoId,
        feed_id: feedId,
        page,
        limit,
        type,
        title,
        tags: tags?.join(','),
        categories: categories?.join(','),
        token,
      }
    ),
    {
      notifyOnChangeProps: ['data', 'error', 'isLoading', 'isFetching'],
      select: React.useCallback(data => transform.videos(data), []),
    }
  )
}

export const useExploreVideos = ({
  type,
  feedId,
  videoId,
  page = 1,
  limit = 20,
  title,
  tags,
  categories,
}: Params) => {
  const store = useStore()
  const token = store.token
  return useQuery<Video[], unknown>(
    ['videos', `${type}${feedId}${tags}${title}${categories}${token}`],
    api.getNonDsa<VideosSchema, PagingPayload<VideoTypes>>(
      'videos',
      'explore',
      {
        id: videoId,
        feed_id: feedId,
        page,
        limit,
        type,
        title,
        tags: tags?.join(','),
        categories: categories?.join(','),
        token,
      }
    ),
    {
      notifyOnChangeProps: ['data', 'error', 'isLoading', 'isFetching'],
      select: React.useCallback(data => transform.videos(data), []),
    }
  )
}

export const channelId = () => {
  const store = useStore()
  const userId = store.user?.id
  const token = store.token

  return useQuery<unknown, unknown>(
    'balance',
    api.get<ChannelIdSchema, unknown>('balance', userId, {
      token: token,
    }),
    {
      enabled: !!userId,
      notifyOnChangeProps: ['data', 'error'],
      select: React.useCallback(data => transform.balance(data), []),
    }
  )
}


