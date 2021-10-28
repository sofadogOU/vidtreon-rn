import * as React from 'react'
import { useQuery } from 'react-query'

import * as api from '@/services/networking.service'
import * as transform from './api.transformers'
import { PagingPayload, FeedTypes, FeedsSchema, Channel } from './api.typings'
import { useStore } from '../use-store.hook'

type Params = {
  type?: FeedTypes
  page?: number
  limit?: number
  userId?: string
}

export const useFeeds = ({ type, page = 1, limit = 20, userId }: Params) => {
  const store = useStore()
  const token = store.token
  return useQuery<Channel[], unknown>(
    ['feeds', { type, limit }],
    api.get<FeedsSchema, PagingPayload<FeedTypes>>('feeds', undefined, {
      token: token,
      page,
      limit,
      type,
      user_id: userId,
    }),
    {
      // enabled: !!feedId && !!type,
      notifyOnChangeProps: ['data', 'error'],
      select: React.useCallback(data => transform.feeds(data), []),
    }
  )
}
