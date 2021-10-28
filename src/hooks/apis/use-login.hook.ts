import { useMutation, useQueryClient } from 'react-query'
import * as api from '@/services/networking.service'
import { AuthSchema, LoginPayload } from './api.typings'

export const useLogin = () => {
  const queryClient = useQueryClient()
  return useMutation<AuthSchema, unknown, LoginPayload>(
    data => api.post<AuthSchema, LoginPayload, unknown, unknown>('login', data),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(['balance'])
        queryClient.invalidateQueries(['videos'])
        queryClient.invalidateQueries(['subscriptions'])
      },
    }
  )
}
