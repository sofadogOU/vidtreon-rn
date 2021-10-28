import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import * as api from '@/services/networking.service'
import { NotificationsSchema, Notification, PagingPayload } from './api.typings'
import * as transform from './api.transformers'
import { useStore } from '../use-store.hook'

export const useNotifications = () => {
  const store = useStore()
  const token = store.token
  return useQuery<Notification[], unknown>(
    'notifications',
    api.get<NotificationsSchema, PagingPayload<never>>(
      'notifications',
      undefined,
      {
        token,
        page: 1,
        limit: 100,
      }
    ),
    {
      enabled: !!token,
      notifyOnChangeProps: ['data', 'error'],
      select: React.useCallback(data => transform.notifications(data), []),
    }
  )
}

export const useReadNotification = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token

  return useMutation<NotificationsSchema, never, { notificationId: string }>(
    data =>
      api.post<NotificationsSchema, unknown, PagingPayload<never>, unknown>(
        'readNotification',
        {},
        { token },
        data.notificationId
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['notifications'])
      },
    }
  )
}
