import * as React from 'react'
import { TouchableWithoutFeedback, StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import {
  RecyclerListView,
  LayoutProvider,
  DataProvider,
} from 'recyclerlistview'

import { Channel, useIsMounted } from '@/hooks'
import * as k from '@/utils/constants'
import { getEmptyArray } from '@/utils/misc-helpers.util'

import { RemoteImage } from '../remote-image.component'

interface Props {
  items?: Channel[] | { id: string }[]
  onItemPress: (id: string) => void
}

interface WidgetProps {
  item: Channel
  index: number
  onItemPress: (id: string) => void
}

const FeaturedWidget = ({ item, onItemPress, index }: WidgetProps) => {
  const adjustedIndex = index + 1
  return (
    <TouchableWithoutFeedback
      onPress={e => {
        e.preventDefault()
        item.avatarUrl ? onItemPress(item.id) : null
      }}
    >
      <ItemWrapper isEven={adjustedIndex % 2 === 0}>
        <ItemShadowWrapper>
          <ItemContainer>
            <CoverWrapper>
              <CoverImageWrapper>
                <RemoteImage source={item.coverUrl} />
              </CoverImageWrapper>
              <AvatarWrapper>
                <AvatarContainer>
                  <RemoteImage source={item.avatarUrl} />
                </AvatarContainer>
              </AvatarWrapper>
            </CoverWrapper>
            <TextWrapper>
              <Title numberOfLines={1} ellipsizeMode="tail">
                {item.name}
              </Title>
              <Description numberOfLines={3} ellipsizeMode="tail">
                {item.description}
              </Description>
            </TextWrapper>
          </ItemContainer>
        </ItemShadowWrapper>
      </ItemWrapper>
    </TouchableWithoutFeedback>
  )
}

const manyEmptyItems = getEmptyArray(2)

export const FeaturedCarousel = ({
  items = manyEmptyItems,
  onItemPress,
}: Props) => {
  const isMounted = useIsMounted()
  const dataProvider = React.useMemo(
    () => new DataProvider((r1, r2) => r1 !== r2),
    []
  )

  const adjustedItems = (items: unknown[]) =>
    items.length % 2 === 0 ? items : [...items, { id: 'SPACER' }]

  const [data, setData] = React.useState(
    dataProvider.cloneWithRows(adjustedItems(items))
  )

  const ITEM_WIDTH = k.screen.w / 2
  const ITEM_HEIGHT = 200

  React.useEffect(() => {
    if (isMounted()) {
      setData(dataProvider.cloneWithRows(adjustedItems(items)))
    }
  }, [items, dataProvider, isMounted])

  const layoutProvider = new LayoutProvider(
    () => 1,
    (type, dim) => {
      dim.width = ITEM_WIDTH
      dim.height = ITEM_HEIGHT
    }
  )

  const renderRow = (type: string | number, item: Channel, index: number) => {
    return item.id === 'SPACER' ? null : (
      <FeaturedWidget
        key={item.id}
        item={item}
        index={index}
        onItemPress={onItemPress}
      />
    )
  }

  return data && items && items.length > 0 ? (
    <RecyclerListView
      style={{
        ...styles.container,
        height: ITEM_HEIGHT,
        minHeight: ITEM_HEIGHT,
      }}
      layoutProvider={layoutProvider}
      dataProvider={data}
      rowRenderer={renderRow}
      isHorizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        ...styles.contentContainer,
        height: ITEM_HEIGHT,
        minHeight: ITEM_HEIGHT,
      }}
      snapToInterval={k.screen.w}
      decelerationRate="fast"
      canChangeSize
    />
  ) : null
}

const styles = StyleSheet.create({
  container: {
    minHeight: 1,
    minWidth: 1,
    marginTop: k.sizes.sm,
  },
  contentContainer: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const ItemWrapper = styled.View<{
  isEven: boolean
}>`
  padding-left: ${({ isEven }) => (isEven ? 8 : 16)}px;
  padding-right: ${({ isEven }) => (isEven ? 16 : 8)}px;
`

const ItemShadowWrapper = styled.View`
  ${tw(`h-full pb-2 justify-center`)};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
`
const ItemContainer = styled.View`
  ${tw(`h-full w-full rounded-xl overflow-hidden`)};
  background-color: ${({ theme }) => theme.cardBg};
  elevation: 3;
`
const AvatarWrapper = styled.View`
  ${tw(`absolute rounded-full`)};
  height: 60px;
  width: 60px;
  top: 30px;
  left: 50%;
  margin-left: -30px;
  elevation: 2;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`
const AvatarContainer = styled.View`
  ${tw(`rounded-full overflow-hidden h-full w-full`)};
`
const CoverWrapper = styled.View`
  ${tw(`w-full h-2/5`)}
`
const CoverImageWrapper = styled.View`
  ${tw(`w-full h-full`)};
`
const TextWrapper = styled.View`
  ${tw(`flex-1 mt-4 items-center py-2 px-4`)}
`
const Title = styled.Text`
  ${tw(`text-sm font-bold mb-1 text-center`)};
  color: ${({ theme }) => theme.text.body};
`
const Description = styled.Text`
  ${tw(`text-xs font-normal text-center`)};
  color: ${({ theme }) => theme.text.body};
`
