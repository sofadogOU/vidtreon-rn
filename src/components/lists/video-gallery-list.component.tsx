import * as React from 'react'
import { StyleSheet } from 'react-native'
import {
  RecyclerListView,
  LayoutProvider,
  DataProvider,
} from 'recyclerlistview'

import * as k from '@/utils/constants'
import { getEmptyArray } from '@/utils/misc-helpers.util'
import { Video } from '@/hooks'
import { VideoGalleryItem } from './video-gallery-item.component'

const manyEmptyItems = getEmptyArray(10)

interface Props {
  items?: Video[] | { id: string }[]
  hideAvatars?: boolean
  onItemPress: (id: string) => void
  onDetailPress?: (item: Video) => void
  onChannelPress?: (id: string) => void
}

const ITEM_WIDTH = (k.screen.w - k.sizes.defPadding * 2) / 2
const ITEM_HEIGHT = ITEM_WIDTH * 1.1

export const VideoGalleryList = ({
  items = manyEmptyItems,
  hideAvatars,
  onItemPress,
  onDetailPress,
  onChannelPress,
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
    (type, dim) => {
      dim.width = ITEM_WIDTH
      dim.height = ITEM_HEIGHT
    }
  )

  const renderRow = (type: string | number, item: Video, index: number) => {
    const isEven = index % 2 === 0
    return (
      <VideoGalleryItem
        key={item.id}
        hideAvatars
        onChannelPress={() => onChannelPress?.(item.id)}
        onItemPress={() => onItemPress(item.id)}
        onDetailPress={() => onDetailPress?.(item)}
        containerStyle={{
          paddingLeft: isEven ? 0 : k.sizes.sm,
          paddingRight: isEven ? k.sizes.sm : 0,
          paddingBottom: k.sizes.defPadding,
        }}
        {...item}
      />
    )
  }

  return data && items && items.length > 0 ? (
    <RecyclerListView
      style={{
        ...styles.container,
        minHeight: Math.ceil((items.length / 2) * ITEM_HEIGHT),
      }}
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
    paddingHorizontal: k.sizes.defPadding,
    flex: 1,
    // minHeight: 1,
    // minWidth: 1,
  },
  contentContainer: {
    marginTop: k.sizes.sm,
    // height: '100%',
    // width: '100%',
    // justifyContent: 'space-between',
  },
})
