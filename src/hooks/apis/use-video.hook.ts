import * as React from 'react'
import { useQuery, useQueryClient } from 'react-query'

import * as api from '@/services/networking.service'
import * as transform from './api.transformers'
import {
  VideoTypes,
  SingleVideoSchema,
  Video,
  PagingPayload,
} from './api.typings'
import { useStore } from '../use-store.hook'

type Params = {
  videoId: string
}

export const useVideo = ({ videoId }: Params) => {
  // const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token
  return useQuery<Video, unknown>(
    ['video', { type: `${videoId}` }],
    api.get<SingleVideoSchema, PagingPayload<VideoTypes>>('videos', videoId, {
      token,
    }),
    {
      notifyOnChangeProps: ['data', 'error'],
      select: React.useCallback(data => transform.video(data), []),
      // onSuccess: async () => {
      //   queryClient.invalidateQueries('comments')
      // },
    }
  )
}
