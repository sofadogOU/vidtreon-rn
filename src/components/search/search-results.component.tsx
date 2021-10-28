import * as React from 'react'
import { StyleSheet } from 'react-native'
import {
  RecyclerListView,
  LayoutProvider,
  DataProvider,
} from 'recyclerlistview'

import { SearchChannel, Video } from '@/hooks'
import { getEmptyArray } from '@/utils/misc-helpers.util'
import * as k from '@/utils/constants'

import { SearchResult } from './search-result.component'
import { SearchResultChannel } from './search-channel-result.component'
import { EmptyStateView } from '../empty-state-view.component'

const manyEmptyItems = getEmptyArray(10)

interface Props {
  resultType?: 'channel' | 'video'
  items?: Video[] | { id: string }[]
  onItemPress: (id: string) => void
  onChannelPress?: (id: string) => void
  isWatchlist?: boolean
}

export const SearchResults = ({
  resultType = 'video',
  items = manyEmptyItems,
  onItemPress,
  onChannelPress,
  isWatchlist,
}: Props) => {
  const IS_VIDEO = resultType === 'video'
  const ITEM_HEIGHT = k.screen.w * (IS_VIDEO ? 0.35 : 0.13) + k.sizes.defPadding

  const dataProvider = React.useMemo(
    () => new DataProvider((r1, r2) => r1 !== r2),
    []
  )
  const [data, setData] = React.useState(
    items && dataProvider.cloneWithRows(items)
  )
  React.useEffect(() => {
    if (items) {
      setData(dataProvider.cloneWithRows(items))
    }
  }, [items, dataProvider])

  const layoutProvider = new LayoutProvider(
    () => 1,
    (type, dim, index) => {
      dim.width = k.screen.w
      dim.height =
        index === items.length - 1
          ? ITEM_HEIGHT + k.sizes.defPadding
          : ITEM_HEIGHT
    }
  )

  const renderRow = (
    type: string | number,
    item: Video | SearchChannel,
    index: number
  ) => {
    return resultType === 'video' ? (
      <SearchResult
        key={item.id}
        item={item as Video}
        isLastChild={index === (items && items.length - 1)}
        onItemPress={() => onItemPress(item.id)}
        onChannelPress={() => onChannelPress?.((item as Video).channel.id)}
        showWatchbar={isWatchlist}
      />
    ) : (
      <SearchResultChannel
        key={item.id}
        item={item as SearchChannel}
        onItemPress={() => onChannelPress?.((item as SearchChannel).id)}
      />
    )
  }

  return data && items && items.length > 0 ? (
    <RecyclerListView
      style={{ ...styles.container }}
      layoutProvider={layoutProvider}
      dataProvider={data}
      rowRenderer={renderRow}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    />
  ) : (
    <EmptyStateView
      title="All bark, and no bite!"
      description="No results found"
    />
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 1,
    minWidth: 1,
    // height: k.sizes.hit,
    marginTop: 4,
  },
  contentContainer: {
    width: '100%',
    minHeight: k.sizes.hit,
    // height: k.sizes.hit,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

// const List = styled.FlatList`
//   ${tw(`flex-1`)};
//   background-color: ${({ theme }) => theme.background};
// `
