import * as React from 'react'
import { useQuery } from 'react-query'

import * as api from '@/services/networking.service'
import * as transform from './api.transformers'
import { PagingPayload, FeedTypes, FeedSchema, Channel } from './api.typings'
import { useStore } from '../use-store.hook'

type Params = {
  type?: FeedTypes
  feedId: string
  videoId?: string
  page?: number
  limit?: number
}

export const useFeed = ({ type, feedId, page = 1, limit = 20 }: Params) => {
  const store = useStore()
  // const userId = store.user?.id
  const token = store.token
  return useQuery<Channel, unknown>(
    ['feed', { type: feedId }],
    api.get<{ feed: FeedSchema }, PagingPayload<FeedTypes>>('feeds', feedId, {
      token: token,
      // user_id: userId,
      feed_id: feedId,
      page,
      limit,
      type,
    }),
    {
      enabled: !!feedId,
      notifyOnChangeProps: ['data', 'error'],
      select: React.useCallback(data => transform.feed(data), []),
    }
  )
}
