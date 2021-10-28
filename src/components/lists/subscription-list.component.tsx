import * as React from 'react'
import { StyleSheet, Alert } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import sumBy from 'lodash-es/sumBy'
import {
  RecyclerListView,
  LayoutProvider,
  DataProvider,
} from 'recyclerlistview'

import * as k from '@/utils/constants'
import {
  useSubscriptions,
  useSubscribe,
  Channel,
  useUnsubscribe,
} from '@/hooks'
import { useTranslation } from '@/providers/TranslationProvider'

import { SubscriptionItem } from './subscription-item.component'
import { EmptyStateView } from '../empty-state-view.component'
import { getEmptyArray } from '@/utils/misc-helpers.util'

const singleEmptyItem = getEmptyArray(10)

export const SubscriptionsList = () => {
  const i18n = useTranslation()

  const subscribe = useSubscribe()
  const unsubscribe = useUnsubscribe()
  const { data: subscriptionData } = useSubscriptions()

  React.useEffect(() => {
    const activeSubscriptions = subscriptionData?.filter(
      item => item.status !== 'cancelled'
    )
    if (activeSubscriptions) {
      setActiveSubscriptionData(activeSubscriptions)
    }
  }, [subscriptionData])

  const [isBusy, setBusy] = React.useState(false)
  const [activeSubscriptionData, setActiveSubscriptionData] = React.useState<
    Channel[]
  >([])
  const [indexUpdating, setIndexUpdating] = React.useState(-1)

  const dataProvider = React.useMemo(
    () => new DataProvider((r1, r2) => r1 !== r2),
    []
  )

  const [data, setData] = React.useState(
    dataProvider.cloneWithRows(subscriptionData || singleEmptyItem)
  )

  React.useEffect(() => {
    if (subscriptionData) {
      setData(dataProvider.cloneWithRows(subscriptionData))
    }
  }, [subscriptionData, dataProvider])

  const layoutProvider = new LayoutProvider(
    () => 1,
    (type, dim, index) => {
      dim.width = k.screen.w
      dim.height =
        index === (subscriptionData && subscriptionData.length - 1)
          ? 112 + k.sizes.defPadding
          : 112
    }
  )

  const renderRow = (type: string | number, item: Channel, index: number) => {
    return (
      <SubscriptionItem
        key={item.id}
        item={item}
        isLastChild={
          index === (subscriptionData && subscriptionData.length - 1)
        }
        onCancelPress={id => {
          setIndexUpdating(index)
          handleCancelPress(id)
        }}
        onSubscribePress={id => {
          setIndexUpdating(index)
          handleSubscribePress(id)
        }}
        showSpinner={isBusy && index === indexUpdating}
      />
    )
  }

  const handleCancelPress = async (feedId: string) => {
    try {
      setBusy(true)
      await unsubscribe.mutateAsync({ feedId })
      setTimeout(() => setBusy(false), 3000)
    } catch (e) {
      setBusy(false)
      Alert.alert(
        i18n.t(`creator_form_error_title`),
        i18n.t(`creator_form_error_message`)
      )
    }
  }

  const handleSubscribePress = async (feedId: string) => {
    try {
      setBusy(true)
      await subscribe.mutateAsync({ feedId })
      setTimeout(() => setBusy(false), 4000)
    } catch (e) {
      setBusy(false)
      Alert.alert(
        i18n.t(`creator_form_error_title`),
        i18n.t(`creator_form_error_message`)
      )
    }
  }

  return data && subscriptionData && subscriptionData.length > 0 ? (
    <Wrapper>
      <Header>
        <HeaderItem>
          <HeaderTextBold>{activeSubscriptionData.length}</HeaderTextBold>
          <HeaderText>Active Subscriptions</HeaderText>
        </HeaderItem>
        <HeaderItem>
          <HeaderTextBold>
            {sumBy(activeSubscriptionData, item => item.price)}
          </HeaderTextBold>
          <HeaderText>Coins per month</HeaderText>
        </HeaderItem>
      </Header>
      <RecyclerListView
        style={{ ...styles.container }}
        layoutProvider={layoutProvider}
        dataProvider={data}
        rowRenderer={renderRow}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      />
    </Wrapper>
  ) : (
    <EmptyStateView
      title={i18n.t('subscriptions_empty_title')}
      description={i18n.t('subscriptions_empty_description')}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 1,
    minWidth: 1,
    // height: k.sizes.hit,
    paddingHorizontal: 16,
  },
  contentContainer: {
    width: '100%',
    minHeight: k.sizes.hit,
    // height: k.sizes.hit,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const Wrapper = styled.View`
  ${tw(`flex-1`)}
`
const Header = styled.View`
  ${tw(`px-4 pt-4 pb-2`)};
  background-color: ${({ theme }) => theme.backgroundAlt};
`
const HeaderItem = styled.View`
  ${tw(`flex-row items-center justify-center pb-2`)}
`
const HeaderTextBold = styled.Text`
  ${tw(`mr-1 font-bold`)};
  color: ${({ theme }) => theme.text.body};
`
const HeaderText = styled.Text`
  ${tw(`text-sm`)};
  color: ${({ theme }) => theme.text.body};
`

// const Container = styled.View`
//   ${tw(`flex-1 items-center justify-center p-8`)};
// `
// const EmptyContainer = styled.View`
//   ${tw(`w-full items-center justify-center p-8 rounded-xl`)};
//   background-color: ${({ theme }) => theme.backgroundDark};
// `
// const EmptyTitle = styled.Text`
//   ${tw(`text-sm text-center font-bold mb-2`)};
//   color: ${({ theme }) => theme.text.body};
// `
// const EmptyDescription = styled.Text`
//   ${tw(`text-base text-center text-sm`)};
//   color: ${({ theme }) => theme.text.body};
// `
