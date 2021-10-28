import * as React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import cloneDeep from 'lodash-es/cloneDeep'
import Haptics from 'react-native-haptic-feedback'
import { ScrollView } from 'react-native-gesture-handler'
import { LinearGradient } from 'expo-linear-gradient'
import MaskView from '@react-native-masked-view/masked-view'

import { Tag } from '@/typings'
import * as k from '@/utils/constants'

import { TagWidget } from './tag-widget.component'
import { getEmptyArray } from '@/utils/misc-helpers.util'

interface Props {
  items?: Tag[] | { id: string }[]
  onSelect: (itemId: string | string[]) => void
  multiselect?: boolean
  selectedTags?: Tag[]
}

const manyEmptyItems = getEmptyArray(10)

export const TagCarousel = ({
  items = manyEmptyItems,
  onSelect,
  multiselect = false,
  selectedTags = [],
}: Props) => {
  const [selectedTagIds, setSelectedTagIds] = React.useState<string[]>(
    selectedTags.map(item => item.id)
  )
  const [selectedTagLabels, setSelectedTagLabels] = React.useState<string[]>(
    selectedTags.map(item => item.name)
  )
  const [tags, setTags] = React.useState(items)

  React.useEffect(() => {
    if (!multiselect) {
      const clone = cloneDeep(items)
      clone.shift()
      setTags(clone)
    }
  }, [multiselect, items])

  React.useEffect(() => {
    if (selectedTags.length > 0) {
      setSelectedTagIds(selectedTags.map(item => item.id))
      setSelectedTagLabels(selectedTags.map(item => item.name))
    }
  }, [selectedTags])

  const GRADIENT_PROPS = !multiselect
    ? {
        colors: ['#000000ff', '#000000dd', '#00000000', '#ffffff00'],
        locations: [0, 0.85, 0.95, 1],
      }
    : {
        colors: ['#000000ff', '#000000ff'],
        locations: [0, 1],
      }

  const containerStyle: StyleProp<ViewStyle> = {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: k.sizes.defPadding,
    paddingRight: !multiselect ? 30 : 0,
  }

  const handleSelection = (id: string, index: number, label: string) => {
    Haptics.trigger('impactLight', k.hapticOptions)
    if (!multiselect) {
      return onSelect(id)
    }
    // `All` selected
    if (index === 0) {
      setSelectedTagIds([])
      setSelectedTagLabels([])
      onSelect([])
      return
    }
    const idsCopy = cloneDeep(selectedTagIds)
    const idPos = selectedTagIds.indexOf(id)

    const labelsCopy = cloneDeep(selectedTagLabels)
    const labelPos = selectedTagLabels.indexOf(label)

    if (idPos === -1) {
      idsCopy.push(id)
    } else {
      idsCopy.splice(idPos, 1)
    }

    if (labelPos === -1) {
      labelsCopy.push(label)
    } else {
      labelsCopy.splice(labelPos, 1)
    }
    setSelectedTagIds(idsCopy)
    setSelectedTagLabels(labelsCopy)
    onSelect(labelsCopy)
  }

  return (
    <MaskWrapper
      maskElement={
        <MaskElement>
          <MaskGradient start={[0, 0.5]} end={[1, 0.5]} {...GRADIENT_PROPS} />
        </MaskElement>
      }
    >
      <ScrollContainer
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={containerStyle as any}
        removeClippedSubviews
      >
        {(tags as Tag[])?.map(({ id, name }, index) => (
          <TagWidget
            key={id}
            onPress={() => handleSelection(id, index, name)}
            selected={
              multiselect
                ? selectedTagIds.length === 0
                  ? index === 0
                  : selectedTagIds.indexOf(id) !== -1
                : false
            }
            style={{
              marginRight: k.sizes.sm,
            }}
          >
            {name}
          </TagWidget>
        ))}
      </ScrollContainer>
    </MaskWrapper>
  )
}

const MaskWrapper = styled(MaskView)`
  ${tw(`h-8`)}
`
const ScrollContainer = styled(ScrollView)`
  ${tw(`flex-1`)}
`
const MaskElement = styled.View`
  ${tw(`w-full h-full`)}
`
const MaskGradient = styled(LinearGradient)`
  ${tw(`w-full h-full`)}
`
