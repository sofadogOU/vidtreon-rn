import * as React from 'react'
import { RefreshControl } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import { HomeStackNavigationProp } from '@/typings/navigators'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import faker from 'faker'

import * as k from '@/utils/constants'

import { useTranslation } from '@/providers'

import {
  useStore,
  useBalance,
  useSubscriptions,
  useSubscribedVideos,
  Video,
  ListType,
  // Channel,
  useShareProvider,
  // useNotifications,
  // Notification,
  useDeeplinkProvider,
  useNotificationProvider,
  Deeplink,
} from '@/hooks'

import {
  ChannelCarousel,
  VideoCarousel,
  SectionTitle,
  UserInfo,
  EmptyStateView,
  SafeWrapper,
  ToastModal,
  ToastModalItem,
} from '@/components'

interface Props {
  navigation: HomeStackNavigationProp<'Dashboard'>
}

export const HomeScreen = ({ navigation }: Props) => {
  const userModalRef = React.useRef<BottomSheetModal>(null)
  const optionsModalRef = React.useRef<BottomSheetModal>(null)
  const selectedItemRef = React.useRef<Video>()
  const [isRefreshing, setRefreshing] = React.useState(false)

  const i18n = useTranslation()
  const share = useShareProvider()
  const store = useStore()

  const getUserState = React.useCallback(
    state => ({
      user: state.user,
    }),
    []
  )

  const { user } = useStore(getUserState)
  const { data: balance } = useBalance()
  const { data: subscriptions } = useSubscriptions()
  const {
    data: latestVideos,
    isLoading: latestLoading,
    refetch: refetchLatest,
  } = useSubscribedVideos({ type: 'latest_videos' })
  const {
    data: popularVideos,
    isLoading: popularLoading,
    refetch: refetchPopular,
  } = useSubscribedVideos({ type: 'most_liked' })
  const {
    data: mostViewedVideos,
    isLoading: mostViewedLoading,
    refetch: refetchMostViewed,
  } = useSubscribedVideos({ type: 'most_viewed' })

  // const { data: notificationData } = useNotifications()
  const deeplink = useDeeplinkProvider()
  const notifications = useNotificationProvider()

  React.useEffect(() => {
    alert("Home - Screen ");
    deeplink.bootstrap()
  }, [deeplink])

  React.useEffect(() => {
    if (isRefreshing) {
      setRefreshing(latestLoading || popularLoading || mostViewedLoading)
    }
  }, [isRefreshing, latestLoading, popularLoading, mostViewedLoading])

  React.useEffect(() => {
    if (!store.token && !store.isVisitor) {
      navigation.dangerouslyGetParent()?.navigate('Onboarding')
    }
  }, [store, navigation])

  const handlePresentVideoPlayer = React.useCallback(
    (id: string) => {
      navigation.dangerouslyGetParent()?.navigate('MediaPlayer', {
        id,
      })
    },
    [navigation]
  )

  const handlePresentChannel = React.useCallback(
    (id: string) => {
      navigation.dangerouslyGetParent()?.navigate('Channel', {
        screen: 'ChannelDetail',
        params: { id },
      })
    },
    [navigation]
  )

  const handleDeeplink = React.useCallback(
    ({ id, domain }: Deeplink) => {
      if (domain === 'share_channel') {
        handlePresentChannel(id)
      } else if (domain === 'share_video') {
        handlePresentVideoPlayer(id)
      }
    },
    [handlePresentChannel, handlePresentVideoPlayer]
  )

  const handleNotificationDeeplink = React.useCallback(
    (videoId: string) => {
      handlePresentVideoPlayer(videoId)
      notifications.resetDeeplink()
    },
    [handlePresentVideoPlayer, notifications]
  )

  React.useEffect(() => {
    if (deeplink.info) {
      handleDeeplink(deeplink.info)
    }
  }, [deeplink.info, handleDeeplink])

  React.useEffect(() => {
    if (notifications.deeplinkInfo) {
      handleNotificationDeeplink(notifications.deeplinkInfo)
    }
  }, [notifications.deeplinkInfo, handleNotificationDeeplink])

  const handleShowAll = (id: string, title: string, type: ListType) => {
    navigation.navigate('HomeGallery', { id, title, type })
  }

  const handlePurchasePress = () => {
    navigation.dangerouslyGetParent()?.navigate('Shop')
  }

  const handleMenuPress = () => {
    userModalRef.current?.present()
  }

  const handleDetailPress = (item: Video) => {
    selectedItemRef.current = item
    optionsModalRef.current?.present()
  }

  const handleModalSharePress = () => {
    if (selectedItemRef.current) {
      const { id, title, description: message } = selectedItemRef.current
      share.create({ id, title, message, feature: 'share_video' })
      optionsModalRef.current?.dismiss()
    }
  }

  const handleModalChannelPress = () => {
    if (selectedItemRef.current) {
      handlePresentChannel(selectedItemRef.current?.channel.id)
      optionsModalRef.current?.dismiss()
    }
  }

  const handleModalWatchlistPress = () => {
    handleShowAll('watchlist', i18n.t('label_watchlist'), 'watching')
    userModalRef.current?.dismiss()
  }

  const handleSignUp = () => {
    navigation
      .dangerouslyGetParent()
      ?.navigate('Onboarding', { showAuth: true })
  }

  const handleExploreChannels = () => navigation.navigate('Explore')

  // const filterCancelled = React.useCallback((subscriptions: Channel[]) => {
  //   return subscriptions?.filter(item => item.status !== 'cancelled')
  // }, [])

  const videoModalItems: ToastModalItem[] = [
    {
      title: i18n.t('share_video'),
      iconName: 'share',
      onPress: handleModalSharePress,
    },
    {
      title: i18n.t('view_channel'),
      iconName: 'shareChannel',
      onPress: handleModalChannelPress,
    },
  ]

  const userModalItems: ToastModalItem[] = [
    {
      title: i18n.t('label_watchlist'),
      iconName: 'watchlist',
      onPress: handleModalWatchlistPress,
    },
  ]

  // const filterNotificationData = (data?: Notification[]) => {
  //   if (data && data.length > 0) {
  //     return data.filter(item => !item.read)
  //   }
  //   return []
  // }

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true)
    refetchLatest()
    refetchPopular()
    refetchMostViewed()
  }, [refetchLatest, refetchPopular, refetchMostViewed])

  const refreshControl = React.useMemo(
    () => (
      <RefreshControl
        refreshing={isRefreshing}
        enabled
        onRefresh={handleRefresh}
      />
    ),
    [isRefreshing, handleRefresh]
  )

  return (
    <>
      {user ? (
        subscriptions && subscriptions.length > 0 ? (
          <>
            <UserInfo
              info={user}
              balance={balance || 0}
              // showIndicator={
              //   filterNotificationData(notificationData).length > 0
              // }
              // onBellPress={() => navigation.navigate('Activity')}
              onUserPress={() => {
                // @ts-ignore
                navigation.navigate('Profile', {
                  screen: 'ProfileDetail',
                  params: {
                    info: {
                      id: faker.datatype.uuid(),
                      icon: 'account',
                      label: i18n.t('settings_section1_item1'),
                      description: i18n.t(
                        'settings_section1_item1_description'
                      ),
                      type: 'field',
                    },
                  },
                })
              }}
              onBalancePress={handlePurchasePress}
              onMenuPress={handleMenuPress}
            />
            <SafeWrapper refreshControl={refreshControl}>
              <Container>
                <Section style={{ marginBottom: 24 }}>
                  <SectionTitle
                    icon="tv"
                    showAccessory={subscriptions && subscriptions.length > 0}
                    containerStyle={{ marginBottom: 8 }}
                    onAccessoryPress={() =>
                      handleShowAll(
                        'CHANNELS',
                        i18n.t('dashboard_section1'),
                        'userChannels'
                      )
                    }
                  >
                    {i18n.t('dashboard_section1')}
                  </SectionTitle>
                  <ChannelCarousel
                    showAutoplay
                    items={subscriptions}
                    onItemPress={handlePresentChannel}
                    onEmptyPress={() => navigation.navigate('Explore')}
                    hasTitle
                  />
                </Section>
                <Section>
                  <SectionTitle
                    icon="latest"
                    onAccessoryPress={() =>
                      handleShowAll(
                        'latest_videos',
                        i18n.t('dashboard_section2'),
                        'subscribedVideos'
                      )
                    }
                  >
                    {i18n.t('dashboard_section2')}
                  </SectionTitle>
                  <VideoCarousel
                    items={latestVideos}
                    layout="2-col"
                    height="lg"
                    onItemPress={handlePresentVideoPlayer}
                    onDetailPress={handleDetailPress}
                    onChannelPress={handlePresentChannel}
                  />
                </Section>
                <Section>
                  <SectionTitle
                    icon="popular"
                    onAccessoryPress={() =>
                      handleShowAll(
                        'most_liked',
                        i18n.t('dashboard_section3'),
                        'subscribedVideos'
                      )
                    }
                  >
                    {i18n.t('dashboard_section3')}
                  </SectionTitle>
                  <VideoCarousel
                    items={popularVideos}
                    onItemPress={handlePresentVideoPlayer}
                    onDetailPress={handleDetailPress}
                    onChannelPress={handlePresentChannel}
                  />
                </Section>
                <Section>
                  <SectionTitle
                    icon="mostViewed"
                    onAccessoryPress={() =>
                      handleShowAll(
                        'most_viewed',
                        i18n.t('dashboard_section4'),
                        'subscribedVideos'
                      )
                    }
                  >
                    {i18n.t('dashboard_section4')}
                  </SectionTitle>
                  <VideoCarousel
                    items={mostViewedVideos}
                    onItemPress={handlePresentVideoPlayer}
                    onDetailPress={handleDetailPress}
                    onChannelPress={handlePresentChannel}
                  />
                </Section>
              </Container>
            </SafeWrapper>
          </>
        ) : (
          <>
            <UserInfo
              info={user}
              balance={balance || 0}
              // showIndicator={
              //   filterNotificationData(notificationData).length > 0
              // }
              // onBellPress={() => navigation.navigate('Activity')}
              onUserPress={() => {
                // @ts-ignore
                navigation.navigate('Profile', {
                  screen: 'ProfileDetail',
                  params: {
                    info: {
                      id: faker.datatype.uuid(),
                      icon: 'account',
                      label: i18n.t('settings_section1_item1'),
                      description: i18n.t(
                        'settings_section1_item1_description'
                      ),
                      type: 'field',
                    },
                  },
                })
              }}
              onBalancePress={handlePurchasePress}
              onMenuPress={handleMenuPress}
            />
            <EmptyStateView
              title={i18n.t('dashboard_new_title')}
              description={i18n.t('dashboard_new_message')}
              buttonTitle={i18n.t('dashboard_new_cta')}
              onButtonPress={handleExploreChannels}
            />
          </>
        )
      ) : (
        <EmptyStateView
          title={i18n.t('dashboard_unavailable')}
          description={i18n.t('dashboard_pitch')}
          buttonTitle={i18n.t('button_signup')}
          onButtonPress={handleSignUp}
        />
      )}
      <ToastModal ref={optionsModalRef} items={videoModalItems} />
      <ToastModal ref={userModalRef} items={userModalItems} />
    </>
  )
}

const Container = styled.View`
  ${tw(`flex-1`)};
  margin-top: ${k.isAndroid ? 0 : 16}px;
`
const Section = styled.View`
  ${tw(`mb-4`)};
`
