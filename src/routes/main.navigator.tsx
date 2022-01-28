import React from 'react'
import { enableScreens } from 'react-native-screens'
import { createNativeStackNavigator } from 'react-native-screens/native-stack'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { MainStackParamList } from '@/typings/navigators'
import * as k from '@/utils/constants'

import { DrawerNavigation } from './drawer.navigator'
import { ChannelNavigator } from './channel.navigator'

import { VideoPlayerScreen } from '@/containers/video-player'
import { ShopScreen } from '@/containers/shop'
import { OnboardingScreen } from '@/containers/onboarding'
import {
  useStore,
} from '@/hooks'
import { ChannelDetailScreen } from '@/containers/channel'
import NetInfo from "@react-native-community/netinfo";
enableScreens()
const Stack = createNativeStackNavigator<MainStackParamList>()


const MainNavigator = () => {
  const store = useStore()
  const insets = useSafeAreaInsets()
  const  unsubscribe=() => {
    
    NetInfo.fetch().then(state => {
      console.log(state,"connection data ");
      store.setConnectionInfo(state);
      // if(state.isConnected === store.connectionInfo.isConnected){
      //   store.setConnectionInfo(state);
      // }
     
    })
  };

  React.useEffect(() => {

    const myTimeout = setTimeout(unsubscribe, 5000);

    return () => {
      clearTimeout(myTimeout);
    }

   // console.log(store.connectionInfo,"connectioninfo");
   
  },[store]);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          paddingTop: k.isAndroid ? insets.top : 0,
        },
      }}
    >
      {/* <Stack.Screen
        name="Onboarding"
        component={ChannelDetailScreen}
        options={{
          stackPresentation: 'fullScreenModal',
        }}
      /> */}
      
      <Stack.Screen  name = {store.isDeviceCode? "ChannelDetail" : "Onboarding"}
        component={ store.isDeviceCode? ChannelDetailScreen: OnboardingScreen}
        options={{
          stackPresentation: 'fullScreenModal',
        }}
        initialParams={{ itemId: store.connectionInfo }}
      />
      <Stack.Screen name="Main" component={DrawerNavigation} />
      <Stack.Screen
        name="Channel"
        component={ChannelNavigator}
        options={{
          stackPresentation: 'fullScreenModal',
          stackAnimation: k.isAndroid ? 'fade' : 'default',
        }}
      />
      <Stack.Screen
        name="MediaPlayer"
        component={VideoPlayerScreen}
        options={{
          stackPresentation: 'fullScreenModal',
          stackAnimation: k.isAndroid ? 'fade' : 'default',
        }}
      />
      <Stack.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          stackPresentation: 'fullScreenModal',
          stackAnimation: k.isAndroid ? 'fade' : 'default',
        }}
      />
    </Stack.Navigator>
  )
}

export default MainNavigator
