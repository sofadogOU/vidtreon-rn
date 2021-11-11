import * as React from 'react'
import * as Sentry from '@sentry/react-native'
import notifee, {
  IOSAuthorizationStatus,
  Event as notifeeEvent,
  EventType as notifeeEventType,
} from '@notifee/react-native'
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging'
import * as k from '@/utils/constants'

export const useNotificationProvider = () => {
  const [hasPermission, setPermission] = React.useState(false)
  const [deeplinkInfo, setDeeplinkInfo] = React.useState<string>()

  const onMessageReceived = async (
    props: FirebaseMessagingTypes.RemoteMessage
  ) => {
    console.log('OMR')
    console.log(props)
    if (props.data && props.data.video_id && !k.isAndroid) {
      setDeeplinkInfo(props.data.video_id)
    }
    try {
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      })

      await notifee.displayNotification({
        title: props.notification?.title || '',
        body: props.notification?.body || '',
        data: props.data,
        android: {
          channelId,
        },
      })

      if (k.isIOS) {
        await notifee.cancelAllNotifications()
      }
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  const onNotificationOpenedAppEvent = async (
    props: FirebaseMessagingTypes.RemoteMessage
  ) => {
    console.log('OPENED THE APP')
    console.log(props)
    const initialNotification = await notifee.getInitialNotification()
    if (initialNotification) {
      console.log('Initial Notifee')
      console.log(initialNotification)
      await notifee.cancelAllNotifications()
    } else {
      console.log('FCM')
      console.log(props)
      if (props.data && props.data.video_id) {
        setDeeplinkInfo(props.data.video_id)
      }
    }
  }

  const onForegroundEvent = async (props: notifeeEvent) => {
    switch (props.type) {
      case notifeeEventType.DISMISSED:
        console.log('USER DISMISSED NOTIFICATION', props.detail.notification)
        break
      case notifeeEventType.PRESS:
        {
          const { notification } = props.detail
          console.log('USER PRESSED NOTIFICATION', notification)
          if (notification?.data && notification.data.video_id) {
            setDeeplinkInfo(notification.data.video_id)
          }
        }
        break
    }
  }

  const onBackgroundEvent = async (props: notifeeEvent) => {
    const { notification, pressAction } = props.detail
    if (props.type === notifeeEventType.PRESS) {
      console.log(
        'USER PRESSED BACKGROUND NOTIFICATION',
        props.detail.notification
      )
      if (notification?.data && notification.data.video_id) {
        setDeeplinkInfo(notification.data.video_id)
      }
    }
    // Check if the user pressed the "Mark as read" action
    if (
      props.type === notifeeEventType.ACTION_PRESS &&
      pressAction?.id === 'mark-as-read'
    ) {
      // Remove the notification
      if (notification?.id) {
        await notifee.cancelNotification(notification.id)
        await notifee.setBadgeCount(0)
      }
    }
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
      await messaging().registerDeviceForRemoteMessages()
      const fcmToken = await messaging().getToken()
      console.log("ksdjskldj" + fcmToken)
      return fcmToken
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  const initNotifications = React.useCallback(async () => {
    const permissionGranted = await requestUserPermission()
    if (permissionGranted) {
      const fcmToken = await getFCMToken()
      if (fcmToken) {
        console.log(fcmToken)
        setPermission(true)
      }
    }
  }, [])

  const bootstrap = React.useCallback(async () => {
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
  }, [])

  React.useEffect(() => {
    notifee.setBadgeCount(0)
  }, [])

  React.useEffect(() => {
    initNotifications()
  }, [initNotifications])

  React.useEffect(() => {
    messaging().onMessage(onMessageReceived)
    messaging().setBackgroundMessageHandler(onMessageReceived)
    messaging().onNotificationOpenedApp(onNotificationOpenedAppEvent)
    notifee.onBackgroundEvent(onBackgroundEvent)
    notifee.onForegroundEvent(onForegroundEvent)
  }, [])

  const resetDeeplink = React.useCallback(() => setDeeplinkInfo(undefined), [])

  // React.useEffect(() => {
  //   bootstrap()
  //     .then(() => setReady(true))
  //     .catch(console.error)
  // }, [])

  // const isLoaded = React.useCallback(() => isReady, [isReady])

  return React.useMemo(
    () => ({ hasPermission, bootstrap, deeplinkInfo, resetDeeplink }),
    [hasPermission, bootstrap, deeplinkInfo, resetDeeplink]
  )
}
