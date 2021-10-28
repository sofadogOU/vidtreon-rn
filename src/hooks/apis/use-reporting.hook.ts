import {
  useMutation,
  // useQueryClient
} from 'react-query'
import * as api from '@/services/networking.service'
import { PagingPayload, ReportPayload, ReportSchema } from './api.typings'
import { useStore } from '../use-store.hook'

type Params = {
  reason: string
  videoId?: string
  commentId?: string[]
}

export const useReporting = () => {
  // const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token

  return useMutation<ReportSchema, never, Params>(
    data =>
      api.post<ReportSchema, ReportPayload, PagingPayload<never>, never>(
        'report',
        {
          reason: data.reason,
          video_id: data.videoId,
          comment_id: data.commentId?.join(','),
        },
        {
          token,
        }
      ),
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(['videos'])
        // queryClient.invalidateQueries(['notifications'])
      },
    }
  )
}
