import * as React from 'react'
import * as Facebook from 'react-native-fbsdk-next'
import * as Sentry from '@sentry/react-native'

// import * as k from '@/utils/constants'
// const { facebook } = k.authCredentials

export const useFacebookAuth = () => {
  React.useEffect(() => Facebook.Settings.initializeSDK(), [])

  const signin = async (): Promise<string> => {
    try {
      Facebook.Settings.initializeSDK()
      const auth = await Facebook.LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ])
      if (auth.grantedPermissions && auth.grantedPermissions.length > 0) {
        const token = await Facebook.AccessToken.getCurrentAccessToken()
        // const profile = await Facebook.Profile.getCurrentProfile()
        if (token) {
          return token.accessToken.toString()
        } else {
          throw new Error('NO TOKEN')
        }
      } else if (
        auth.declinedPermissions &&
        auth.declinedPermissions.length > 0
      ) {
        throw new Error(auth.declinedPermissions.toString())
      } else if (auth.isCancelled) {
        throw new Error('USER_CANCELED')
      } else {
        throw new Error('UNKNOWN_FB_ERROR')
      }
    } catch (e) {
      Sentry.captureException(e)
      return Promise.reject(e.message)
    }
  }

  const validate = async (): Promise<string> => {
    try {
      const token = await Facebook.AccessToken.getCurrentAccessToken()
      if (token) {
        return token.accessToken.toString()
      } else {
        throw new Error('NO TOKEN')
      }
    } catch (e) {
      Sentry.captureException(e)
      return Promise.reject(e.message)
    }
  }

  const logout = () => Facebook.LoginManager.logOut()

  return { validate, signin, logout }
}
