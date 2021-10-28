import React from 'react'
import { enableScreens } from 'react-native-screens'
import { createNativeStackNavigator } from 'react-native-screens/native-stack'
import { useTheme } from 'styled-components/native'

import { ProfileScreen } from '@/containers/profile'
import { ProfileDetailScreen } from '@/containers/profile'

import { ProfileStackParamList } from '@/typings/navigators'

enableScreens()
const Stack = createNativeStackNavigator<ProfileStackParamList>()

export const ProfileNavigator = () => {
  const theme = useTheme()
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="ProfileDetail"
        component={ProfileDetailScreen}
        // options={{
        //   headerTitleStyle: {
        //     color: theme.text.body,
        //   },
        //   headerTintColor: theme.primary.tint,
        //   headerShown: true,
        // }}
      />
    </Stack.Navigator>
  )
}
