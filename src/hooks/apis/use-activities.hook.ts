import * as React from 'react'
import { useQuery } from 'react-query'

import * as api from '@/services/networking.service'
import { ActivitiesSchema, Activity, PagingPayload } from './api.typings'
import * as transform from './api.transformers'
import { useStore } from '../use-store.hook'

export const useActivities = () => {
  const store = useStore()
  const token = store.token
  return useQuery<Activity[], unknown>(
    'activities',
    api.get<ActivitiesSchema, PagingPayload<never>>('activities', undefined, {
      page: 1,
      limit: 100,
      token,
    }),
    {
      enabled: !!token,
      notifyOnChangeProps: ['data', 'error'],
      select: React.useCallback(data => transform.activities(data), []),
    }
  )
}
