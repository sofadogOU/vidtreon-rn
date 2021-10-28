import * as React from 'react'
import { TouchableWithoutFeedback, Keyboard } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import Spinner from 'react-native-spinkit'

import {
  ExploreStackNavigationProp,
  ExploreStackRouteProp,
} from '@/typings/navigators'

import { useTranslation } from '@/providers'

import {
  useVideos,
  useFilterPremium,
  useSubscriptions,
  useSearchChannels,
  Tag,
} from '@/hooks'

import {
  SearchBar,
  TitleBar,
  TagCarousel,
  SearchResults,
  EmptyStateView,
  Icon,
} from '@/components'

type Params = {
  title?: string
  tags?: string[]
  categories?: string[]
  limit?: number
}

interface Props {
  navigation: ExploreStackNavigationProp<'ExploreSearch'>
  route: ExploreStackRouteProp<'ExploreSearch'>
}

export const SearchScreen = ({ navigation, route }: Props) => {
  const i18n = useTranslation()
  const theme = useTheme()
  const filterPremium = useFilterPremium()
  const [params, setParams] = React.useState<Params>({})
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([])
  const [isChannelSearch, setChannelSearch] = React.useState(true)

  const { data: videoData, isFetching: videoDataFetching } = useVideos({
    ...params,
    title: params.title || '',
    limit: 200,
  })

  const { data: channelData, isFetching: channelDataFetching } =
    useSearchChannels({
      query: isChannelSearch ? params.title?.toLowerCase() || '' : undefined,
      limit: 200,
    })
  const { data: subscriptionData } = useSubscriptions()

  React.useEffect(() => {
    if (
      route.params?.categoryIds &&
      typeof route.params.categoryIds === 'object'
    ) {
      setParams(s => ({
        ...s,
        categories: route.params?.categoryIds,
      }))
    }
  }, [route.params])

  React.useEffect(() => {
    if (route.params?.tagId) {
      const selectedTag = route.params?.tagsData?.filter(
        item => item.id === route.params?.tagId
      )
      if (selectedTag && selectedTag.length > 0) {
        setSelectedTags(selectedTag)
        handleTagsChange([selectedTag[0].name])
      }
    }
  }, [route.params?.tagId, route.params?.tagsData])

  const handleTagsChange = (tagLabels: string[] | string) => {
    if (typeof tagLabels === 'object') {
      setParams(s => ({
        ...s,
        tags: tagLabels,
      }))
    }
  }

  const handleToggleSidebar = () => {
    navigation.openDrawer()
  }

  const handleVideoPress = (id: string) => {
    navigation.dangerouslyGetParent()?.navigate('MediaPlayer', { id })
  }

  const handleChannelPress = (id: string) => {
    navigation.dangerouslyGetParent()?.navigate('Channel', {
      screen: 'ChannelDetail',
      params: { id },
    })
  }

  const handleSearchPress = (query: string) => {
    setParams(s => ({
      ...s,
      title: query,
    }))
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Wrapper>
        <TitleBar
          title={i18n.t('title_search')}
          onBackPress={() => navigation.pop()}
        />
        <HeaderContainer style={{ paddingBottom: isChannelSearch ? 0 : 16 }}>
          <FilterContainer>
            <FilterButton
              selected={!isChannelSearch}
              onPress={() => {
                setChannelSearch(false)
                setSelectedTags([])
                setParams(v => ({ ...v, tags: [], title: undefined }))
              }}
            >
              <Icon name="cVideos" size={15} color={theme.text.muted} />
              <FilterLabel>{i18n.t('tab_videos')}</FilterLabel>
            </FilterButton>
            <FilterButton
              selected={isChannelSearch}
              onPress={() => {
                setChannelSearch(true)
                setSelectedTags([])
                setParams(v => ({ ...v, tags: [], title: undefined }))
              }}
            >
              <Icon name="cChannel" size={15} color={theme.text.muted} />
              <FilterLabel>{i18n.t('tab_channels')}</FilterLabel>
            </FilterButton>
          </FilterContainer>
          <SearchWrapper>
            <SearchBar
              value={params.title || ''}
              onSearchPress={handleSearchPress}
              // onChange={handleQueryChange}
              placeholder={i18n.t('field_search')}
              onFilterPress={handleToggleSidebar}
              showFilter={!isChannelSearch}
            />
          </SearchWrapper>
          {!isChannelSearch && (
            <TagCarousel
              multiselect
              items={route.params?.tagsData}
              selectedTags={selectedTags}
              onSelect={handleTagsChange}
            />
          )}
        </HeaderContainer>
        {!isChannelSearch && (
          <ResultsContainer>
            {videoData && videoData?.length > 0 && (
              <SearchResults
                items={
                  videoData ? filterPremium(videoData, subscriptionData) : []
                }
                onItemPress={handleVideoPress}
                onChannelPress={handleChannelPress}
              />
            )}
            {videoDataFetching &&
              (videoData === undefined || videoData.length > 0) && (
                <SpinnerWrapper>
                  <Spinner
                    type="Pulse"
                    size={100}
                    color={theme.backgroundAlt}
                  />
                </SpinnerWrapper>
              )}
            {(videoData === undefined || videoData.length === 0) &&
              !videoDataFetching && (
                <EmptyStateView
                  title={i18n.t('empty_title')}
                  description={i18n.t('empty_description')}
                />
              )}
          </ResultsContainer>
        )}
        {isChannelSearch && (
          <ResultsContainer>
            {channelData && channelData?.length > 0 && (
              <SearchResults
                resultType="channel"
                items={channelData ? channelData : []}
                onItemPress={handleVideoPress}
                onChannelPress={handleChannelPress}
              />
            )}
            {channelDataFetching &&
              (channelData === undefined || channelData.length > 0) && (
                <SpinnerWrapper>
                  <Spinner
                    type="Pulse"
                    size={100}
                    color={theme.backgroundAlt}
                  />
                </SpinnerWrapper>
              )}
            {(channelData === undefined || channelData.length === 0) &&
              !channelDataFetching && (
                <EmptyStateView
                  title={i18n.t('empty_title')}
                  description={i18n.t('empty_description')}
                />
              )}
          </ResultsContainer>
        )}
      </Wrapper>
    </TouchableWithoutFeedback>
  )
}

const Wrapper = styled.View`
  ${tw(`flex-1`)}
`
const SearchWrapper = styled.View`
  ${tw(`p-4 flex-row items-center`)}
`
const HeaderContainer = styled.View`
  ${tw(`pb-4`)}
`
const ResultsContainer = styled.View`
  ${tw(`flex-1 justify-center`)}
`
const SpinnerWrapper = styled.View`
  ${tw(`flex-1 items-center justify-center`)}
`

const FilterContainer = styled.View`
  ${tw(`flex-row`)}
`
const FilterButton = styled.TouchableOpacity<{ selected: boolean }>`
  ${tw(`flex-1 flex-row justify-center items-center h-11`)};
  background-color: ${({ theme, selected }) =>
    selected ? theme.background : theme.backgroundAlt};
`
const FilterLabel = styled.Text`
  ${tw(`text-sm font-semibold ml-2`)};
  color: ${({ theme }) => theme.text.muted};
`
