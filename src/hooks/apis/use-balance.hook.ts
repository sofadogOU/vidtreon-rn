import * as React from 'react'
import { useQuery } from 'react-query'

import * as api from '@/services/networking.service'
import * as transform from './api.transformers'
import { BalanceSchema } from './api.typings'
import { useStore } from '../use-store.hook'

type Token = { token?: string | null }

export const useBalance = () => {
  const store = useStore()
  const userId = store.user?.id
  const token = store.token

  return useQuery<number, unknown>(
    'balance',
    api.get<BalanceSchema, Token>('balance', userId, {
      token: token,
    }),
    {
      enabled: !!userId,
      notifyOnChangeProps: ['data', 'error'],
      select: React.useCallback(data => transform.balance(data), []),
    }
  )
}
