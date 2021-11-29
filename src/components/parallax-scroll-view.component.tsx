import * as React from 'react'
import { Animated, View, Text, Alert } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { ScrollView } from 'react-native-gesture-handler'
import Haptics from 'react-native-haptic-feedback'
import MaskView from '@react-native-masked-view/masked-view'
import Spinner from 'react-native-spinkit'
import faker from 'faker'

import {
  UserInfo,
} from '@/components'

import {
  useStore,
  useBalance,
} from '@/hooks'

import * as k from '@/utils/constants'

import { useTranslation } from '@/providers/TranslationProvider'
import { Icon } from './icon.component'
import { LinePlaceholder } from './placeholders.component'
import { RemoteImage } from './remote-image.component'
import CoinImg from '@/assets/images/coins-icon.png'

import CoinsIcon from '@/assets/images/coins-icon.png'

const RNGHScrollView = Animated.createAnimatedComponent(ScrollView)
const AnimatedMaskView = Animated.createAnimatedComponent(MaskView)

interface Props {
  children: React.ReactNode
  avatarUrl: string
  coverUrl: string
  title?: string
  backBtnColor?: string
  subscriptionBtnText?: string
  donationBtnText?:string
  mobileBackgroundColor?: string
  followerCount?: string
  price?: number
  subscribed?: boolean
  showButtonSpinner?: boolean
  onBackPress: () => void
  onDetailPress: () => void
  onPurchasePress: () => void
  onBalancePress?: () => void
  
  
}

const HEADER_MAX_HEIGHT = 300
const HEADER_MIN_HEIGHT = k.isAndroid ? 200 : 230
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT


export const ParallaxScrollView = ({
  children,
  title,
  avatarUrl,
  coverUrl,
  followerCount,
  price,
  onBackPress,
  onDetailPress,
  onPurchasePress,
  onBalancePress,
  backBtnColor,
  subscriptionBtnText,
  donationBtnText,
  mobileBackgroundColor,
  subscribed = false,
  showButtonSpinner = false,
}: Props) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const i18n = useTranslation()
  const { data: balance } = useBalance()

  // const balance = 200
   
  const getUserState = React.useCallback(
    state => ({
      user: state.user,
    }),
    []
  )
  const { user } = useStore(getUserState)
   
  const _scrollY = React.useRef(
    new Animated.Value(k.isAndroid ? 0 : -HEADER_MAX_HEIGHT)
  )

  const scrollY = Animated.add(
    _scrollY.current,
    k.isAndroid ? 0 : HEADER_MAX_HEIGHT
  )

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  })

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0.8],
    extrapolate: 'clamp',
  })

  const headerMaskHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  })

  const GRADIENT_PROPS = {
    colors: ['#000000ff', '#000000aa', '#00000000'],
    locations: [0, 0.3, 0.95],
  }

  const handlePurchasePress = () => {
    Haptics.trigger('impactLight', k.hapticOptions)
    console.log("lap")
    onPurchasePress()
  }

  const handleDetailPress = () => {
    Haptics.trigger('impactLight', k.hapticOptions)
    onDetailPress()
  }

  const handleBalancePress = () => {
    Haptics.trigger('impactLight', k.hapticOptions)
    onBalancePress?.()
  }

  const handleDonationPress = () => {
    Haptics.trigger('impactLight', k.hapticOptions)
    putDonationIncrement()
    Alert.alert("Oooops! their has been a error  handling your donation")
  }

  const putDonationIncrement = () => {
    fetch('https://settings.vidtreon.com/donation/count/increment', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  }).then((response) => response.json())
  .then((rsn) => {
     console.log("donation response" + rsn) 
  })
  .catch((error) => {
    console.error(error);
  });
  }
   
  return (
    <Container>      
      <AnimatedScrollView
        contentContainerStyle={{
          paddingBottom: k.isAndroid ? HEADER_MAX_HEIGHT : 0,
        }}
        style={{
          paddingTop: k.isAndroid ? HEADER_MAX_HEIGHT : 0,
        }}
        scrollEventThrottle={1}
        contentInset={{
          top: HEADER_MAX_HEIGHT,
        }}
        contentOffset={{
          y: -HEADER_MAX_HEIGHT,
          x: 0,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: _scrollY.current } } }],
          { useNativeDriver: true }
        )}
      >
        <ContentContainer>{children}</ContentContainer>
        
      </AnimatedScrollView>
      <AnimatedHeader
        pointerEvents="box-none"
        style={{
          height: HEADER_MAX_HEIGHT,
          transform: [{ translateY: headerTranslate }],
        }}
      >
        <AnimatedMask
          style={{
            opacity: imageOpacity,
            width: '100%',
            height: HEADER_MAX_HEIGHT,
            transform: [{ translateY: headerMaskHeight }],
          }}
          maskElement={
            <MaskElement>
              <MaskGradient {...GRADIENT_PROPS} />
            </MaskElement>
          }
        >
          <CoverImageWrapper>
            <RemoteImage source={coverUrl} resizeMode="cover" />
          </CoverImageWrapper>
        </AnimatedMask>
   
        <Header>
          <HeaderWrapper>
            <AvatarWrapper>
              <RemoteImage source={avatarUrl} resizeMode="cover" />
            </AvatarWrapper>
            <TextWrapper>
              {title ? (
                <ChannelTitle numberOfLines={1} ellipsizeMode="tail">
                  {title}
                </ChannelTitle>
              ) : (
                <LinePlaceholder />
              )}
              {followerCount && (
                <FollowersLabel>
                  {followerCount} {i18n.t('channel_followers')}
                </FollowersLabel>
              )}
            </TextWrapper>
        
 
          </HeaderWrapper>

          
          {price >= balance ?<View style = {{paddingRight: 20}}>  
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
        </View>:<ActionsContainer>
            {price !== undefined && !subscribed && (
              <ActionWrapper>
                <Action
                  onPress={handlePurchasePress}
                  style={{backgroundColor: backBtnColor}}
                  disabled={showButtonSpinner}
                >
                  {!showButtonSpinner ? (
                    <>
                      {/* <ActionLabel>
                        {price !== 0
                          ? `${i18n.t('channel_subscribe')} ${price}`
                          : i18n.t('channel_subscribe_free')}
                      </ActionLabel> */}

                      <ActionLabel>
                        {subscriptionBtnText}
                      </ActionLabel>
                      {/* {price !== 0 && (
                        <RemoteImage
                          type="local"
                          source={CoinsIcon}
                          resizeMode="contain"
                          tintColor={theme.text.light}
                          style={{ height: 20, width: 20, marginLeft: 4 }}
                        />
                      )} */}
                      {/* {price !== 0 && <ActionSuffix>p/m</ActionSuffix>} */}
                    </>
                  ) : (
                    <Spinner
                      type="ThreeBounce"
                      color="white"
                      style={{
                        marginTop: k.isAndroid ? 0 : -8,
                      }}
                    />
                  )}
                </Action>
              </ActionWrapper> 
            )}
            {subscribed && (
              <ActionWrapper>
                <Action
                  disabled
                  style={{ backgroundColor: theme.secondary.tint }}
                >
                  <ActionLabel>{i18n.t('label_subscribed')}</ActionLabel>
                  <Icon
                    name="tick"
                    size="xs"
                    containerStyle={{ marginLeft: 8 }}
                  />
                </Action>
              </ActionWrapper>
            )}
            {/* <MenuAction onPress={handleDetailPress}>
              <Icon name="more" color={theme.mutedBackgroundText}/>
            </MenuAction> */}
          </ActionsContainer>}
         {/* {balance >=70 && 
          } */}
            {<ActionsContainer style={{marginTop:10}} >
            {price !== undefined && !subscribed && (
              <ActionWrapper  >
                <Action
                  onPress={handleDonationPress}
                  style={{backgroundColor: backBtnColor}}
                  disabled={showButtonSpinner}
                >
                  {!showButtonSpinner ? (
                    <>
                      <ActionLabel>
                        {donationBtnText}
                      </ActionLabel>
                     
                    </>
                  ) : (
                    <Spinner
                      type="ThreeBounce"
                      color="white"
                      style={{
                        marginTop: k.isAndroid ? 0 : -8,
                      }}
                    />
                  )}
                </Action>
              </ActionWrapper> 
            )}
            {subscribed && (
              <ActionWrapper>
                <Action
                  disabled
                  style={{ backgroundColor: theme.secondary.tint }}
                >
                  <ActionLabel>{i18n.t('label_subscribed')}</ActionLabel>
                  <Icon
                    name="tick"
                    size="xs"
                    containerStyle={{ marginLeft: 8 }}
                  />
                </Action>
              </ActionWrapper>
            )}
          
          </ActionsContainer>}
        </Header>
        
      </AnimatedHeader>
      <Text>
        </Text>
      <AnimatedBar
        style={{
          marginTop: insets.top,
        }}
      >
        {/* <CloseButton onPress={onBackPress}>
          <Icon name="close" size={22} color={theme.mutedBackgroundText} />
        </CloseButton> */}
      </AnimatedBar>
    </Container>
  )
}

const Container = styled.View`
  ${tw(`absolute inset-0`)}
`
const AnimatedScrollView = styled(RNGHScrollView)`
  ${tw(`flex-1`)}
`
const ContentContainer = styled.View``
const AnimatedHeader = styled(Animated.View)`
  ${tw(`absolute top-0 inset-x-0 overflow-hidden`)};
  background-color: ${({ theme }) => theme.background};
`
const AnimatedBar = styled(Animated.View)`
  ${tw(
    `absolute inset-x-0 top-0 h-8 mt-7 
    items-center justify-end bg-transparent
    flex-row px-4`
  )}
`
const AnimatedMask = styled(AnimatedMaskView)`
  ${tw(`absolute inset-x-0 top-0`)};
`
const CoverImageWrapper = styled.View`
  ${tw(`absolute inset-0`)};
`
const MaskElement = styled.View`
  ${tw(`absolute inset-0 bg-transparent`)};
`
const MaskGradient = styled(LinearGradient)`
  ${tw(`w-full h-full`)}
`
const Header = styled.View`
  ${tw(
    `absolute bottom-0 left-0 right-0 mx-4 my-6 flex-col 
    justify-center items-start`
  )}
`
const HeaderWrapper = styled.View`
  ${tw(`flex-row items-center h-12 mb-4`)}
`
const AvatarWrapper = styled.View`
  ${tw(`relative w-12 h-12 rounded-full mr-2 overflow-hidden`)}
`
const ChannelTitle = styled.Text`
  ${tw(`text-sm font-semibold`)};
  color: ${({ theme }) => theme.text.body};
`
const FollowersLabel = styled.Text`
  ${tw(`text-xs font-light`)};
  color: ${({ theme }) => theme.text.body};
`
const TextWrapper = styled.View`
  ${tw(`flex-1`)}
`
const CloseButton = styled.TouchableOpacity`
  ${tw(`w-9 h-9 items-center justify-center rounded-full`)};
  background-color: ${({ theme }) => theme.mutedBackground};
`
const ActionWrapper = styled.View`
  ${tw(`flex-1 flex-row items-center justify-center`)}
`
const Action = styled.TouchableOpacity`
  ${tw(`h-10 w-full flex-row rounded-full px-4
  items-center justify-center`)};
  background-color: ${({ theme }) => theme.primary.tint};
  
`
const ActionLabel = styled.Text`
  ${tw(`text-base font-normal text-white`)}
`
const ActionSuffix = styled(ActionLabel)`
  ${tw(`ml-1`)}
`
const ActionsContainer = styled.View`
  ${tw(`flex-row justify-between`)}
`
const MenuAction = styled.TouchableOpacity`
  ${tw(`w-1/6 ml-3 rounded-full items-center justify-center bg-gray-400`)};
  background-color: ${({ theme }) => theme.mutedBackground};
`
const VCButton = styled.TouchableOpacity`
  ${tw(`h-10 flex-row rounded-full px-4 items-center justify-center mr-3`)};
  background-color: ${({ theme }) => theme.primary.shade};
`
const VCLabel = styled.Text`
  ${tw(`text-base font-bold`)};
  color: ${({ theme }) => theme.text.body};
`
const VCView = styled.Text`
  ${tw(`absolute my-20 w-1/3 ml-60 px-2`)};
  color: ${({ theme }) => theme.text.body};
`
const coinsImageStyle = {
  width: 20,
  height: 20,
  marginRight: 4,
}
