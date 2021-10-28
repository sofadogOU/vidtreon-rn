import { useEffect } from 'react'
import { BackHandler } from 'react-native'

export const useBackButton = (handler: () => void) => {
  useEffect(() => {
    /**
     * Override Android Back Button Behavior
     * to collapse bottom sheet on hardware button press
     * */
    const onBackPress = () => {
      handler()
      return true
    }

    BackHandler.addEventListener('hardwareBackPress', onBackPress)
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress)
  }, [handler])
}
