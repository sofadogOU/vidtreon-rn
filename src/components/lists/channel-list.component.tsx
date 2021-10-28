import * as React from 'react'
import { StyleSheet } from 'react-native'
// import styled from 'styled-components/native'
// import tw from 'tailwind-rn'
import {
  RecyclerListView,
  LayoutProvider,
  DataProvider,
} from 'recyclerlistview'

import { Channel } from '@/hooks'
import { getEmptyArray } from '@/utils/misc-helpers.util'
import * as k from '@/utils/constants'

import { ChannelItem } from './channel-item.component'

const manyEmptyItems = getEmptyArray(10)

interface Props {
  items?: Channel[] | { id: string }[]
  onItemPress: (id: string) => void
}

export const ChannelList = ({ items = manyEmptyItems, onItemPress }: Props) => {
  const dataProvider = React.useMemo(
    () => new DataProvider((r1, r2) => r1 !== r2),
    []
  )

  const filterCancelled = React.useCallback((subscriptions: Channel[]) => {
    return subscriptions?.filter(item => item.status !== 'cancelled')
  }, [])

  const [data, setData] = React.useState(
    items && dataProvider.cloneWithRows(filterCancelled(items as Channel[]))
  )
  React.useEffect(() => {
    if (items) {
      setData(dataProvider.cloneWithRows(filterCancelled(items as Channel[])))
    }
  }, [items, dataProvider, filterCancelled])

  const layoutProvider = new LayoutProvider(
    () => 1,
    (type, dim, index) => {
      dim.width = k.screen.w
      dim.height = index === items.length - 1 ? 112 + k.sizes.defPadding : 112
    }
  )

  const renderRow = (type: string | number, item: Channel, index: number) => {
    return (
      <ChannelItem
        key={item.id}
        item={item}
        isLastChild={index === (items && items.length - 1)}
        onItemPress={() => onItemPress(item.feedId)}
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
    paddingHorizontal: 16,
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
