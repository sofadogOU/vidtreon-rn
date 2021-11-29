import * as React from 'react'
import { StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import {
  RecyclerListView,
  LayoutProvider,
  DataProvider,
} from 'recyclerlistview'

import { Video } from '@/hooks/apis/api.typings'
import * as k from '@/utils/constants'
import { calcSize, GridLayout, GridHeight } from '@/utils/video-helpers.util'
import { useIsMounted } from '@/hooks'

import { VideoWidget } from './video-widget.component'
import { EmptyStateView } from '../empty-state-view.component'
import { getEmptyArray } from '@/utils/misc-helpers.util'
import { useTranslation } from '@/providers'

interface Props {
  items?: Video[] | { id: string }[]
  onItemPress: (id: string) => void
  onDetailPress?: (item: Video) => void
  onChannelPress?: (id: string) => void
  hideAvatars?: boolean
  layout?: GridLayout
  height?: GridHeight
  fullWidth?: boolean
  isFeature?: boolean
}

const singleEmptyItem = getEmptyArray(1)
const manyEmptyItems = getEmptyArray(10)


export const VideoCarousel = ({
  isFeature,
  items = isFeature ? singleEmptyItem : manyEmptyItems,
  onItemPress,
  onChannelPress,
  hideAvatars,
  layout = '4-col',
  height = 'md',
  fullWidth,
  onDetailPress,
}: Props) => {
  const isMounted = useIsMounted()
  const i18n = useTranslation()
  const dataProvider = React.useMemo(
    () => new DataProvider((r1, r2) => r1 !== r2),
    []
  )
  const [data, setData] = React.useState(dataProvider.cloneWithRows(items))
  const { width: itemWidth, height: itemHeight } = calcSize(layout, height)

  React.useEffect(() => {
    if (isMounted()) {
      setData(dataProvider.cloneWithRows(items))
    }
  }, [items, dataProvider, isMounted])

  const layoutProvider = new LayoutProvider(
    () => 1,
    (type, dim) => {
      dim.width = itemWidth
      dim.height = itemHeight
    }
  )

  const renderRow = (type: string | number, item: Video) => {
    const handleItemPress = () => onItemPress(item.id)
    const handleDetailPress = () => onDetailPress?.(item)
    const handleChannelPress = () => onChannelPress?.(item.channel.id)
    return (
      <VideoWidget
        key={item.id}
        {...item}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        onItemPress={handleItemPress}
        onDetailPress={handleDetailPress}
        onChannelPress={handleChannelPress}
        hideAvatar={hideAvatars}
        layout={layout}
        height={height}
        isFeatured={fullWidth}
        isPremium={item?.isPremium}
      />
    )
  }

  return data && items && items.length > 0 ? (
    <RecyclerListView
      style={{
        ...styles.container,
        height: itemHeight,
        minHeight: itemHeight,
      }}
      layoutProvider={layoutProvider}
      dataProvider={data}
      rowRenderer={renderRow}
      isHorizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        ...styles.contentContainer,
        height: itemHeight,
        minHeight: itemHeight,
      }}
      snapToInterval={itemWidth}
      decelerationRate="fast"
      canChangeSize
    />
  ) : (
    <Container>
      <EmptyStateView title={i18n.t('channel_empty')} />
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 10,
    minWidth: 10,
    marginVertical: k.sizes.sm,
  },
  contentContainer: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: k.sizes.defPadding,
  },
})

const Container = styled.View`
  ${tw(`mt-1 mb-2`)};
  height: 100px;
`
