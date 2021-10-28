import * as React from 'react'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'
import { IapHubProductInformation } from 'react-native-iaphub'
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-spinkit'
import { ScrollView } from 'react-native-gesture-handler'

import { MainStackNavigationProp } from '@/typings/navigators'
import * as k from '@/utils/constants'

import { useIAP, ProductInfo, useBalance } from '@/hooks'
import { useTranslation } from '@/providers/TranslationProvider'

import { Icon, EmptyStateView } from '@/components'

import CoinsImage from '@/assets/images/coins.png'
import { ViewStyle } from 'react-native'

interface Props {
  navigation: MainStackNavigationProp<'Shop'>
}

export const ShopScreen = ({ navigation }: Props) => {
  const i18n = useTranslation()
  const insets = useSafeAreaInsets()
  const theme = useTheme()

  const { data: balance, refetch: refetchBalance } = useBalance()
  const iap = useIAP()

  const [isLoading, setLoading] = React.useState(true)
  const [isBusy, setBusy] = React.useState(false)
  const [consumables, setConsumables] = React.useState<
    ProductInfo[] | undefined
  >()
  const [renewables, setRenewables] = React.useState<
    ProductInfo[] | undefined
  >()

  const [selectedIndex, setSelectedIndex] = React.useState(1)

  const [isMonthly, setMonthly] = React.useState(true)

  const handlePurchase = async () => {
    try {
      if (renewables && consumables) {
        setBusy(true)
        await iap.buy(
          isMonthly
            ? renewables[selectedIndex].sku
            : consumables[selectedIndex].sku
        )
        await refetchBalance()
        setBusy(false)
      }
    } catch (e) {
      setBusy(false)
    }
  }

  const bootstrap = async () => {
    setLoading(true)
    try {
      await iap.init()
      const products = await iap.getProductsForSale()
      if (products && products.length > 0) {
        const consumables = products.filter(item => item.type === 'consumable')
        const renewables = products.filter(
          item => item.type === 'renewable_subscription'
        )
        setConsumables(consumables)
        setRenewables(renewables)
        setSelectedIndex(1)
      }
    } catch (e) {
      setConsumables([])
    }
  }

  React.useEffect(() => {
    bootstrap()
  }, [])

  const containerStyle = React.useMemo(
    () => ({ marginTop: k.isAndroid ? insets.top + k.sizes.md : 0 }),
    [insets]
  )

  const scrollContainerStyle: ViewStyle = React.useMemo(
    () => ({
      flex: 1,
    }),
    []
  )

  const renderCoins = React.useMemo(() => {
    return (
      <CoinsImg
        source={CoinsImage}
        resizeMode="contain"
        tintColor={theme.text.body}
      />
    )
  }, [theme])

  return (
    <Wrapper>
      <Container style={containerStyle}>
        <Header>
          <Title>{i18n.t('iap_title')}</Title>
          <CloseButton onPress={() => navigation.pop()}>
            <Icon name="close" size={22} color={theme.mutedBackgroundText} />
          </CloseButton>
        </Header>
        <Body>
          <BalanceTitle>{i18n.t('iap_balance')}</BalanceTitle>
          <BalanceWrapper>
            {renderCoins}
            <Balance>{balance || 0}</Balance>
          </BalanceWrapper>
          <Lead>{i18n.t('iap_intro')}</Lead>
          <Items contentContainerStyle={scrollContainerStyle as any}>
            <ItemsWrapper>
              {isLoading && !consumables && !renewables && (
                <Spinner type="Pulse" size={100} color={theme.backgroundAlt} />
              )}
              {consumables?.length === 0 && renewables?.length === 0 && (
                <EmptyWrapper>
                  <EmptyStateView
                    title="No products available"
                    description="Please try again later"
                  />
                </EmptyWrapper>
              )}
              {consumables &&
                consumables?.length > 0 &&
                renewables &&
                renewables.length > 0 && (
                  <>
                    <SectionTitle>{i18n.t('iap_most_popular')}</SectionTitle>
                    <ItemsContainer>
                      {(isMonthly ? renewables : consumables).map(
                        (item, index) => {
                          const title = item.title
                            .toLowerCase()
                            .split('coins')[0]
                            .trim()
                          const selected = selectedIndex === index
                          return (
                            <Item
                              key={item.id}
                              selected={selected}
                              onPress={() => setSelectedIndex(index)}
                            >
                              <ItemTitle selected={selected}>
                                {title} {i18n.t('iap_coins')}
                              </ItemTitle>
                              <ItemPrice selected={selected}>
                                {item.price}
                              </ItemPrice>
                            </Item>
                          )
                        }
                      )}
                    </ItemsContainer>
                    <TypeButtonContainer>
                      <TypeButton
                        selected={!isMonthly}
                        onPress={() => setMonthly(false)}
                      >
                        <TypeLabel selected={!isMonthly}>Just once</TypeLabel>
                      </TypeButton>
                      <TypeButton
                        selected={isMonthly}
                        onPress={() => setMonthly(true)}
                      >
                        <TypeLabel selected={isMonthly}>Monthly</TypeLabel>
                      </TypeButton>
                    </TypeButtonContainer>
                  </>
                )}
            </ItemsWrapper>
          </Items>
          {consumables &&
            consumables.length > 0 &&
            renewables &&
            renewables.length > 0 && (
              <PurchaseButton onPress={handlePurchase}>
                {isBusy ? (
                  <Spinner
                    type="ThreeBounce"
                    color="white"
                    style={{
                      marginTop: k.isAndroid ? 0 : -11,
                    }}
                  />
                ) : (
                  <PurchaseButtonLabel>
                    {i18n.t('iap_purchase')}
                  </PurchaseButtonLabel>
                )}
              </PurchaseButton>
            )}
        </Body>
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.SafeAreaView`
  ${tw(`flex-1`)};
`
const Container = styled.View`
  ${tw(`px-4 flex-1`)}
`
const Header = styled.View`
  ${tw(`h-11 items-center justify-center`)}
`
const Title = styled.Text`
  ${tw(`text-base font-bold`)};
  color: ${({ theme }) => theme.text.body};
`
const CloseButton = styled.TouchableOpacity`
  ${tw(
    `absolute top-0 right-0 h-9 w-9 
    items-center justify-center rounded-full`
  )};
  background-color: ${({ theme }) => theme.mutedBackground};
`
const Body = styled.View`
  ${tw(`mt-3 flex-1 pb-4`)}
`
const Lead = styled.Text`
  ${tw(`text-sm text-center px-6`)};
  color: ${({ theme }) => theme.text.body};
`
const BalanceWrapper = styled.View`
  ${tw(`flex-row justify-center items-center pb-4 mt-2 mb-6 border-b`)};
  border-color: ${({ theme }) => theme.text.body};
`
const Balance = styled.Text`
  ${tw(`text-center font-thin`)};
  font-size: 60px;
  color: ${({ theme }) => theme.text.body};
`
const BalanceTitle = styled.Text`
  ${tw(`w-full text-center text-base`)};
  color: ${({ theme }) => theme.text.body};
`
const CoinsImg = styled(FastImage)`
  ${tw(`h-11 w-11 mr-2`)};
`
const Items = styled(ScrollView)`
  ${tw(`flex-1`)}
`
const ItemsWrapper = styled.View`
  ${tw(`flex-1 items-center justify-center`)}
`
const ItemsContainer = styled.View`
  ${tw(`w-full flex-row justify-between`)}
`
const SectionTitle = styled.Text`
  ${tw(`text-base font-bold mb-4`)};
  color: ${({ theme }) => theme.text.body};
`
const Item = styled.TouchableOpacity<{ selected: boolean }>`
  ${tw(
    `justify-between items-center w-full 
    rounded-sm p-3`
  )};
  width: ${(k.screen.w - 48) / 3};
  border-color: ${({ theme }) => theme.text.muted};
  border-width: ${({ selected }) => (selected ? 0 : 1)}px;
  background-color: ${({ selected, theme }) =>
    selected ? theme.secondary.tint : theme.background};
`
const ItemTitle = styled.Text<{ selected: boolean }>`
  ${tw(`text-base`)};
  color: ${({ selected, theme }) => (selected ? theme.white : theme.text.body)};
`
const ItemPrice = styled.Text<{ selected: boolean }>`
  ${tw(`text-sm text-gray-400`)};
  color: ${({ selected, theme }) =>
    selected ? theme.white : theme.text.muted};
`
const PurchaseButton = styled.TouchableOpacity`
  ${tw(`h-11 items-center justify-center rounded-full`)};
  background-color: ${({ theme }) => theme.primary.tint};
`
const PurchaseButtonLabel = styled.Text`
  ${tw(`text-white text-base font-semibold`)};
`
const EmptyWrapper = styled.View`
  ${tw(`w-full h-full`)}
`
const TypeButtonContainer = styled(ItemsContainer)`
  ${tw(`justify-between`)}
`
const TypeButton = styled(Item)`
  ${tw(`mt-2 rounded-sm`)}
  width: ${(k.screen.w - 40) / 2};
`
const TypeLabel = styled(ItemPrice)``
