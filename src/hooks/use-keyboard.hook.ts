import { useEffect, useState } from 'react'
import { Keyboard, KeyboardEvent } from 'react-native'

export const useKeyboard = (
  config = { useWillShow: false, useWillHide: false }
): [boolean, number, () => void] => {
  const { useWillShow, useWillHide } = config
  const [visible, setVisible] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const showEvent = useWillShow ? 'keyboardWillShow' : 'keyboardDidShow'
  const hideEvent = useWillHide ? 'keyboardWillHide' : 'keyboardDidHide'

  function dismiss() {
    Keyboard.dismiss()
    setVisible(false)
  }

  useEffect(() => {
    function onKeyboardShow(e: KeyboardEvent) {
      setVisible(true)
      setKeyboardHeight(e.endCoordinates.height)
    }

    function onKeyboardHide() {
      setKeyboardHeight(0)
      setVisible(false)
    }

    Keyboard.addListener(showEvent, onKeyboardShow)
    Keyboard.addListener(hideEvent, onKeyboardHide)

    return () => {
      Keyboard.removeListener(showEvent, onKeyboardShow)
      Keyboard.removeListener(hideEvent, onKeyboardHide)
    }
  }, [useWillShow, useWillHide])

  return [visible, keyboardHeight, dismiss]
}
