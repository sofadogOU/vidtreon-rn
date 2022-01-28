import * as React from 'react'
import { Keyboard , TextInput ,Text,View,StyleSheet,ImageBackground} from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import { View as MotiView } from 'moti'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-spinkit'
import { useForm, Controller } from 'react-hook-form'
import * as k from '@/utils/constants'    



import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler'
import bgLogo from '@/assets/images/bglogo.png'
import {
  useStore,
} from '@/hooks'

import {
  ChannelStackNavigationProp,
  ChannelStackRouteProp,
} from '@/typings/navigators'



import { useTranslation } from '@/providers/TranslationProvider'

import { Icon } from '../icon.component'
import { Button } from '../buttons.component'


interface Props {
  isVisible: boolean
  onClose: () => void
  showSpinner: boolean
  navigation: ChannelStackNavigationProp<'ChannelDetail'>
  route: ChannelStackRouteProp<'ChannelDetail'>
}



export const Offline = () => {
  const insets = useSafeAreaInsets()
  const i18n = useTranslation()
  const store = useStore()
  //const readNotification = useDeviceCode()


  return (
    
      <>  

<ImageBackground source={bgLogo} resizeMode="cover" style={{ flex: 1,paddingBottom:100,
    justifyContent: "center"}}>
    <View style={styles.loginTextSection}>

      <Text style={styles.inputText}> You are offline </Text>
     </View>
  


 </ImageBackground>

 </>
      
  )
}




const styles = StyleSheet.create({
  loginTextSection: {
     width: '100%',
     height: '30%',
  },

  loginButtonSection: {
     width: '100%',
     height: '10%',
    
     justifyContent: 'center',
     alignItems: 'center'
  },

  inputText: {
     marginLeft: '20%',
     width: '80%',
     fontWeight : 'bold',
     height : '50%',
    
    padding: 10,
  },

  loginButton: {
    marginLeft: '20%',
     width: '80%',
     fontWeight : 'bold',
     height : '50%',
     
    borderRadius: 10,
    padding: 10,
  },

  subButton : {
    
    fontWeight : 'bold'
  }
})
