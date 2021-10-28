import { useMutation, useQueryClient } from 'react-query'
import * as api from '@/services/networking.service'
import { PagingPayload, UserPayload, AuthSchema } from './api.typings'
import { useStore } from '../use-store.hook'

type Payload = {
  firstName?: string
  lastName?: string
  email?: string
  avatar?: {
    imageUrl: string
    height: string
    width: string
  }
}

export const useSaveUser = () => {
  // const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token
  const userId = store.user?.id

  return useMutation<AuthSchema, never, Payload>(
    data =>
      api.patch<AuthSchema, UserPayload, PagingPayload<never>, never>(
        'user',
        {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: '',
          avatar: {
            image_url: data.avatar?.imageUrl,
            height: data.avatar?.height,
            width: data.avatar?.width,
          },
        },
        {
          token,
        },
        userId
      ),
    {
      onSuccess: ({ user: data }) => {
        store.setUser({
          id: data.id,
          username: data.username,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          avatarUrl: data.avatar.image_url,
          avatarHeight: data.avatar.height,
          avatarWidth: data.avatar.width,
          balance: data.finance.balance,
        })
      },
    }
  )
}

export const useSaveUsername = () => {
  // const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token
  const userId = store.user?.id

  return useMutation<AuthSchema, never, { username: string }>(
    data =>
      api.put<AuthSchema, { username: string }, PagingPayload<never>, never>(
        'username',
        {
          username: data.username,
        },
        {
          token,
        },
        userId
      ),
    {
      onSuccess: ({ user: data }) => {
        store.setUser({
          id: data.id,
          username: data.username,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          avatarUrl: data.avatar.image_url,
          avatarHeight: data.avatar.height,
          avatarWidth: data.avatar.width,
          balance: data.finance.balance,
        })
      },
    }
  )
}

export const useSaveEmail = () => {
  // const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token
  const userId = store.user?.id

  return useMutation<AuthSchema, never, { email: string }>(
    data =>
      api.put<AuthSchema, { email: string }, PagingPayload<never>, never>(
        'email',
        {
          email: data.email,
        },
        {
          token,
        },
        userId
      ),
    {
      onSuccess: ({ user: data }) => {
        store.setUser({
          id: data.id,
          username: data.username,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          avatarUrl: data.avatar.image_url,
          avatarHeight: data.avatar.height,
          avatarWidth: data.avatar.width,
          balance: data.finance.balance,
        })
      },
    }
  )
}
