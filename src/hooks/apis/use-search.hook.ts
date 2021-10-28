import * as React from 'react'
import { useQuery } from 'react-query'

import * as api from '@/services/networking.service'
import * as transform from './api.transformers'
import { ChannelsSchema, SearchChannel, PagingPayload } from './api.typings'
import { useStore } from '../use-store.hook'

type Params = {
  page?: number
  limit?: number
  query?: string
}

export const useSearchChannels = ({
  page = 1,
  limit = 1000,
  query,
}: Params) => {
  const store = useStore()
  const token = store.token
  return useQuery<SearchChannel[], unknown>(
    ['searchChannels', query],
    api.getNonDsa<ChannelsSchema, PagingPayload<unknown>>(
      'searchChannels',
      undefined,
      {
        page,
        limit,
        query,
        token,
      }
    ),
    {
      enabled: query !== undefined,
      notifyOnChangeProps: ['data', 'error', 'isLoading', 'isFetching'],
      select: React.useCallback(data => transform.channels(data), []),
    }
  )
}
