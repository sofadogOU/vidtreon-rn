import * as React from 'react'
import { StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import {
  RecyclerListView,
  LayoutProvider,
  DataProvider,
} from 'recyclerlistview'

import { Channel } from '@/hooks/apis/api.typings'
import * as k from '@/utils/constants'

import { useTranslation } from '@/providers/TranslationProvider'
import { ChannelWidget } from './channel-widget.component'
import { getEmptyArray } from '@/utils/misc-helpers.util'

const INNER_ITEM_SPACING = 8

interface Props {
  items?: Channel[] | { id: string }[]
  onItemPress: (id: string) => void
  hasTitle?: boolean
  showAutoplay?: boolean
  onEmptyPress?: () => void
}

const manyEmptyItems = getEmptyArray(19)

export const ChannelCarousel = ({
  items = manyEmptyItems,
  onItemPress,
  onEmptyPress,
}: Props) => {
  const i18n = useTranslation()

  const itemSpacing = (idx: number) => {
    return items && idx === items.length - 1 ? 0 : INNER_ITEM_SPACING
  }

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
      dim.width = k.sizes.hit + itemSpacing(index)
      dim.height = k.sizes.hit
    }
  )

  const renderRow = (type: string | number, item: Channel) => {
    const handlePress = () => {
      if (item.feedId) {
        onItemPress(item.feedId)
      } else {
        null
      }
    }
    return <ChannelWidget key={item.id} item={item} onPress={handlePress} />
  }

  return data && items && items?.length > 0 ? (
    <RecyclerListView
      style={{ ...styles.container }}
      layoutProvider={layoutProvider}
      dataProvider={data}
      rowRenderer={renderRow}
      isHorizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      snapToInterval={50}
      decelerationRate="fast"
    />
  ) : (
    <EmptyWrapper>
      <EmptyContainer>
        <EmptyText numberOfLines={1} ellipsizeMode="tail">
          {i18n.t('label_channel_subscribe')}
        </EmptyText>
        <EmptyAction onPress={onEmptyPress}>
          <EmptyLabel>{i18n.t('label_ok')}</EmptyLabel>
        </EmptyAction>
      </EmptyContainer>
    </EmptyWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 1,
    minWidth: 1,
    height: k.sizes.hit,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  contentContainer: {
    minHeight: k.sizes.hit,
    height: k.sizes.hit,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 28,
  },
})

const EmptyWrapper = styled.View`
  ${tw(`flex-1 h-11 px-4 mt-1`)};
  min-height: 40px;
`
const EmptyContainer = styled.View`
  ${tw(`flex-1 flex-row rounded-full items-center justify-between pl-5`)};
  background-color: ${({ theme }) => theme.backgroundDark};
  padding-right: 10px;
`
const EmptyText = styled.Text`
  ${tw(`text-sm pr-4 font-medium`)};
  color: ${({ theme }) => theme.text.muted};
`
const EmptyAction = styled.TouchableOpacity`
  ${tw(`h-7 px-4 items-center justify-center ml-2 rounded-full`)};
  background-color: ${({ theme }) => theme.primary.tint};
`
const EmptyLabel = styled.Text`
  ${tw(`text-xs font-bold`)};
  color: ${({ theme }) => theme.text.light};
`
