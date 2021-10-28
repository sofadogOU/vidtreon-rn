import * as React from 'react'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import { LinearGradient } from 'expo-linear-gradient'

import { TabBarKeys } from '@/typings/navigators'
import * as k from '@/utils/constants'

import { Icon } from './icon.component'

import HomeIcon from '@/assets/icons/tabbar/home.png'
import ExploreIcon from '@/assets/icons/tabbar/explore.png'
import ActivityIcon from '@/assets/icons/tabbar/activity.png'
import ProfileIcon from '@/assets/icons/tabbar/profile.png'

const TAB_COUNT = 5
const TAB_WIDTH = k.screen.w / TAB_COUNT
const ICON_SIZE = 22
const CENTER_ICON_HEIGHT = ICON_SIZE + 8

const mapIconImage = (id: TabBarKeys) => {
  switch (id) {
    case 'Home':
      return HomeIcon
    case 'Explore':
      return ExploreIcon
    case 'Activity':
      return ActivityIcon
    case 'Profile':
      return ProfileIcon
  }
}

interface Props extends BottomTabBarButtonProps {
  id: TabBarKeys
}

const TabIcon = ({ id, accessibilityState }: Props) => {
  const theme = useTheme()
  const isSelected = !!accessibilityState?.selected
  const iconFile = mapIconImage(id)
  const isCenterIcon = id === 'Create'

  return isCenterIcon ? (
    <CenterIcon colors={[theme.primary.tint, theme.primary.tint]}>
      <Icon name="plus" size="xs" />
    </CenterIcon>
  ) : (
    <IconImage selected={isSelected} source={iconFile} resizeMode="contain" />
  )
}

export const TabItem = (props: Props) => {
  const { onPress } = props
  return (
    <Button onPress={onPress}>
      <TabIcon {...props} />
    </Button>
  )
}

const Button = styled.TouchableOpacity`
  width: ${TAB_WIDTH}px;
  ${tw(`h-full justify-center items-center`)}
`
const CenterIcon = styled(LinearGradient)`
  height: ${CENTER_ICON_HEIGHT}px;
  width: ${k.sizes.hit}px;
  border-radius: ${CENTER_ICON_HEIGHT / 8}px;
  ${tw(`justify-center items-center rounded-sm`)}
`
const IconImage = styled.Image<{ selected: boolean }>`
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  tint-color: ${({ theme, selected }) =>
    selected ? theme.tab.active : theme.tab.inactive};
`
