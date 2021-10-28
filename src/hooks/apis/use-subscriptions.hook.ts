import * as React from 'react'
import { useQuery, useQueryClient } from 'react-query'

import * as api from '@/services/networking.service'
import * as transform from './api.transformers'
import { SubscriptionsSchema, Channel, PagingPayload } from './api.typings'
import { useStore } from '../use-store.hook'

type Params = {
  page?: number
  limit?: number
}

export const useSubscriptions = (props: Params = { page: 1, limit: 50 }) => {
  const queryClient = useQueryClient()
  const store = useStore()
  const userId = store.user?.id
  const token = store.token

  return useQuery<Channel[], unknown>(
    'subscriptions',
    api.get<SubscriptionsSchema, PagingPayload<never>>(
      'subscriptions',
      userId,
      {
        token: token,
        user_id: userId,
        page: props.page,
        limit: props.limit,
      }
    ),
    {
      enabled: !!token && !!userId,
      notifyOnChangeProps: ['data', 'error'],
      select: React.useCallback(data => transform.subscriptions(data), []),
      onSuccess: async () => {
        queryClient.invalidateQueries('videos')
      },
    }
  )
}
