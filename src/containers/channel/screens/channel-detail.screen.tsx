import * as React from 'react'
import { Alert } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import Autolink from 'react-native-autolink'
import BottomSheet from '@gorhom/bottom-sheet'
import Spinner from 'react-native-spinkit'
import kebabCase from 'lodash/kebabCase'
import faker from 'faker'
import Toast from 'react-native-toast-message'

import {
  ChannelStackNavigationProp,
  ChannelStackRouteProp,
} from '@/typings/navigators'

import * as k from '@/utils/constants'

import { useTranslation } from '@/providers'
import {
  useFeed,
  useSubscriptions,
  useSubscribe,
  useBalance,
  useVideos,
  useStore,
  Video,
  Channel,
  useFilterPremium,
  useShareProvider,
} from '@/hooks'

import {
  ParallaxScrollView,
  VideoCarousel,
  TextPlaceholder,
  SectionTitle,
  ToastModal,
  ToastModalItem,
  AnimatedPlaceholder,
  VideoGalleryList,
  EmptyStateView,
  toastConfig,
  UserInfo
} from '@/components'

interface Props {
  navigation: ChannelStackNavigationProp<'ChannelDetail'>
  route: ChannelStackRouteProp<'ChannelDetail'>
}

export const ChannelDetailScreen = ({ navigation, route }: Props) => {
  const theme = useTheme()
  const i18n = useTranslation()
  const share = useShareProvider()
  const filterPremium = useFilterPremium()

  const [channelId, setchannelId] = React.useState("")
  const [bgcolor, setbgcolor] = React.useState("")

  

  const getUserState = React.useCallback(
    state => ({
      user: state.user,
    }),
    []
  )


  React.useEffect(() => {
   getchannelIdFromApi()
  })

  const getchannelIdFromApi = () => {
    fetch('http://settings.vidtreon.com/')
   .then((response) => response.json())
   .then((rsn) => {
     setchannelId(String(rsn.channel_id))
     setbgcolor(String(rsn.button_color))
   })
   .catch((error) => {
     console.error(error);
   });
};

  
  const { data: balance } = useBalance()
  const { user } = useStore(getUserState)
  const channelModalRef = React.useRef<BottomSheet>(null)
  const videoModalRef = React.useRef<BottomSheet>(null)
  const selectedItemRef = React.useRef<Video>()

  const [isBusy, setBusy] = React.useState(false)

  const subscribe = useSubscribe()
  const { data: feedData, refetch: refetchFeed } = useFeed({
    feedId: route?.params?.id ? route?.params?.id  : channelId,
  })
  const { data: subscriptions } = useSubscriptions()
  const { data: allVideoData } = useVideos({
    feedId:route?.params?.id ? route?.params?.id  : channelId,
    limit: 1000,
  })
  const { data: latestVideoData } = useVideos({
    type: 'latest',
    feedId: route?.params?.id ? route?.params?.id  : channelId,
  })

  const linkStyle = React.useMemo(
    () => ({ color: theme.primary.tint }),
    [theme]
  )

  const isSubscriber = React.useCallback(
    (feed: Channel, subscriptions?: Channel[]) => {
      if (!!feed.subscribed) {
        const isCancelled =
          subscriptions?.find(
            item => item.feedId === feed.id && item.status === 'cancelled'
          ) !== undefined
        return true && !isCancelled
      }
      if (!feed || !subscriptions || subscriptions.length === 0) {
        return false
      }
      const isSubscribed =
        subscriptions.find(
          item => item.feedId === feed.id && item.status !== 'cancelled'
        ) !== undefined
      return isSubscribed
    },
    []
  )

  const handleBackPress = () => {
    navigation.goBack()
  }

  const handleConfirmation = async () => {
    try {
      if (feedData) {
        setBusy(true)
        const res = await subscribe.mutateAsync({ feedId: feedData?.feedId })
        if (res && subscriptions) {
          refetchFeed()
          const hideSpinner = isSubscriber(feedData, subscriptions)
          setTimeout(() => setBusy(hideSpinner), 5000)
        }
      }
    } catch (e) {
      setBusy(false)
    }
  }

  const handlePurchasePress = () => {
    if (user && feedData && typeof balance === 'number') {
      if (typeof feedData.price === 'number' && balance >= feedData.price) {
        Alert.alert(
          i18n.t('button_subscribe'),
          `${i18n.t('label_subscribe_for')} ${feedData.price} ${
            feedData.price === 1 ? 'coin' : 'coins'
          } per month?`,
          [
            { text: i18n.t('button_cancel') },
            { text: i18n.t('button_confirm'), onPress: handleConfirmation },
          ]
        )
      } else {
        navigation.dangerouslyGetParent()?.navigate('Shop')
      }
    } else {
      navigation
        .dangerouslyGetParent()
        ?.navigate('Onboarding', { showAuth: true })
    }
  }

  const handleChannelDetailPress = () => {
    channelModalRef.current?.expand()
  }

  const onBalancePress = () => {
    navigation.dangerouslyGetParent()?.navigate('Shop')
  }
  
  const handleVideoPress = (id: string) => {
    navigation.dangerouslyGetParent()?.navigate('MediaPlayer', {
      id,
    // navigation.navigate('MediaPlayer', {
    //   id,
    })
  }

  const handlePremiumPress = () => {
    Toast?.show({
      type: 'warn',
      visibilityTime: 2000,
      autoHide: true,
      position: 'top',
      text1: 'Please Subscribe',
      text2: `This channel's videos are only available to subscribers and supporters`,
    })
  }

  const handleVideoDetailPress = (item: Video) => {
    selectedItemRef.current = item
    videoModalRef.current?.expand()
  }

  const handleModalShareChannelPress = () => {
    if (feedData) {
      share.create({
        id: feedData.id,
        title: feedData.name,
        message: feedData.description,
        feature: 'share_channel',
        channelName: kebabCase(feedData.name),
      })
    }
    channelModalRef.current?.collapse()
  }

  const handleModalShareVideoPress = () => {
    if (selectedItemRef.current) {
      const { id, title, description: message } = selectedItemRef.current
      share.create({ id, title, message, feature: 'share_video' })
      videoModalRef.current?.collapse()
    }
  }

  const handlePurchasPress = () => {
    navigation.navigate('Shop')
  }

  const channelModalItems: ToastModalItem[] = [
    {
      title: i18n.t('share_channel'),
      iconName: 'share',
      onPress: handleModalShareChannelPress,
    },
  ]

  const videoModalItems: ToastModalItem[] = [
    {
      title: i18n.t('share_video'),
      iconName: 'share',
      onPress: handleModalShareVideoPress,
    },
  ]

  return (
    <>
      {feedData && latestVideoData && allVideoData && user && (
        <ParallaxScrollView
          coverUrl={feedData.coverUrl}
          title={feedData.name}
          avatarUrl={feedData.avatarUrl}
          price={feedData.price}
          followerCount={`${feedData.followerCount}`}
          onBalancePress={handlePurchasPress}
          onBackPress={()=>{}}
          backBtnColor = {bgcolor}
          onDetailPress={handleChannelDetailPress}
          onPurchasePress={handlePurchasePress}
          subscribed={isSubscriber(feedData, subscriptions)}
          showButtonSpinner={isBusy}
        >
          <Container>
            <Section>
              <SectionTitle icon="about">
                {i18n.t('channel_section1')}
              </SectionTitle>
              {!feedData.description && (
                <PlaceholderWrapper>
                  <TextPlaceholder />
                </PlaceholderWrapper>
              )}
              {feedData.description && feedData.description !== '' ? (
                <BodyText>
                  <Autolink
                    text={feedData.description.trim()}
                    linkStyle={linkStyle}
                  />
                </BodyText>
              ) : null}
            </Section>
            {latestVideoData.length > 0 && (
              <Section style={{ marginTop: k.sizes.defPadding }}>
                <SectionTitle icon="latest">
                  {i18n.t('channel_section2')}
                </SectionTitle>
                <VideoCarousel
                  items={
                    latestVideoData?.length > 0
                      ? filterPremium([latestVideoData?.[0]], subscriptions)
                      : undefined
                  }
                  onItemPress={handleVideoPress}
                  onDetailPress={handleVideoDetailPress}
                  onChannelPress={handlePremiumPress}
                  hideAvatars
                  layout="1-col"
                  fullWidth
                  isFeature
                />
              </Section>
            )}
            {latestVideoData.length > 1 && (
              <Section>
                <SectionTitle icon="popular">
                  {i18n.t('channel_section3')}
                </SectionTitle>
                <VideoCarousel
                  items={
                    latestVideoData?.length > 1
                      ? filterPremium(
                          latestVideoData.slice(1, latestVideoData?.length),
                          subscriptions
                        )
                      : undefined
                  }
                  onItemPress={handleVideoPress}
                  onChannelPress={handlePremiumPress}
                  onDetailPress={handleVideoDetailPress}
                  hideAvatars
                />
              </Section>
            )}
            {allVideoData.length > 1 && (
              <Section style={{ marginBottom: 0 }}>
                <SectionTitle icon="video">
                  {i18n.t('channel_section4')}
                </SectionTitle>
                <VideoGalleryList
                  hideAvatars
                  onItemPress={handleVideoPress}
                  onDetailPress={handleVideoDetailPress}
                  onChannelPress={handlePremiumPress}
                  items={
                    allVideoData?.length > 1
                      ? filterPremium(allVideoData, subscriptions)
                      : undefined
                  }
                />
              </Section>
            )}
            {!allVideoData ||
              (allVideoData?.length === 0 && (
                <EmptyStateView title={i18n.t('channel_empty')} />
              ))}
          </Container>
        </ParallaxScrollView>
      )}
      <AnimatedPlaceholder
        hide={!!feedData && !!latestVideoData && !!allVideoData}
      />
      {k.isAndroid &&
        (!feedData || !subscriptions || !latestVideoData || !allVideoData) && (
          <SpinnerWrapper>
            <Spinner type="Pulse" size={100} color={theme.background} />
          </SpinnerWrapper>
        )}
      <ToastModal
        type="modal"
        ref={channelModalRef}
        items={channelModalItems}
      />
      <ToastModal type="modal" ref={videoModalRef} items={videoModalItems} />
      <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
    </>
  )
}

const Container = styled.View`
  ${tw(`flex-1 flex-col`)}
`
const Section = styled.View`
  ${tw(`mb-4`)}
`
const BodyText = styled.Text`
  ${tw(`text-sm mx-4 mt-2`)};
  color: ${({ theme }) => theme.text.body};
`
const PlaceholderWrapper = styled.View`
  ${tw(`p-4 pb-0 flex-1`)};
  min-height: 80px;
`
const SpinnerWrapper = styled.View`
  ${tw(`absolute inset-0 justify-center items-center`)}
`
