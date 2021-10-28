import * as React from 'react'
import { StyleSheet } from 'react-native'
import {
  RecyclerListView,
  LayoutProvider,
  DataProvider,
} from 'recyclerlistview'

import { Notification } from '@/hooks'
import { getEmptyArray } from '@/utils/misc-helpers.util'
import * as k from '@/utils/constants'

import { ActivityItem } from './activity-item.component'

const singleEmptyItem = getEmptyArray(1)

interface Props {
  items?: Notification[] | { id: string }[]
  onItemPress: (id: string) => void
  refreshControl?: any
}

export const ActivityList = ({
  items = singleEmptyItem,
  onItemPress,
  refreshControl,
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
      dim.height = 112
    }
  )

  const renderRow = (
    type: string | number,
    item: Notification,
    index: number
  ) => {
    const handleItemPress = () => onItemPress(item.resource.id)
    return (
      <ActivityItem
        key={item.id}
        item={item}
        isLastChild={index === (items && items.length - 1)}
        onItemPress={handleItemPress}
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
      scrollViewProps={{
        refreshControl,
      }}
    />
  ) : null
}

const styles = StyleSheet.create({
  container: {
    minHeight: 1,
    minWidth: 1,
    // height: k.sizes.hit,
    paddingHorizontal: 16,
  },
  contentContainer: {
    width: '100%',
    minHeight: k.sizes.hit,
    // height: k.sizes.hit,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: k.sizes.defPadding,
  },
})
