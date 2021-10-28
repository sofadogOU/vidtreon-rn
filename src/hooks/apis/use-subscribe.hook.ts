import { useMutation, useQueryClient } from 'react-query'
import * as api from '@/services/networking.service'
import { AuthSchema, PagingPayload } from './api.typings'
import { useStore } from '../use-store.hook'

type Params = {
  feedId: string
  userId?: string
  token?: string
}

export const useSubscribe = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  const userId = store.user?.id
  const token = store.token

  return useMutation<AuthSchema, never, Params>(
    data =>
      api.post<AuthSchema, unknown, PagingPayload<never>, never>(
        'subscriptions',
        {},
        {
          user_id: userId || '',
          feed_id: data.feedId,
          token: token || '',
        }
      ),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('videos')
        queryClient.invalidateQueries('subscriptions')
        queryClient.invalidateQueries('balance')
        queryClient.invalidateQueries('watchlist')
      },
    }
  )
}

export const useUnsubscribe = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  const userId = store.user?.id
  const token = store.token

  return useMutation<AuthSchema, never, Params>(
    data =>
      api.remove<AuthSchema, PagingPayload<never>, never>('subscriptions', {
        user_id: userId || '',
        feed_id: data.feedId,
        token: token || '',
      }),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries('subscriptions')
        queryClient.invalidateQueries('videos')
        queryClient.invalidateQueries('balance')
        queryClient.invalidateQueries('watchlist')
      },
    }
  )
}
