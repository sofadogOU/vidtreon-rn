import * as React from 'react'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import cloneDeep from 'lodash-es/cloneDeep'

import { Category } from '@/hooks'

import { Icon } from '../icon.component'
import { LinePlaceholder } from '../placeholders.component'
import { getEmptyArray } from '@/utils/misc-helpers.util'

interface Props {
  items?: Category[] | { id: string }[]
  onChange: (selectedIds: string[]) => void
  reset?: boolean
}

const manyEmptyItems = getEmptyArray(10)

export const CategoryList = ({
  items = manyEmptyItems,
  onChange,
  reset,
}: Props) => {
  const theme = useTheme()
  const [selectedIds, setSelectedIds] = React.useState<string[]>([])
  const [shouldReset, setShouldReset] = React.useState(false)

  const updateSelection = (id: string) => {
    const currentSelection = cloneDeep(selectedIds)
    const itemIdx = currentSelection.indexOf(id)
    itemIdx === -1
      ? currentSelection.push(id)
      : currentSelection.splice(itemIdx, 1)
    setSelectedIds(currentSelection)
  }

  React.useEffect(() => onChange(selectedIds), [selectedIds, onChange])

  React.useEffect(() => {
    if (shouldReset) {
      setSelectedIds([])
      setShouldReset(false)
    }
  }, [shouldReset])

  React.useEffect(() => {
    if (typeof reset === 'boolean') {
      setShouldReset(reset)
    }
  }, [reset])

  return (
    <Container>
      {(items as Category[]).map(({ id, title, colorHex }) => (
        <CategoryItem key={id} onPress={() => updateSelection(id)}>
          {title !== '' ? (
            <>
              <DetailContainer>
                {colorHex && (
                  <CategoryIndicator style={{ backgroundColor: colorHex }} />
                )}
                <CategoryLabel>{title}</CategoryLabel>
              </DetailContainer>
              <Checkbox>
                {selectedIds.indexOf(id) !== -1 && (
                  <Icon name="tick" size={12} color={theme.text.body} />
                )}
              </Checkbox>
            </>
          ) : (
            <LinePlaceholder />
          )}
        </CategoryItem>
      ))}
    </Container>
  )
}

const Container = styled.View`
  ${tw(`flex-1 w-full`)}
`
const CategoryItem = styled.TouchableOpacity`
  ${tw(`flex-row justify-between items-center h-10 px-6`)}
`
const DetailContainer = styled.View`
  ${tw(`flex-row items-center`)}
`
const CategoryLabel = styled.Text`
  ${tw(`text-sm`)};
  color: ${({ theme }) => theme.text.body};
`
const CategoryIndicator = styled.View`
  ${tw(`h-3 w-3 bg-gray-200 rounded-full mr-3`)}
`
const Checkbox = styled.View`
  ${tw(`h-4 w-4 items-center justify-center bg-opacity-25 rounded-sm`)};
  background-color: ${({ theme }) => theme.backgroundAlt};
`
