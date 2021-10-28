import * as React from 'react'
import { StyleSheet } from 'react-native'
import {
  RecyclerListView,
  LayoutProvider,
  DataProvider,
} from 'recyclerlistview'

import { Video } from '@/hooks'
import { getEmptyArray } from '@/utils/misc-helpers.util'
import * as k from '@/utils/constants'

import { VideoItem } from './video-item.component'

const manyEmptyItems = getEmptyArray(10)

const ITEM_HEIGHT = k.screen.w * 0.35 + k.sizes.defPadding

interface Props {
  items?: Video[] | { id: string }[]
  onItemPress: (id: string) => void
  onChannelPress?: (id: string) => void
  isWatchlist?: boolean
}

export const VideoList = ({
  items = manyEmptyItems,
  onItemPress,
  onChannelPress,
  isWatchlist,
}: Props) => {
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

  const renderRow = (type: string | number, item: Video, index: number) => {
    return (
      <VideoItem
        key={item.id}
        item={item}
        isLastChild={index === (items && items.length - 1)}
        onItemPress={() => onItemPress(item.id)}
        onChannelPress={() => onChannelPress?.(item.channel.id)}
        showWatchbar={isWatchlist}
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
  ) : null
}

const styles = StyleSheet.create({
  container: {
    minHeight: 1,
    minWidth: 1,
    // height: k.sizes.hit,
    paddingHorizontal: 0,
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
