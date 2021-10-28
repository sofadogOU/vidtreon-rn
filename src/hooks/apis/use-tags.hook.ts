import * as React from 'react'
import { useQuery } from 'react-query'

import * as api from '@/services/networking.service'
import * as transform from './api.transformers'
import { Tag, TagsSchema } from './api.typings'

export const useTags = () => {
  return useQuery<Tag[], unknown>(
    'tags',
    api.get<TagsSchema, unknown>('tags'),
    {
      notifyOnChangeProps: ['data', 'error'],
      select: React.useCallback(data => transform.tags(data), []),
    }
  )
}
