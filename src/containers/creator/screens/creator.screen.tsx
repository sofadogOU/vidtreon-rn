import React from 'react'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import Toast from 'react-native-toast-message'
import {
  CreatorStackNavigationProp,
  CreatorStackKeys,
} from '@/typings/navigators'

import * as k from '@/utils/constants'
import { useStore } from '@/hooks'

import { SafeWrapper, TitleBar, Icon, toastConfig } from '@/components'
import { CreatorFormScreen } from './creator-form.screen'

const ITEM_SIZE = (k.screen.w - k.sizes.defPadding * 2 - k.sizes.md) / 3

interface Props {
  navigation: CreatorStackNavigationProp<'Creator'>
}

export const CreatorScreen = (props: Props) => {
  const theme = useTheme()
  const getUserState = React.useCallback(
    state => ({
      user: state.user,
    }),
    []
  )

  const { user } = useStore(getUserState)

  const handleActionPress = (
    state?: 'unavailable' | 'available',
    route?: CreatorStackKeys
  ) => {
    if (state === 'unavailable') {
      Toast?.show({
        type: 'warn',
        visibilityTime: 2000,
        autoHide: true,
        position: 'top',
        text1: 'Unavailable',
        text2: `This feature is currently unavailable. \nPlease try again later.`,
      })
    } else if (route) {
      props.navigation.navigate(route)
    }
  }

  return user && user.creatorType === 'content_creator' ? (
    <>
      <TitleBar title="Creators" />
      <SafeWrapper>
        <Container>
          <Springboard>
            <Action
              onPress={() => handleActionPress('available', 'CreatorVideos')}
            >
              <IconWrapper>
                <Icon name="cVideos" color={theme.primary.tint} size={40} />
              </IconWrapper>
              <Label>Videos</Label>
            </Action>
            <Action isDisabled onPress={() => handleActionPress('unavailable')}>
              <IconWrapper>
                <Icon name="cChannel" color={theme.primary.tint} size={40} />
              </IconWrapper>
              <Label>Channel</Label>
            </Action>
            <Action isDisabled onPress={() => handleActionPress('unavailable')}>
              <IconWrapper>
                <Icon
                  name="cSubscribers"
                  color={theme.primary.tint}
                  size={40}
                />
              </IconWrapper>
              <Label>Subscribers</Label>
            </Action>
            <Action isDisabled onPress={() => handleActionPress('unavailable')}>
              <IconWrapper>
                <Icon name="cFinancial" color={theme.primary.tint} size={40} />
              </IconWrapper>
              <Label>Financial</Label>
            </Action>
            <Action isDisabled onPress={() => handleActionPress('unavailable')}>
              <IconWrapper>
                <Icon name="cAnalytics" color={theme.primary.tint} size={40} />
              </IconWrapper>
              <Label numberOfLines={1}>Analytics</Label>
            </Action>
          </Springboard>
        </Container>
      </SafeWrapper>
      <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
    </>
  ) : (
    <CreatorFormScreen />
  )
}

const Container = styled.View`
  ${tw(`flex-1 p-4 pr-2`)}
`
const Springboard = styled.View`
  ${tw(`flex-row flex-wrap flex-1`)}
`
const Action = styled.TouchableOpacity<{ isDisabled?: boolean }>`
  ${tw(`mb-2 rounded-xl items-center justify-center mr-2 p-4`)};
  width: ${ITEM_SIZE};
  height: ${ITEM_SIZE};
  background-color: ${({ theme }) => theme.backgroundDark};
  ${({ isDisabled }) => isDisabled && `opacity: 0.3`};
`
const IconWrapper = styled.View`
  ${tw(`flex-1 items-center justify-center`)}
`
const Label = styled.Text`
  ${tw(`text-xs font-semibold`)}
  color: ${({ theme }) => theme.text.body};
`
