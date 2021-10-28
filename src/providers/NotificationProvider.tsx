import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react'
import * as Sentry from '@sentry/react-native'
// import branch from 'react-native-branch'

import notifee, {
  IOSAuthorizationStatus,
  Event as notifeeEvent,
  EventType as notifeeEventType,
} from '@notifee/react-native'
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging'

type ContextProps = {
  hasPermission: boolean
}
export const NotificationContext = createContext<ContextProps>(
  {} as ContextProps
)

interface Props {
  children: React.ReactNode
}

const NotificationProvider = ({ children }: Props) => {
  const [hasPermission, setPermission] = useState(false)
  const [loading, setLoading] = useState(false)

  const onMessageReceived = async ({
    notification,
  }: FirebaseMessagingTypes.RemoteMessage) => {
    try {
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      })

      await notifee.displayNotification({
        title: notification?.title || '',
        body: notification?.body || '',
        android: {
          channelId,
        },
        ios: {
          sound: 'default',
        },
      })
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  const onForegroundEvent = async ({ type, detail }: notifeeEvent) => {
    switch (type) {
      case notifeeEventType.DISMISSED:
        console.log('USER DISMISSED NOTIFICATION', detail.notification)
        break
      case notifeeEventType.PRESS:
        console.log('USER PRESSED NOTIFICATION', detail.notification)
        break
    }
    await notifee.setBadgeCount(0)
  }

  const onBackgroundEvent = async ({ type, detail }: notifeeEvent) => {
    const { notification, pressAction } = detail
    // Check if the user pressed the "Mark as read" action
    if (
      type === notifeeEventType.ACTION_PRESS &&
      pressAction?.id === 'mark-as-read'
    ) {
      // Remove the notification
      if (notification?.id) {
        await notifee.cancelNotification(notification.id)
      }
    }
    await notifee.setBadgeCount(0)
  }

  async function requestUserPermission() {
    try {
      const settings = await notifee.requestPermission()
      return settings.authorizationStatus >= IOSAuthorizationStatus.AUTHORIZED
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  const getFCMToken = async () => {
    try {
      // await messaging().registerDeviceForRemoteMessages()
      const fcmToken = await messaging().getToken()
      // console.log(fcmToken)
      return fcmToken
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  const initNotifications = useCallback(async () => {
    const permissionGranted = await requestUserPermission()
    if (permissionGranted) {
      const fcmToken = await getFCMToken()
      if (fcmToken) {
        // console.log(fcmToken)
        setPermission(true)
      }
    }
  }, [])

  const bootstrap = async () => {
    const initialNotification = await notifee.getInitialNotification()

    if (initialNotification) {
      console.log(
        'Notification caused application to open',
        initialNotification.notification
      )
      console.log(
        'Press action used to open the app',
        initialNotification.pressAction
      )
    }
  }

  useEffect(() => {
    notifee.setBadgeCount(0)
  }, [])

  useEffect(() => {
    initNotifications()
  }, [initNotifications])

  notifee.onBackgroundEvent(onBackgroundEvent)
  notifee.onForegroundEvent(onForegroundEvent)

  useEffect(() => {
    messaging().onMessage(onMessageReceived)
    messaging().setBackgroundMessageHandler(onMessageReceived)
    // notifee.onBackgroundEvent(onBackgroundEvent)
    // notifee.onForegroundEvent(onForegroundEvent)
  }, [])

  useEffect(() => {
    bootstrap()
      .then(() => setLoading(false))
      .catch(console.error)
  }, [])

  const contextValue = {
    hasPermission,
  }

  return loading ? null : (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
export default NotificationProvider
