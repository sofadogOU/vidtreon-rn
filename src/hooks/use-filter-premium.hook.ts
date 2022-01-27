import * as React from 'react'

import { Channel, Video } from './apis'
import { filterPremiumVideos } from '@/utils/video-helpers.util'

export const useFilterPremium = () =>
  React.useCallback((videos?: Video[], subscriptions?: Channel[]) => {
  //  console.log(videos,"videos useFilterPremium");
    if (videos && subscriptions) {
      return filterPremiumVideos(videos, subscriptions)
    } else {
      return videos?.map(item => ({
        ...item,
        isPremium: !item.channel.subscribed && item.channel.price !== 0,
      }))
    }
  }, [])
