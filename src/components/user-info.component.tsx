import * as React from 'react'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Haptics from 'react-native-haptic-feedback'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import * as k from '@/utils/constants'
import { User } from '@/hooks'

import CoinImg from '@/assets/images/coins-icon.png'

import { RemoteImage } from './remote-image.component'
import { Icon } from './icon.component'

interface Props {
  info: User
  balance: number
  // showIndicator: boolean
  // onBellPress?: () => void
  onUserPress?: () => void
  onBalancePress?: () => void
  onMenuPress?: () => void
}

export const UserInfo = ({
  info,
  balance,
  // showIndicator,
  // onBellPress,
  onUserPress,
  onBalancePress,
  onMenuPress,
}: Props) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  const containerStyle = {
    paddingTop: k.isAndroid ? 0 : insets.top,
    height: k.isAndroid
      ? k.sizes.headerHeight
      : k.sizes.headerHeight + insets.top,
  }

  const avatarImageStyle = {
    width: 44,
    height: 44,
    borderRadius: 9999,
  }

  const coinsImageStyle = {
    width: 20,
    height: 20,
    marginRight: 4,
  }

  const handleBalancePress = () => {
    Haptics.trigger('impactLight', k.hapticOptions)
    onBalancePress?.()
  }

  const handleMenuPress = () => {
    Haptics.trigger('impactLight', k.hapticOptions)
    onMenuPress?.()
  }

  return (
    <>
      <Spacer style={containerStyle} />
      <Container style={containerStyle}>
        <InfoWrapper>
          <TouchableWithoutFeedback
            onPress={onUserPress}
            containerStyle={{
              flexDirection: 'row',
            }}
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <RemoteImage source={info.avatarUrl} style={avatarImageStyle} />
            <DetailsWrapper>
              <PrimaryLabel numberOfLines={1} ellipsizeMode="tail">
                {info.firstName || 'Hmm...'}
              </PrimaryLabel>
              {info.username !== '' && (
                <SecondaryLabel numberOfLines={1} ellipsizeMode="tail">
                  {info.username}
                </SecondaryLabel>
              )}
            </DetailsWrapper>
          </TouchableWithoutFeedback>
        </InfoWrapper>
        <VCButton onPress={handleBalancePress}>
          <RemoteImage
            type="local"
            source={CoinImg}
            resizeMode="contain"
            style={coinsImageStyle}
            tintColor={theme.text.body}
          />
          <VCLabel>{balance}</VCLabel>
        </VCButton>
        {/* <NotificationButton onPress={onBellPress}>
          <Icon name="notifications" size="sm" color={theme.text.body} />
          {showIndicator && <Indicator />}
        </NotificationButton> */}
        <MenuButton onPress={handleMenuPress}>
          <Icon name="more" size="sm" color={theme.text.body} />
        </MenuButton>
      </Container>
    </>
  )
}

const Spacer = styled.View`
  ${tw(`top-0`)};
`
const Container = styled.View`
  ${tw(
    `absolute top-0 w-full flex-row 
    items-center px-4 border-b`
  )};
  background-color: ${({ theme }) => theme.backgroundDark};
  border-color: ${({ theme }) => theme.border};
`
const InfoWrapper = styled.View`
  ${tw(`flex-row flex-1 items-center`)}
`
const DetailsWrapper = styled.View`
  ${tw(`flex-1 mx-3`)}
`
const PrimaryLabel = styled.Text`
  ${tw(`text-base font-semibold capitalize flex-initial flex-shrink`)};
  color: ${({ theme }) => theme.text.body};
`
const SecondaryLabel = styled.Text`
  ${tw(`text-xs font-medium`)};
  color: ${({ theme }) => theme.text.muted};
`
const VCButton = styled.TouchableOpacity`
  ${tw(`h-10 flex-row rounded-full px-4 items-center justify-center mr-3`)};
  background-color: ${({ theme }) => theme.primary.shade};
`
const VCLabel = styled.Text`
  ${tw(`text-base font-bold`)};
  color: ${({ theme }) => theme.text.body};
`
const NotificationButton = styled.TouchableOpacity`
  ${tw(`h-10 w-10 mr-3 items-center justify-center`)};
`
// const Indicator = styled.View`
//   ${tw(`absolute right-1 top-1 w-2 h-2 rounded-full`)};
//   background-color: ${({ theme }) => theme.primary.tint};
// `
const MenuButton = styled(NotificationButton)`
  ${tw(`mx-0 rounded-lg`)};
  background-color: ${({ theme }) => theme.backgroundAlt};
`
