import {
  useMutation,
  // useQueryClient
} from 'react-query'
import * as api from '@/services/networking.service'
import { LikesSchema, PagingPayload, UploadsSchema } from './api.typings'
import { useStore } from '../use-store.hook'

export const useUpload = () => {
  // const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token

  return useMutation<UploadsSchema, never, unknown>(
    data =>
      api.post<LikesSchema, unknown, PagingPayload<never>, unknown>(
        'uploads',
        data,
        { token },
        undefined,
        { 'Content-Type': 'multipart/form-data' }
      ),
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(['videos'])
      },
    }
  )
}
