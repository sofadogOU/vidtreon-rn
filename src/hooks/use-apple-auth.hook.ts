import * as React from 'react'
import {
  appleAuth,
  AppleRequestResponse,
} from '@invertase/react-native-apple-authentication'
import * as Sentry from '@sentry/react-native'

export enum AppleCredentialState {
  'REVOKED' = 0,
  'AUTHORIZED',
  'NOT_FOUND',
  'TRANSFERRED',
}

export const useAppleAuth = () => {
  React.useEffect(() => {
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    if (appleAuth.isSupported) {
      return appleAuth.onCredentialRevoked(async () => {
        signin()
      })
    }
  }, [])

  const signin = async (): Promise<AppleRequestResponse> => {
    try {
      const res = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })

      const credentialState = await appleAuth.getCredentialStateForUser(
        res.user
      )

      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        return res
      } else {
        throw new Error('APPLE NOT AUTHORISED')
      }
    } catch (e) {
      Sentry.captureException(e)
      return Promise.reject(e.message)
    }
  }

  const validate = async (
    userId: string
  ): Promise<AppleRequestResponse | undefined> => {
    try {
      if (userId === null) {
        return undefined
      } else {
        const res = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.REFRESH,
          user: userId,
        })
        const credentialState = await appleAuth.getCredentialStateForUser(
          res.user
        )
        if (credentialState === appleAuth.State.AUTHORIZED) {
          return res
        } else {
          throw new Error('APPLE NOT AUTHORISED')
        }
      }
    } catch (e) {
      Sentry.captureException(e)
      return Promise.reject(e.message)
    }
  }

  return { validate, signin }
}
