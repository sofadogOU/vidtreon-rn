import { Channel, Video } from '@/hooks'
import { ImagePickerResponse } from 'react-native-image-picker'
import * as k from './constants'

export type GridLayout = '2-col' | '4-col' | '1-col'
export type GridHeight = 'sm' | 'md' | 'lg' | 'xl'

export const calcSize = (layout: GridLayout, height?: GridHeight) => {
  const viewableArea = k.screen.w - k.sizes.defPadding * 2
  const fourCol = viewableArea / 3.1
  const twoCol = viewableArea / 2.065
  const oneCol = viewableArea / 1.0
  const size = { width: fourCol, height: fourCol * 1.2 }
  switch (layout) {
    case '1-col':
      size.width = oneCol
      size.height = oneCol * 0.5
      break
    case '2-col':
      size.width = twoCol
      size.height = twoCol * 0.7
      break
    case '4-col':
      size.width = fourCol
      size.height = fourCol * 1.2
      break
  }

  if (height) {
    switch (height) {
      case 'lg':
        size.height = size.height * 1.8
        break
    }
  }

  return size
}

export const filterPremiumVideos = (
  videos?: Video[],
  channels?: Channel[]
): Video[] | undefined => {
  if (videos) {
    return videos?.map(item => ({
      ...item,
      isPremium:
        item.channel.price !== 0 &&
        channels?.find(
          sub => sub.feedId === item.channel.id && sub.status !== 'cancelled'
        ) === undefined,
    }))
  }
  return undefined
}

export const bufferConfig = {
  // minBufferMs: 15000 / 15,
  // maxBufferMs: 50000 / 15,
  // bufferForPlaybackMs: 2500 / 15,
  // bufferForPlaybackAfterRebufferMs: 5000 / 15,
}

export const createFormData = (media: ImagePickerResponse) => {
  if (
    (media.type === 'image/jpg' ||
      media.type === 'image/jpeg' ||
      media.type === 'image/png') &&
    media.fileName &&
    media.uri
  ) {
    const data = new FormData()
    data.append('source_file', {
      // @ts-ignore
      uri: media.uri,
      name: media.fileName,
      type: media.type,
    })
    return data
  } else {
    const data = new FormData()
    data.append('source_file', {
      // @ts-ignore
      uri: media.uri,
      name: `video_file${k.isAndroid ? '.mp4' : '.mov'}`,
      type: k.isAndroid ? 'video/mp4' : 'video/quicktime',
    })
    return data
  }
}

export const calcProgressPerc = (progress: number, duration: number) => {
  return (progress / duration) * 100
}

export const millisToMinutesAndSeconds = (millis: number) => {
  if (!millis) {
    return '0:00'
  }
  const minutes = Math.floor(millis / 60000)
  const seconds = parseInt(((millis % 60000) / 1000).toFixed(0))
  //ES6 interpolated literals/template literals
  //If seconds is less than 10 put a zero in front.
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
