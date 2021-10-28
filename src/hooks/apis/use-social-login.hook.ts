import { useMutation, useQueryClient } from 'react-query'
import * as api from '@/services/networking.service'
import { SocialAuthPayload, AuthSchema } from './api.typings'

export const useSocialLogin = () => {
  const queryClient = useQueryClient()
  return useMutation<AuthSchema, unknown, SocialAuthPayload>(
    data =>
      api.post<AuthSchema, SocialAuthPayload, unknown, unknown>(
        'socialLogin',
        data
      ),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(['balance'])
        queryClient.invalidateQueries(['videos'])
        queryClient.invalidateQueries(['subscriptions'])
      },
    }
  )
}
