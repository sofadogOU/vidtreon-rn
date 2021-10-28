import * as React from 'react'
import { useQuery, useQueryClient, useMutation } from 'react-query'

import * as api from '@/services/networking.service'
import * as transform from './api.transformers'
import {
  VideoTypes,
  VideosSchema,
  Video,
  PagingPayload,
  WatchlistSchema,
  WatchlistPayload,
} from './api.typings'
import { useStore } from '../use-store.hook'

type Params = {
  type?: VideoTypes
  feedId?: string
  videoId?: string
  page?: number
  limit?: number
}

export const useWatchlist = ({
  type,
  feedId,
  videoId,
  page = 1,
  limit = 20,
}: Params) => {
  const pathParam = undefined
  const store = useStore()
  const token = store.token
  return useQuery<Video[], unknown>(
    ['watchlist'],
    api.get<VideosSchema, PagingPayload<VideoTypes>>('watchlist', pathParam, {
      id: videoId,
      feed_id: feedId,
      page,
      limit,
      type,
      token,
    }),
    {
      enabled: !!token,
      notifyOnChangeProps: ['data', 'error'],
      select: React.useCallback(data => transform.videos(data), []),
    }
  )
}

type UpdateParams = {
  videoId: string
  duration: number
  progress: number
}

export const useUpdateWatchlist = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token
  return useMutation<WatchlistSchema, unknown, UpdateParams>(
    data =>
      api.put<WatchlistSchema, WatchlistPayload, PagingPayload<never>, never>(
        'watchlist',
        {
          duration: data.duration,
          progress: data.progress,
        },
        {
          id: data.videoId,
          token,
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['watchlist'])
      },
    }
  )
}
