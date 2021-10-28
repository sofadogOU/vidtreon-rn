import React from 'react'
import { enableScreens } from 'react-native-screens'
import { createNativeStackNavigator } from 'react-native-screens/native-stack'

import { CreatorStackParamList } from '@/typings/navigators'

import {
  CreatorScreen,
  CreatorVideosScreen,
  CreatorUploadScreen,
  CreatorEditScreen,
} from '@/containers/creator'

enableScreens()
const Stack = createNativeStackNavigator<CreatorStackParamList>()

export const CreatorNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Creator" component={CreatorScreen} />
      <Stack.Screen name="CreatorVideos" component={CreatorVideosScreen} />
      <Stack.Screen name="CreatorUpload" component={CreatorUploadScreen} />
      <Stack.Screen name="CreatorEdit" component={CreatorEditScreen} />
    </Stack.Navigator>
  )
}
