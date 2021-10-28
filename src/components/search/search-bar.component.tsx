import * as React from 'react'
import { TextInput } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import debounce from 'lodash-es/debounce'
import Haptics from 'react-native-haptic-feedback'

import * as k from '@/utils/constants'

import { Icon } from '../icon.component'
import { Button } from '../buttons.component'

interface Props {
  value: string
  onChange?: (query: string) => void
  placeholder?: string
  onFilterPress?: () => void
  onSearchPress: (text: string) => void
  showFilter?: boolean
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search',
  onFilterPress,
  onSearchPress,
  showFilter,
}: Props) => {
  const theme = useTheme()
  const onChangeText = debounce((text: string) => {
    onChange?.(text)
  }, 300)
  // const [searchText, setSearchText] = React.useState<string>()
  const inputFieldRef = React.useRef<TextInput>()

  const handleFilterPress = () => {
    Haptics.trigger('impactLight', k.hapticOptions)
    onFilterPress?.()
  }

  React.useEffect(() => {
    inputFieldRef.current?.clear()
  }, [showFilter])

  // React.useEffect(() => setSearchText(value), [value])

  return (
    <Container>
      <Icon name="search" size="xs" color={theme.text.muted} />
      <Input
        // value={searchText}
        ref={inputFieldRef as any}
        returnKeyType="search"
        autoCapitalize="none"
        onChangeText={text => {
          onChangeText(text)
          // setSearchText(text)
        }}
        placeholder={`${placeholder}...`}
        placeholderTextColor={theme.text.muted}
        selectionColor={theme.primary.tint}
        clearButtonMode="while-editing"
        onSubmitEditing={e => onSearchPress(e.nativeEvent.text)}
      />
      {onFilterPress && showFilter && (
        <Button
          onPress={handleFilterPress}
          type="icon"
          style={{ backgroundColor: 'transparent' }}
        >
          <Icon name="filter" color={theme.primary.tint} size={20} />
        </Button>
      )}
    </Container>
  )
}

const Container = styled.View`
  ${tw(`flex-row justify-start 
  items-center flex-1 h-11 rounded-xl pl-3`)};
  background-color: ${({ theme }) => theme.backgroundAlt};
`
const Input = styled.TextInput`
  ${tw(`flex-1 px-3 pr-0 text-base`)}
  line-height: 0;
  color: ${({ theme }) => theme.text.body};
`
