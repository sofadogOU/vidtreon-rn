import * as React from 'react'
import { KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInput,
} from 'react-native'

import * as k from '@/utils/constants'
import { useKeyboard } from '@/hooks'

import { useTranslation } from '@/providers/TranslationProvider'

import { Icon } from '../icon.component'

export type Reply = {
  name: string
  id: string
}

interface Props {
  onActionPress: () => void
  onSendPress: (message: string, replyId?: string) => void
  onFocus?: () => void
  onBlur?: () => void
  replyValue?: Reply
}

export const CommentsInput = ({
  onActionPress,
  onSendPress,
  replyValue: _replyValue,
  onFocus,
  onBlur,
}: Props) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const i18n = useTranslation()
  const inputRef = React.useRef<TextInput>(null)
  const [keyboardVisible, keyboardHeight] = useKeyboard({
    useWillShow: k.isAndroid ? false : true,
    useWillHide: k.isAndroid ? false : true,
  })

  const [inputValue, setInputValue] = React.useState<string | null>()
  const [message, setMessage] = React.useState<string | null>()
  const [replyValue, setReplyValue] = React.useState<Reply | undefined>(
    _replyValue
  )

  React.useEffect(() => {
    setReplyValue(_replyValue)
    if (_replyValue && _replyValue.name.length > 0) {
      inputRef.current?.focus()
      setInputValue(`@${_replyValue.name} `)
      setMessage(`@${_replyValue.name} `)
    }
  }, [_replyValue])

  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    onBlur?.()
    e.preventDefault()
  }

  const handleSend = () => {
    if (message) {
      onSendPress(message, replyValue?.id)
      setMessage(null)
      setInputValue(null)
      inputRef.current?.clear()
    }
  }

  const handleChangeText = (text: string) => {
    setMessage(text)
    setInputValue(text)
    if (text === '') {
      setReplyValue(undefined)
    }
  }

  const handleInputTouch = () => {
    inputRef.current?.focus()
  }

  const renderFooter = (
    <Container
      style={{
        bottom: k.isAndroid
          ? keyboardVisible
            ? insets.bottom + keyboardHeight + k.sizes.xl + 20
            : insets.bottom + k.sizes.lg
          : keyboardVisible
          ? insets.bottom + k.sizes.xl
          : 0,
      }}
    >
      <Button onPress={onActionPress} style={{ marginRight: k.sizes.sm }}>
        <Icon name="camera" size="sm" />
      </Button>
      <TouchableWithoutFeedback onPress={handleInputTouch}>
        <InputContainer>
          <InputField
            ref={inputRef}
            onChangeText={handleChangeText}
            onBlur={handleBlur}
            value={inputValue || ''}
            multiline
            placeholder={`${i18n.t('comment_input_placeholder')}...`}
            placeholderTextColor="white"
            blurOnSubmit={false}
            onFocus={onFocus}
          />
        </InputContainer>
      </TouchableWithoutFeedback>
      <Button onPress={handleSend} style={{ marginLeft: k.sizes.sm }}>
        <Icon name="send" size="sm" color={theme.primary.tint} />
      </Button>
    </Container>
  )

  return k.isAndroid ? (
    renderFooter
  ) : (
    <KeyboardAvoidingView behavior="position">
      {renderFooter}
    </KeyboardAvoidingView>
  )
}

const Container = styled.View`
  ${tw(`absolute flex-row items-end px-2`)};
`
const InputContainer = styled.View`
  ${tw(`flex-1 flex-row items-center py-1 border`)};
  border-color: white;
  border-radius: ${k.sizes.fieldHeight / 2}px;
  min-height: ${k.sizes.fieldHeight}px;
`
const InputField = styled(TextInput)`
  ${tw(`flex-1 text-white p-0 px-4`)};
  height: 100%;
`
const Button = styled.TouchableOpacity`
  ${tw(`w-11 h-11 items-center justify-center`)}
`
