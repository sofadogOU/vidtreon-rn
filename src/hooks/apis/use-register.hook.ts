import {
  useMutation,
  // useQueryClient
} from 'react-query'
import * as api from '@/services/networking.service'
import { AuthSchema, RegisterPayload } from './api.typings'

export const useRegister = () => {
  // const queryClient = useQueryClient()
  return useMutation<AuthSchema, unknown, RegisterPayload>(
    data =>
      api.post<AuthSchema, RegisterPayload, unknown, unknown>('register', data),
    {
      // onSuccess: async () => {
      //   queryClient.invalidateQueries(['balance'])
      //   queryClient.invalidateQueries(['videos'])
      //   queryClient.invalidateQueries(['subscriptions'])
      // },
    }
  )
}
