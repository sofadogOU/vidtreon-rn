import React, { useState, useEffect } from 'react'
import {
  HomeStackNavigationProp,
  HomeStackRouteProp,
} from '@/typings/navigators'

import { ChannelList, VideoList, TitleBar, EmptyStateView } from '@/components'

import {
  useSubscriptions,
  useFeeds,
  useCategories,
  useFilterPremium,
  VideoTypes,
  useVideos,
  useWatchlist,
  Channel,
  FeedTypes,
  useSubscribedVideos,
  useExploreVideos,
} from '@/hooks'
import { useTranslation } from '@/providers'

interface Props {
  navigation: HomeStackNavigationProp<'HomeGallery'>
  route: HomeStackRouteProp<'HomeGallery'>
}


const UsersChannelListWrapper = ({
  onItemPress,
}: {
  onItemPress: (id: string) => void
}) => {
  const [data, setData] = useState<Channel[]>()
 
  const { data: subscriptionData } = useSubscriptions({
    page: 1,
    limit: 50,
  })
  const { data: categoryData } = useCategories()
  
  useEffect(() => {
    if (subscriptionData && categoryData) {
      const formattedData = subscriptionData.map(item => {
        const categories = item.categories?.map(id => id)
        const categoryNames = categories?.map(
          id => categoryData.find(item => item.id === id)?.title || ''
        )
        return {
          ...item,
          categories: categoryNames,
        }
      })

      setData(formattedData)
    }
  }, [subscriptionData, categoryData])

  return <ChannelList items={data} onItemPress={onItemPress} />
}

const ChannelListWrapper = ({
  onItemPress,
  type,
}: {
  onItemPress: (id: string) => void
  type: FeedTypes
}) => {
  const [data, setData] = useState<Channel[]>()
  const { data: channelData } = useFeeds({
    page: 1,
    limit: 200,
    type,
  })

  const { data: categoryData } = useCategories()

  useEffect(() => {
    if (channelData && categoryData) {
      const formattedData = channelData.map(item => {
        const categories = item.categories?.map(id => id)
        const categoryNames = categories?.map(
          id => categoryData.find(item => item.id === id)?.title || ''
        )
        return {
          ...item,
          categories: categoryNames,
        }
      })

      setData(formattedData)
    }
  }, [channelData, categoryData])

  return <ChannelList items={data} onItemPress={onItemPress} />
}

const VideoListWrapper = ({
  onItemPress,
  onChannelPress,
  type,
}: {
  onItemPress: (id: string) => void
  onChannelPress: (id: string) => void
  type: VideoTypes
}) => {
  const filterPremium = useFilterPremium()
  const { data: subscriptionData } = useSubscriptions({
    page: 1,
    limit: 50,
  })

  const { data: videosData } = useVideos({
    page: 1,
    limit: 50,
    type,
  })

  return (
    <VideoList
      items={filterPremium(videosData, subscriptionData)}
      onChannelPress={onChannelPress}
      onItemPress={onItemPress}
    />
  )
}

const SubscribedVideoListWrapper = ({
  onItemPress,
  onChannelPress,
  type,
}: {
  onItemPress: (id: string) => void
  onChannelPress: (id: string) => void
  type: VideoTypes
}) => {
  const { data: videosData } = useSubscribedVideos({
    page: 1,
    limit: 50,
    type,
  })

  return (
    <VideoList
      items={videosData}
      onChannelPress={onChannelPress}
      onItemPress={onItemPress}
    />
  )
}

const ExploreVideoListWrapper = ({
  onItemPress,
  onChannelPress,
  type,
}: {
  onItemPress: (id: string) => void
  onChannelPress: (id: string) => void
  type: VideoTypes
}) => {
  const filterPremium = useFilterPremium()
  const { data: subscriptionData } = useSubscriptions({
    page: 1,
    limit: 50,
  })

  const { data: videosData } = useExploreVideos({
    page: 1,
    limit: 50,
    type,
  })

  return (
    <VideoList
      items={filterPremium(videosData, subscriptionData)}
      onChannelPress={onChannelPress}
      onItemPress={onItemPress}
    />
  )
}

const WatchingListWrapper = ({
  onItemPress,
}: {
  onItemPress: (id: string) => void
}) => {
  const i18n = useTranslation()
  const { data: watchlistData } = useWatchlist({
    page: 1,
    limit: 100,
  })
  return watchlistData && watchlistData.length > 0 ? (
    <VideoList items={watchlistData} onItemPress={onItemPress} />
  ) : (
    <EmptyStateView
      title={i18n.t('channel_empty')}
      description={i18n.t('channel_empty_description')}
    />
  )
}

export const GalleryScreen = ({ navigation, route }: Props) => {
  // const mediaViewer = useMediaViewer()
  const { id, title, type } = route.params
  
  const handleBackPress = () => {
    navigation.goBack()
  }

  const handleChannelPress = (id: string) => {
    navigation.dangerouslyGetParent()?.navigate('Channel', {
      screen: 'ChannelDetail',
      params: { id },
    })
  }

  const handleVideoPress = (id: string) => {
    navigation.dangerouslyGetParent()?.navigate('MediaPlayer', {
      id,
    })
  }

  return (
    <>
      <TitleBar title={title} onBackPress={handleBackPress} />
      {type === 'channel' && (
        <ChannelListWrapper type={id} onItemPress={handleChannelPress} />
      )}
      {type === 'userChannels' && (
        <UsersChannelListWrapper onItemPress={handleChannelPress} />
      )}
      {type === 'video' && (
        <VideoListWrapper
          type={id}
          onItemPress={handleVideoPress}
          onChannelPress={handleChannelPress}
        />
      )}
      {type === 'subscribedVideos' && (
        <SubscribedVideoListWrapper
          type={id}
          onItemPress={handleVideoPress}
          onChannelPress={handleChannelPress}
        />
      )}
      {type === 'exploreVideos' && (
        <ExploreVideoListWrapper
          type={id}
          onItemPress={handleVideoPress}
          onChannelPress={handleChannelPress}
        />
      )}
      {type === 'watching' && (
        <WatchingListWrapper onItemPress={handleVideoPress} />
      )}
    </>
  )
}
