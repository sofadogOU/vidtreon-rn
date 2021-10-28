import { useMutation, useQueryClient } from 'react-query'
import * as api from '@/services/networking.service'
import {
  EngagementType,
  LikesSchema,
  PagingPayload,
  CommentPayload,
} from './api.typings'
import { useStore } from '../use-store.hook'

type Params = {
  resourceType: EngagementType
  ref: unknown[]
  type: 'text' | 'image' | 'video'
  text?: string
  imageUrl?: string
  height?: string
  width?: string
  videoUrl?: string
  aspectRatio?: string | string[]
}

export const usePostComment = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token

  return useMutation<LikesSchema, never, Params>(
    data =>
      api.post<LikesSchema, CommentPayload, PagingPayload<never>, unknown>(
        'comments',
        {
          type: data.type,
          text: data.text,
          image_url: data.imageUrl,
          video_url: data.videoUrl,
          aspect_ratio: data.aspectRatio,
          height: data.height,
          width: data.width,
        },
        {
          ref: data.ref.filter(Boolean).join(','),
          resource_type: data.resourceType,
          token,
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments'])
      },
    }
  )
}
