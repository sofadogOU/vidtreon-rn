import React from 'react'
import { RefreshControl } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import { TabNavigationProp } from '@/typings/navigators'

import { useTranslation } from '@/providers/TranslationProvider'
import { useNotifications, useReadNotification } from '@/hooks'

import { EmptyStateView, TitleBar, ActivityList } from '@/components'

interface Props {
  navigation: TabNavigationProp<'Activity'>
}

export const ActivityScreen = ({ navigation }: Props) => {
  const i18n = useTranslation()
  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    refetch: refetchNotifications,
  } = useNotifications()
  const readNotification = useReadNotification()

  const [isRefreshing, setRefreshing] = React.useState(false)

  React.useEffect(() => markAllRead(), [])

  React.useEffect(() => {
    if (isRefreshing) {
      setRefreshing(notificationsLoading)
    }
  }, [isRefreshing, notificationsLoading])

  const markAllRead = () => {
    notificationsData?.forEach(item => {
      readNotification.mutate({ notificationId: item.id })
    })
  }

  const handleItemPress = (id: string) => {
    navigation.dangerouslyGetParent()?.navigate('MediaPlayer', { id })
  }

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true)
    refetchNotifications()
  }, [refetchNotifications])

  const refreshControl = React.useMemo(
    () => (
      <RefreshControl
        refreshing={isRefreshing}
        enabled
        onRefresh={handleRefresh}
      />
    ),
    [isRefreshing, handleRefresh]
  )

  return (
    <Wrapper>
      <TitleBar title={i18n.t('label_activities')} />
      {notificationsData && notificationsData.length > 0 ? (
        <ActivityList
          items={notificationsData}
          onItemPress={handleItemPress}
          refreshControl={refreshControl}
        />
      ) : (
        <EmptyStateView
          title={i18n.t('empty_title')}
          description={i18n.t('empty_activity')}
        />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.View`
  ${tw(`flex-1`)}
`
