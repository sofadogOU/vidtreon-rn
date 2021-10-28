import { CompositeNavigationProp } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { NativeStackNavigationProp } from 'react-native-screens/native-stack'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { RouteProp } from '@react-navigation/native'
import { Setting } from './index'
import { Tag, VideoTypes, ListType, NewsItem } from '@/hooks'

/** Tab Navigator */
export type TabParamList = {
  Home: undefined
  Explore: undefined
  Create: undefined
  Activity: undefined
  Profile: undefined
}

export type TabBarKeys = keyof TabParamList

export type TabNavigationProp<K extends keyof TabParamList> =
  CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, K>,
    DrawerNavigationProp<DrawerParamList>
  >

export type TabRouteProp<K extends keyof TabParamList> = RouteProp<
  TabParamList,
  K
>

/** Main Stack Navigator */
export type MainStackParamList = {
  Main: undefined
  Auth: undefined
  Onboarding: { showAuth?: boolean }
  Channel: any
  MediaPlayer: { id: string }
  Shop: undefined
}

export type MainStackKeys = keyof MainStackParamList

export type MainStackNavigationProp<K extends keyof MainStackParamList> =
  NativeStackNavigationProp<MainStackParamList, K>

export type MainStackRouteProp<K extends keyof MainStackParamList> = RouteProp<
  MainStackParamList,
  K
>

/** Home Navigator */
export type HomeStackParamList = {
  Dashboard: undefined
  HomeGallery: { id: FeedTypes | VideoTypes; title: string; type: ListType }
}

export type HomeStackKeys = keyof HomeStackParamList

export type HomeStackNavigationProp<K extends keyof HomeStackParamList> =
  CompositeNavigationProp<
    NativeStackNavigationProp<HomeStackParamList, K>,
    TabNavigationProp<TabParamList>
  >

export type HomeStackRouteProp<K extends keyof HomeStackParamList> = RouteProp<
  HomeStackParamList,
  K
>

/** Drawer Navigator */
export type DrawerParamList = {
  Drawer: undefined
}

export type DrawerKeys = keyof DrawerParamList

export type DrawerNavigationProp<K extends keyof DrawerParamList> =
  DrawerNavigationProp<DrawerParamList, K>

export type DrawerRouteProp<K extends keyof DrawerParamList> = RouteProp<
  DrawerParamList,
  K
>

/** Explore Navigator */
export type ExploreStackParamList = {
  Explore: undefined
  ExploreGallery: { id: FeedTypes | VideoTypes; title: string; type: ListType }
  ExploreSearch:
    | { tagId?: string; tagsData?: Tag[]; categoryIds?: [] }
    | undefined
}

export type ExploreStackKeys = keyof ExploreStackParamList

export type ExploreStackNavigationProp<K extends keyof ExploreStackParamList> =
  CompositeNavigationProp<
    NativeStackNavigationProp<ExploreStackParamList, K>,
    TabNavigationProp<TabParamList>
  >

export type ExploreStackRouteProp<K extends keyof ExploreStackParamList> =
  RouteProp<ExploreStackParamList, K>

/** Profile Navigator */
type FieldEditType = 'username' | 'email'

export type ProfileStackParamList = {
  Profile: undefined
  ProfileDetail: { info: Setting }
}

export type ProfileStackKeys = keyof ProfileStackParamList

export type ProfileStackNavigationProp<K extends keyof ProfileStackParamList> =
  CompositeNavigationProp<
    NativeStackNavigationProp<ProfileStackParamList, K>,
    TabNavigationProp<TabParamList>
  >

export type ProfileStackRouteProp<K extends keyof ProfileStackParamList> =
  RouteProp<ProfileStackParamList, K>

/** Channel Navigator */
export type ChannelStackParamList = {
  ChannelDetail: { id: string }
}

export type ChannelStackKeys = keyof ChannelStackParamList

export type ChannelStackNavigationProp<K extends keyof ChannelStackParamList> =
  CompositeNavigationProp<
    NativeStackNavigationProp<ChannelStackParamList, K>,
    TabNavigationProp<TabParamList>
  >

export type ChannelStackRouteProp<K extends keyof ChannelStackParamList> =
  RouteProp<ChannelStackParamList, K>

/** Creator Navigator */
export type CreatorStackParamList = {
  Creator: undefined
  CreatorVideos: undefined
  CreatorUpload: { feedId: string }
  CreatorEdit: { item: NewsItem }
}

export type CreatorStackKeys = keyof CreatorStackParamList

export type CreatorStackNavigationProp<K extends keyof CreatorStackParamList> =
  CompositeNavigationProp<
    NativeStackNavigationProp<CreatorStackParamList, K>,
    TabNavigationProp<TabParamList>
  >

export type CreatorStackRouteProp<K extends keyof CreatorStackParamList> =
  RouteProp<CreatorStackParamList, K>
