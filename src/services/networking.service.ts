import axios, { AxiosPromise } from 'axios'
import * as k from '@/utils/constants'
import * as Sentry from '@sentry/react-native'

const api = axios.create({
  baseURL: k.baseUrl,
  timeout: 20000,
})

const nonDsaApi = axios.create({
  baseURL: k.nonDsaBaseUrl,
  timeout: 20000,
})

const endPoints = (pathParam?: string) =>
  Object.freeze({
    categories: 'categories',
    socialLogin: 'users/social_login',
    balance: `users/${pathParam}/finance/balance`,
    subscriptions: 'subscriptions',
    videos: pathParam ? `videos/${pathParam}` : 'videos',
    feeds: pathParam ? `feeds/${pathParam}` : 'feeds',
    like: `engagements/likes`,
    comments: `engagements/comments`,
    uploads: `uploads`,
    watchlist: `watched_history`,
    tags: 'tags',
    user: `users/${pathParam}`,
    username: `users/${pathParam}/username`,
    email: `users/${pathParam}/email`,
    register: `users/register`,
    login: `users/login`,
    notifications: `notifications`,
    readNotification: `notifications/${pathParam}/read`,
    activities: `activities`,
    report: `reports`,
    newsItems: `news_items${pathParam ? '/' + pathParam : ''}`,
    newsItemVideo: `news_items/${pathParam}/upload_video`,
    newsItemThumbnail: `news_items/${pathParam}/upload_thumbnail`,
    newsItemPublish: `news_items/${pathParam}/push_to_feed`,
    newsItemUnpublish: `news_items/${pathParam}/remove_from_feed`,
    searchChannels: `search/channels`,
  })

/** Convert keys of endPoints object
 * into an enum type to use for strict typing of path arg
 * for http request methods */
const typeObjKeys = <T>(obj: T) => Object.keys(obj) as Array<keyof typeof obj>
type endPointsObj = ReturnType<typeof endPoints>
const keys = typeObjKeys<endPointsObj>(endPoints())
type EndPoint = typeof keys[number]

export const get = <Schema, Query>(
  path: EndPoint,
  pathParam?: string,
  query?: Query
) => {
  return async () => {
    try {
      const { data } = await api.get<unknown, AxiosPromise<Schema>>(
        endPoints(pathParam)[path],
        { params: query }
      )
      return data
    } catch (e) {
      Sentry.captureException(e)
      throw new Error(e)
      return e.message
    }
  }
}

export const post = async <Schema, Payload, Params, Headers>(
  path: EndPoint,
  payload: Payload,
  params?: Params,
  pathParam?: string,
  headers?: Headers
) => {
  try {
    const { data } = await api.post<unknown, AxiosPromise<Schema>>(
      endPoints(pathParam)[path],
      payload,
      { params, headers }
    )
    return data
  } catch (e) {
    Sentry.captureException(e)
    throw new Error(e)
    return e.message
  }
}

export const put = async <Schema, Payload, Params, Headers>(
  path: EndPoint,
  payload: Payload,
  params?: Params,
  pathParam?: string,
  headers?: Headers
) => {
  try {
    const { data } = await api.put<unknown, AxiosPromise<Schema>>(
      endPoints(pathParam)[path],
      payload,
      { params, headers }
    )
    return data
  } catch (e) {
    Sentry.captureException(e)
    throw new Error(e)
    return e.message
  }
}

export const patch = async <Schema, Payload, Params, Headers>(
  path: EndPoint,
  payload: Payload,
  params?: Params,
  pathParam?: string,
  headers?: Headers
) => {
  try {
    const { data } = await api.patch<unknown, AxiosPromise<Schema>>(
      endPoints(pathParam)[path],
      payload,
      { params, headers }
    )
    return data
  } catch (e) {
    Sentry.captureException(e)
    throw new Error(e)
    return e.message
  }
}

export const remove = async <Schema, Params, Headers>(
  path: EndPoint,
  params?: Params,
  pathParam?: string,
  headers?: Headers
) => {
  try {
    const { data } = await api.delete<unknown, AxiosPromise<Schema>>(
      endPoints(pathParam)[path],
      { params, headers }
    )
    return data
  } catch (e) {
    Sentry.captureException(e)
    throw new Error(e)
    return e.message
  }
}

export const getNonDsa = <Schema, Query>(
  path: EndPoint,
  pathParam?: string,
  query?: Query
) => {
  return async () => {
    try {
      const { data } = await nonDsaApi.get<unknown, AxiosPromise<Schema>>(
        endPoints(pathParam)[path],
        { params: query }
      )
      return data
    } catch (e) {
      Sentry.captureException(e)
      throw new Error(e)
      return e.message
    }
  }
}
