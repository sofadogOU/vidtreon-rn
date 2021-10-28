import React from 'react'
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
  BottomTabNavigationOptions,
  BottomTabBarOptions,
} from '@react-navigation/bottom-tabs'
// import { useNavigation } from '@react-navigation/native'
import { DefaultTheme, useTheme } from 'styled-components/native'

import { TabParamList, TabBarKeys } from '@/typings/navigators'
// import { useShare } from '@/providers/ShareProvider'
// import { useAuth } from '@/providers/AuthProvider'

import { TabItem } from '@/components'

import { HomeNavigator } from './home.navigator'
import { ExploreNavigator } from './explore.navigator'
import { ProfileNavigator } from './profile.navigator'
import { CreatorNavigator } from './creator.navigator'

import { ActivityScreen } from '@/containers/activity'

const Tab = createBottomTabNavigator<TabParamList>()

const configScreenOptions = ({
  route,
}: BottomTabScreenProps<TabParamList>): BottomTabNavigationOptions => ({
  tabBarButton: props => (
    <TabItem testID={route.name} id={route.name as TabBarKeys} {...props} />
  ),
})

const configTabBarOptions = (theme: DefaultTheme): BottomTabBarOptions => {
  return {
    showLabel: false,
    style: {
      backgroundColor: theme.backgroundDark,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      elevation: 0,
    },
  }
}

export const TabNavigator = () => {
  const theme = useTheme()
  // const share = useShare()
  // const navigation = useNavigation()
  // const auth = useAuth()

  // useEffect(() => {
  //   if (share.deepLink?.domain === 'share_channel') {
  //     navigation.dangerouslyGetParent()?.navigate('Channel', {
  //       screen: 'ChannelDetail',
  //       params: { channelId: share.deepLink.id },
  //     })
  //     share.resetDeepLink()
  //   }
  // }, [share, navigation])

  return (
    <Tab.Navigator
      screenOptions={configScreenOptions}
      tabBarOptions={configTabBarOptions(theme)}
      initialRouteName={'Home'}
      lazy={true}
    >
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Explore" component={ExploreNavigator} />
      <Tab.Screen name="Create" component={CreatorNavigator} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  )
}
