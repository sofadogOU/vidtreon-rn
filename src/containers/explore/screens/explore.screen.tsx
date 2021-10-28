import React, { useRef } from 'react'
import { Alert, RefreshControl } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'

import { useTranslation } from '@/providers'
import { SafeWrapper } from '@/components/wrappers.component'
import { ExploreStackNavigationProp } from '@/typings/navigators'
import { BottomSheetModal } from '@gorhom/bottom-sheet'

import {
  Video,
  useExploreVideos,
  useFeeds,
  useSubscriptions,
  useTags,
  useFilterPremium,
  ListType,
  useShareProvider,
  useDeeplinkProvider,
  useNotificationProvider,
  Deeplink,
} from '@/hooks'

import {
  VideoCarousel,
  TagCarousel,
  SectionTitle,
  FeaturedCarousel,
  ChannelCarousel,
  ToastModal,
  ToastModalItem,
  Icon,
} from '@/components'

interface Props {
  navigation: ExploreStackNavigationProp<'Explore'>
}

export const ExploreScreen = ({ navigation }: Props) => {
  const i18n = useTranslation()
  const share = useShareProvider()
  const deeplink = useDeeplinkProvider()
  const notifications = useNotificationProvider()

  const optionsModalRef = useRef<BottomSheetModal>(null)
  const selectedItemRef = useRef<Video>()
  const [isRefreshing, setRefreshing] = React.useState(false)

  const filterPremium = useFilterPremium()

  const { data: tagsData } = useTags()
  const { data: subscriptionData } = useSubscriptions()
  const {
    data: suggestedFeedsData,
    isLoading: suggestedLoading,
    refetch: refetchSuggested,
  } = useFeeds({
    type: 'suggested',
    page: 1,
    limit: 10,
  })
  const {
    data: newFeedsData,
    isLoading: newFeedsLoading,
    refetch: refetchNewFeeds,
  } = useFeeds({ type: 'new', page: 1, limit: 20 })
  const {
    data: popularVideosData,
    isLoading: popularLoading,
    refetch: refetchPopular,
  } = useExploreVideos({
    type: 'most_liked',
    page: 1,
    limit: 20,
  })
  const {
    data: mostCommentedVideosData,
    isLoading: mostCommentedLoading,
    refetch: refetchMostCommented,
  } = useExploreVideos({
    type: 'most_commented',
    page: 1,
    limit: 20,
  })

  React.useEffect(() => {
    deeplink.bootstrap()
  }, [deeplink])

  React.useEffect(() => {
    if (isRefreshing) {
      setRefreshing(
        suggestedLoading ||
          newFeedsLoading ||
          popularLoading ||
          mostCommentedLoading
      )
    }
  }, [
    isRefreshing,
    suggestedLoading,
    newFeedsLoading,
    popularLoading,
    mostCommentedLoading,
  ])

  const handlePresentChannel = React.useCallback(
    (id: string) => {
      Alert.alert(id)
      navigation.dangerouslyGetParent()?.navigate('Channel', {
        screen: 'ChannelDetail',
        params: { id },
      })
    },
    [navigation]
  )

  const handlePresentVideoPlayer = React.useCallback(
    (id: string) => {
      navigation.dangerouslyGetParent()?.navigate('MediaPlayer', {
        id,
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
    navigation.navigate('ExploreGallery', { id, title, type })
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

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true)
    refetchSuggested()
    refetchNewFeeds()
    refetchPopular()
    refetchMostCommented()
  }, [refetchSuggested, refetchNewFeeds, refetchPopular, refetchMostCommented])

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
      <SafeWrapper refreshControl={refreshControl}>
        <Container>
          <Section>
            <HeaderWrapper>
              <TagWrapper>
                <TagCarousel
                  items={tagsData}
                  onSelect={id =>
                    navigation.navigate('ExploreSearch', {
                      tagId: id as string,
                      tagsData: tagsData,
                    })
                  }
                />
              </TagWrapper>
              <SearchButton
                onPress={() =>
                  navigation.navigate('ExploreSearch', {
                    tagsData: tagsData,
                  })
                }
              >
                <SearchContainer>
                  <Icon name="search" size="xs" />
                </SearchContainer>
              </SearchButton>
            </HeaderWrapper>
          </Section>
          <Section>
            <SectionTitle
              icon="suggested"
              onAccessoryPress={() =>
                handleShowAll(
                  'suggested',
                  i18n.t('explore_section1'),
                  'channel'
                )
              }
            >
              {i18n.t('explore_section1')}
            </SectionTitle>
            <FeaturedCarousel
              items={suggestedFeedsData}
              onItemPress={handlePresentChannel}
            />
          </Section>
          <Section style={{ marginBottom: 24 }}>
            <SectionTitle
              icon="new"
              containerStyle={{ marginBottom: 8 }}
              onAccessoryPress={() =>
                handleShowAll('new', i18n.t('explore_section2'), 'channel')
              }
            >
              {i18n.t('explore_section2')}
            </SectionTitle>
            <ChannelCarousel
              items={newFeedsData}
              onItemPress={handlePresentChannel}
              hasTitle
            />
          </Section>
          <Section>
            <SectionTitle
              icon="comment"
              onAccessoryPress={() =>
                handleShowAll(
                  'most_commented',
                  i18n.t('explore_section3'),
                  'exploreVideos'
                )
              }
            >
              {i18n.t('explore_section3')}
            </SectionTitle>
            <VideoCarousel
              items={filterPremium(mostCommentedVideosData, subscriptionData)}
              onItemPress={handlePresentVideoPlayer}
              layout="2-col"
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
                  i18n.t('explore_section4'),
                  'exploreVideos'
                )
              }
            >
              {i18n.t('explore_section4')}
            </SectionTitle>
            <VideoCarousel
              items={filterPremium(popularVideosData, subscriptionData)}
              onItemPress={handlePresentVideoPlayer}
              layout="4-col"
              onDetailPress={handleDetailPress}
              onChannelPress={handlePresentChannel}
            />
          </Section>
        </Container>
      </SafeWrapper>
      <ToastModal ref={optionsModalRef} items={videoModalItems} />
    </>
  )
}

const Container = styled.View`
  ${tw(`flex-1`)}
`
const Section = styled.View`
  ${tw(`mb-4`)};
  min-height: 44px;
`
const HeaderWrapper = styled.View`
  ${tw(`h-11 flex-1 flex-row items-center justify-center mt-2`)}
`
const TagWrapper = styled.View`
  ${tw(`flex-1 h-8`)}
`
const SearchButton = styled.TouchableOpacity`
  ${tw(`h-11 w-11 items-center justify-center mr-4`)}
`
const SearchContainer = styled.View`
  ${tw(`h-8 w-8 rounded-full items-center justify-center`)};
  background-color: ${({ theme }) => theme.secondary.tint};
`
// const SidebarBtn = styled.TouchableOpacity`
//   ${tw(`w-10 h-10 ml-2 justify-center rounded-full items-center`)};
//   background-color: ${({ theme }) => theme.primary.tint};
// `
// const SidebarIcon = styled.Image`
//   ${tw(`w-5 h-5`)}
// `
