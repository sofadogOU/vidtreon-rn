import React from 'react'
import { SectionList, Alert } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import * as Sentry from '@sentry/react-native'
import Spinner from 'react-native-spinkit'

import {
  TitleBar,
  LoadingOverlay,
  RemoteImage,
  Icon,
  EmptyStateView,
} from '@/components'
import { CreatorStackNavigationProp } from '@/typings/navigators'

import {
  NewsItem,
  NewsItemStatus,
  useFeeds,
  useNewsItems,
  useStore,
  useRemoveNewsItem,
} from '@/hooks'
import { SectionListRenderItem } from 'react-native'
import { millisToMinutesAndSeconds } from '@/utils/video-helpers.util'

dayjs.extend(relativeTime)

type FeedVideos = {
  id: string
  title: string
  data: NewsItem[]
}

const mapStatus = (status: NewsItemStatus) => {
  switch (status) {
    case 'ready_for_push':
      return 'Unlisted'
    case 'pushed_to_feed':
      return 'Public'
    case 'transcoding':
      return 'Transcoding'
    default:
      return status
  }
}

interface VideoItemProps {
  item: NewsItem
  onRemove: (id: string) => void
  onEdit: (item: NewsItem) => void
}

const VideoItem = ({ item, onRemove, onEdit }: VideoItemProps) => {
  const theme = useTheme()
  const [isLoading, setLoading] = React.useState(false)
  const handleRemoveConfirm = () => {
    setLoading(true)
    onRemove(item.id)
  }
  const handleRemove = () => {
    Alert.alert('Are you sure?', 'This action cannot be undone', [
      { text: 'Cancel' },
      { text: 'Yes', onPress: handleRemoveConfirm },
    ])
  }
  const handleEdit = () => {
    onEdit(item)
  }
  return (
    <RowItem>
      <RowImage>
        <RemoteImage source={item.thumbnail} />
        <RowDuration>
          <RowDurationLabel>
            {millisToMinutesAndSeconds(item.duration)}
          </RowDurationLabel>
        </RowDuration>
      </RowImage>
      <RowTextContainer>
        <RowText numberOfLines={1}>{item.title || `Untitled`}</RowText>
        <RowText numberOfLines={1} small muted capitalized>
          {mapStatus(item.status)}
        </RowText>
      </RowTextContainer>
      <RowTextContainer>
        <RowText numberOfLines={1} small muted>
          Last updated
        </RowText>
        <RowText numberOfLines={1} small>
          {dayjs(item.lastUpdated).fromNow()}
        </RowText>
      </RowTextContainer>
      <Controls>
        <Control onPress={handleEdit}>
          <Icon name="edit" size="xs" color={theme.text.muted} />
        </Control>
        <Control onPress={handleRemove} disabled={isLoading}>
          {!isLoading && (
            <Icon name="remove" size="xs" color={theme.text.muted} />
          )}
          {isLoading && (
            <SpinnerWrapper>
              <Spinner type="ThreeBounce" size={24} color={theme.text.muted} />
            </SpinnerWrapper>
          )}
        </Control>
      </Controls>
    </RowItem>
  )
}

interface Props {
  navigation: CreatorStackNavigationProp<'Creator'>
}

export const CreatorVideosScreen = (props: Props) => {
  const [feedId, setFeedId] = React.useState<string>()
  const [feedName, setFeedName] = React.useState<string>()
  const [videos, setVideos] = React.useState<FeedVideos[]>([])
  const getUserState = React.useCallback(
    state => ({
      user: state.user,
    }),
    []
  )

  const { user } = useStore(getUserState)
  const { data: feedData } = useFeeds({ page: 1, limit: 50, userId: user.id })
  const { data: newsItemsData, refetch: refetchNewsItems } = useNewsItems({
    feedId,
  })
  const removeNewsItem = useRemoveNewsItem()

  React.useEffect(() => {
    if (feedData) {
      feedData.forEach(item => {
        setFeedId(item.feedId)
        setFeedName(item.name)
      })
    }
  }, [feedData])

  React.useEffect(() => {
    if (feedId && feedName && newsItemsData) {
      setVideos([{ id: feedId, title: feedName, data: newsItemsData }])
    }
  }, [newsItemsData, feedId, feedName])

  const handleNavBackPress = () => {
    props.navigation.goBack()
  }

  const handleUploadPress = () => {
    if (feedId) {
      props.navigation.navigate('CreatorUpload', { feedId })
    }
  }

  const renderSectionHeader = React.useCallback(
    ({ section }: { section: FeedVideos }) => {
      return (
        <SectionHeaderView>
          <SectionHeaderLabel>{section.title}</SectionHeaderLabel>
        </SectionHeaderView>
      )
    },
    []
  )

  const renderItem: SectionListRenderItem<NewsItem, FeedVideos> =
    React.useCallback(
      ({ item }) => {
        const handleRemove = async (id: string) => {
          try {
            await removeNewsItem.mutateAsync({ feedId: id })
            refetchNewsItems()
          } catch (e) {
            Sentry.captureException(e)
          }
        }

        const handleEdit = async (item: NewsItem) => {
          props.navigation.navigate('CreatorEdit', { item })
        }
        return (
          <VideoItem item={item} onRemove={handleRemove} onEdit={handleEdit} />
        )
      },
      [refetchNewsItems, removeNewsItem]
    )

  const renderItemSeparator = React.useCallback(() => <ItemSeparator />, [])

  return (
    <>
      <TitleBar
        title="My Videos"
        actionTitle="Upload"
        onBackPress={handleNavBackPress}
        onActionPress={handleUploadPress}
      />
      {videos.length > 0 && videos[0].data.length > 0 && (
        <Container>
          <SectionList
            sections={videos}
            renderItem={renderItem as never}
            renderSectionHeader={renderSectionHeader as never}
            ItemSeparatorComponent={renderItemSeparator}
          />
        </Container>
      )}
      {videos.length > 0 && !(videos[0].data.length > 0) && (
        <EmptyStateView
          title="No videos to show"
          description="Please upload a video first"
        />
      )}
      {!(videos.length > 0) && <LoadingOverlay isVisible={true} />}
    </>
  )
}

const Container = styled.View`
  ${tw(`flex-1`)}
`
const SectionHeaderView = styled.View`
  ${tw(`w-full px-4 py-2`)};
  background-color: ${({ theme }) => theme.backgroundDark};
`
const SectionHeaderLabel = styled.Text`
  ${tw(`text-xs`)};
  color: ${({ theme }) => theme.text.body};
`
const RowItem = styled.View`
  ${tw(`p-4 flex-row`)}
`
const RowImage = styled.View`
  ${tw(`h-12 w-1/6 rounded-md overflow-hidden`)}
`
const RowTextContainer = styled.View`
  ${tw(`flex-1 pl-2 justify-center`)}
`
const RowText = styled.Text<{
  muted?: boolean
  small?: boolean
  capitalized?: boolean
}>`
  ${tw(`text-sm`)};
  ${({ small }) => small && `font-size: 12px`};
  color: ${({ theme, muted }) => (muted ? theme.text.muted : theme.text.body)};
  ${({ capitalized }) => capitalized && `text-transform: capitalize`};
`
const RowDuration = styled.View`
  ${tw(`absolute bg-black right-0 bottom-0 rounded-md py-1 px-2`)}
`
const RowDurationLabel = styled.Text`
  ${tw(`text-xs font-semibold`)};
  color: ${({ theme }) => theme.text.light};
`
const ItemSeparator = styled.View`
  ${tw(`ml-4 flex-1`)};
  height: 1px;
  background-color: ${({ theme }) => theme.backgroundAlt};
`
const Controls = styled.View`
  ${tw(`flex-row items-center`)};
`
const Control = styled.TouchableOpacity`
  ${tw(`ml-2 rounded-full h-9 justify-center items-center`)};
  background-color: ${({ theme }) => theme.backgroundAlt};
  min-width: 44px;
`
const SpinnerWrapper = styled.View`
  ${tw(`absolute top-1`)};
`
