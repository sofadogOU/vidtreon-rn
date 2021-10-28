import * as React from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import * as Sentry from '@sentry/react-native'

import * as k from '@/utils/constants'

const { google } = k.authCredentials

export const useGoogleAuth = () => {
  React.useEffect(() => {
    init()
  }, [])

  const init = async () => {
    try {
      await GoogleSignin.configure({
        iosClientId: google.googleIosClientId,
        webClientId: k.isIOS
          ? google.googleIosClientId
          : google.googleAndroidClientId,
        offlineAccess: true,
      })
    } catch (e) {
      Sentry.captureException(e)
      return Promise.reject(e)
    }
  }

  const signin = async (): Promise<string> => {
    try {
      await init()
      await GoogleSignin.hasPlayServices()
      await GoogleSignin.signIn()
      const currentUser = await GoogleSignin.getTokens()
      return currentUser.idToken
    } catch (e) {
      Sentry.captureException(e)
      return Promise.reject(e.message)
    }
  }

  const validate = async (): Promise<string> => {
    try {
      await init()
      await GoogleSignin.signInSilently()
      const currentUser = await GoogleSignin.getTokens()
      return currentUser.idToken
    } catch (e) {
      Sentry.captureException(e)
      return Promise.reject(e.message)
    }
  }

  const logout = async (): Promise<undefined> => {
    try {
      // await GoogleSignin.revokeAccess()
      await GoogleSignin.signOut()
    } catch (e) {
      Sentry.captureException(e)
      return Promise.reject(e.message)
    }
  }

  return { signin, validate, logout }
}
