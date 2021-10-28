import React from 'react'
import { enableScreens } from 'react-native-screens'
import { createNativeStackNavigator } from 'react-native-screens/native-stack'

import { HomeStackParamList } from '@/typings/navigators'

import { HomeScreen } from '@/containers/home'
import { GalleryScreen } from '@/containers/gallery'

enableScreens()
const Stack = createNativeStackNavigator<HomeStackParamList>()

export const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="HomeGallery" component={GalleryScreen} />
    </Stack.Navigator>
  )
}
