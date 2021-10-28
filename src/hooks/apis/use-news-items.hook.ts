import * as React from 'react'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import dayjs from 'dayjs'

import * as api from '@/services/networking.service'
import * as transform from './api.transformers'
import {
  PagingPayload,
  NewsItemsSchema,
  NewsItemSchema,
  NewsItem,
  NewsItemPayload,
} from './api.typings'
import { useStore } from '../use-store.hook'

type Params = {
  feedId?: string
  page?: number
  limit?: number
}

type UpdateItemParams = {
  feedId: string
  title: string
  description: string
  categoryId?: string
  tags?: string[]
}

type PatchItemParams = UpdateItemParams & { videoId: string }

export const useNewsItems = ({ feedId, page = 1, limit = 20 }: Params) => {
  const store = useStore()
  const token = store.token
  return useQuery<NewsItem[], unknown>(
    ['newsItems', { type: feedId }],
    api.get<NewsItemsSchema, PagingPayload<never>>('newsItems', undefined, {
      token: token,
      feed_id: feedId,
      page,
      limit,
    }),
    {
      enabled: !!feedId,
      notifyOnChangeProps: ['data', 'error'],
      select: React.useCallback(data => transform.newsItems(data), []),
    }
  )
}

export const useNewsItem = ({ videoId }: { videoId?: string }) => {
  const store = useStore()
  const token = store.token
  return useQuery<NewsItem[], unknown>(
    ['newsItem', { type: videoId }],
    api.get<NewsItemsSchema, PagingPayload<never>>('newsItems', videoId, {
      token: token,
    }),
    {
      enabled: !!videoId,
      notifyOnChangeProps: ['data', 'error'],
      select: React.useCallback(data => transform.newsItems(data), []),
      refetchInterval: 1000,
    }
  )
}

export const useAddNewsItem = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token

  return useMutation<{ news_item: NewsItemSchema }, never, UpdateItemParams>(
    data =>
      api.post<
        { news_item: NewsItemSchema },
        NewsItemPayload,
        PagingPayload<never>,
        never
      >(
        'newsItems',
        {
          category: data.categoryId!,
          category_id: data.categoryId!,
          content: data.description,
          due_date: dayjs().format('YYYY-MM-DD'),
          feed_id: data.feedId,
          news_credits: [],
          tags: data.tags!,
          title: data.title,
          visual_credits: [],
          descriptions: [
            {
              language: 'english',
              sentences: [],
            },
            {
              language: 'estonian',
              sentences: [],
            },
          ],
        },
        {
          token,
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['newsItems'])
      },
    }
  )
}

export const useRemoveNewsItem = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token

  return useMutation<{ news_item: NewsItemSchema }, never, Params>(
    data =>
      api.remove<NewsItemsSchema, PagingPayload<never>, never>(
        'newsItems',
        {
          token,
        },
        data.feedId
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['newsItems'])
      },
    }
  )
}

export const useUploadNewsItemVideo = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token

  return useMutation<
    { news_item: NewsItemSchema },
    never,
    { videoId: string; data: unknown }
  >(
    data =>
      api.post<
        { news_item: NewsItemSchema },
        unknown,
        PagingPayload<never>,
        unknown
      >('newsItemVideo', data.data, { token }, data.videoId, {
        'Content-Type': 'multipart/form-data',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['newsItems'])
      },
    }
  )
}

export const useUploadNewsItemThumbnail = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token

  return useMutation<
    { news_item: NewsItemSchema },
    never,
    { videoId: string; data: unknown }
  >(
    data =>
      api.post<
        { news_item: NewsItemSchema },
        unknown,
        PagingPayload<never>,
        unknown
      >('newsItemThumbnail', data.data, { token }, data.videoId, {
        'Content-Type': 'multipart/form-data',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['newsItems'])
      },
    }
  )
}

export const usePatchNewsItem = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token

  return useMutation<{ news_item: NewsItemSchema }, never, PatchItemParams>(
    data =>
      api.patch<
        { news_item: NewsItemSchema },
        NewsItemPayload,
        PagingPayload<never>,
        never
      >(
        'newsItems',
        {
          category: data.categoryId!,
          category_id: data.categoryId!,
          content: data.description,
          due_date: dayjs().format('YYYY-MM-DD'),
          feed_id: data.feedId,
          news_credits: [],
          tags: data.tags!,
          title: data.title,
          visual_credits: [],
          descriptions: [
            {
              language: 'english',
              sentences: [],
            },
            {
              language: 'estonian',
              sentences: [],
            },
          ],
        },
        {
          token,
        },
        data.videoId
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['newsItems'])
      },
    }
  )
}

export const usePublishNewsItem = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token

  return useMutation<{ news_item: NewsItemSchema }, never, { videoId: string }>(
    data =>
      api.post<
        { news_item: NewsItemSchema },
        unknown,
        PagingPayload<never>,
        unknown
      >('newsItemPublish', {}, { token }, data.videoId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['newsItems'])
      },
    }
  )
}

export const useUnpublishNewsItem = () => {
  const queryClient = useQueryClient()
  const store = useStore()
  const token = store.token

  return useMutation<{ news_item: NewsItemSchema }, never, { videoId: string }>(
    data =>
      api.post<
        { news_item: NewsItemSchema },
        unknown,
        PagingPayload<never>,
        unknown
      >('newsItemUnpublish', {}, { token }, data.videoId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['newsItems'])
      },
    }
  )
}
