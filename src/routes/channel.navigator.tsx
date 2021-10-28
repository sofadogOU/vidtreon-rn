import React from 'react'
import { enableScreens } from 'react-native-screens'
import { createNativeStackNavigator } from 'react-native-screens/native-stack'

import { ChannelStackParamList } from '@/typings/navigators'
import { ChannelDetailScreen } from '@/containers/channel'

enableScreens()
const Stack = createNativeStackNavigator<ChannelStackParamList>()

export const ChannelNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ChannelDetail" component={ChannelDetailScreen} />
    </Stack.Navigator>
  )
}
