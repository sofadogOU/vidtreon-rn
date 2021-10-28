import React from 'react'
import { enableScreens } from 'react-native-screens'
import { createNativeStackNavigator } from 'react-native-screens/native-stack'

import { ExploreStackParamList } from '@/typings/navigators'

import { ExploreScreen } from '@/containers/explore'
import { GalleryScreen } from '@/containers/gallery'
import { SearchScreen } from '@/containers/search'

enableScreens()
const Stack = createNativeStackNavigator<ExploreStackParamList>()

export const ExploreNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Explore" component={ExploreScreen} />
      <Stack.Screen name="ExploreGallery" component={GalleryScreen} />
      <Stack.Screen name="ExploreSearch" component={SearchScreen} />
    </Stack.Navigator>
  )
}
