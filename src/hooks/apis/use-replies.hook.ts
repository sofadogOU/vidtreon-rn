import * as React from 'react'
import { useQuery } from 'react-query'

import * as api from '@/services/networking.service'
import * as transform from './api.transformers'
import {
  PagingPayload,
  EngagementType,
  CommentType,
  CommentOrder,
  CommentsSchema,
  Comment,
} from './api.typings'
import { useStore } from '../use-store.hook'

type Params = {
  ref: any[]
  resourceType: EngagementType
  type?: CommentType
  order?: CommentOrder
  page?: number
  limit?: number
}

export const useReplies = ({
  type = 'all',
  order = 'most_recent',
  ref,
  resourceType,
}: Params) => {
  const store = useStore()
  const token = store.token
  return useQuery<Comment[], unknown>(
    ['replies', `${ref}`],
    api.get<CommentsSchema, PagingPayload<CommentType>>('comments', undefined, {
      type,
      ref: ref.join(','),
      resource_type: resourceType,
      order,
      page: 1,
      limit: 100,
      token,
    }),
    {
      enabled: !!ref && ref.indexOf(-1) === undefined,
      notifyOnChangeProps: ['data', 'error'],
      select: React.useCallback(data => transform.comments(data), []),
    }
  )
}
