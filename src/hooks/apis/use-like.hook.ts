import { useMutation, useQueryClient } from 'react-query'
import * as api from '@/services/networking.service'
import { EngagementType, LikesSchema, PagingPayload } from './api.typings'
import { useStore } from '../use-store.hook'

type Params = {
  resourceType: EngagementType
  ref: string[]
}

export const useLike = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token

  return useMutation<LikesSchema, never, Params>(
    data =>
      api.post<LikesSchema, unknown, PagingPayload<never>, never>(
        'like',
        {},
        {
          ref: data.ref.filter(Boolean).join(),
          resource_type: data.resourceType,
          token,
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['videos'])
        queryClient.invalidateQueries(['notifications'])
      },
    }
  )
}

export const useUnlike = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token

  return useMutation<LikesSchema, never, Params>(
    data =>
      api.remove<LikesSchema, PagingPayload<never>, never>('like', {
        ref: data.ref.filter(Boolean).join(),
        resource_type: data.resourceType,
        token,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['videos'])
        queryClient.invalidateQueries(['notifications'])
      },
    }
  )
}
