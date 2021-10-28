import * as React from 'react'
// import { View, Text } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'

type Filter = 'channels' | 'videos'

import { Icon } from '../icon.component'

interface Props {
  onChange: (filter: Filter) => void
}

export const SearchFilter = ({ onChange }: Props) => {
  const theme = useTheme()
  const [filter, setFilter] = React.useState<Filter>('channels')
  return (
    <FilterWrapper>
      <FilterButton
        onPress={() => {
          setFilter('channels')
          onChange('channels')
        }}
        selected={filter === 'channels'}
      >
        <Icon
          name="channel"
          size="xs"
          color={filter === 'channels' ? theme.text.body : theme.text.muted}
        />
      </FilterButton>
      <FilterButton
        onPress={() => {
          setFilter('videos')
          onChange('videos')
        }}
        selected={filter === 'videos'}
      >
        <Icon
          name="videos"
          size="xs"
          color={filter === 'videos' ? theme.text.body : theme.text.muted}
          containerStyle={{ marginLeft: 2 }}
        />
      </FilterButton>
    </FilterWrapper>
  )
}
const FilterWrapper = styled.View`
  ${tw(`flex-row h-11 items-center mr-2 
          rounded-xl overflow-hidden p-1`)};
  background-color: ${({ theme }) => theme.backgroundAlt};
`
const FilterButton = styled.TouchableOpacity<{ selected: boolean }>`
  ${tw(`w-9 h-full items-center justify-center rounded-lg`)};
  background-color: ${({ theme, selected }) =>
    selected ? theme.primary.tint : theme.backgroundAlt};
`
