import * as React from 'react'
import { Alert } from 'react-native'
import * as Sentry from '@sentry/react-native'
import { firebase } from '@react-native-firebase/messaging'
import { useQueryClient } from 'react-query'

import * as transform from '@/hooks/apis/api.transformers'
import {
  // useAppleAuth,
  useGoogleAuth,
  useFacebookAuth,
  useStore,
  useSocialLogin,
  useNotificationProvider,
  useDeeplinkProvider,
} from '@/hooks'

import { SplashScreen } from '@/containers/splash'
import MainNavigator from './main.navigator'
import { SocialDomains } from '@/typings/Requests'
import * as k from '@/utils/constants'
// import { AppleRequestResponse } from '@invertase/react-native-apple-authentication'

export const AppNavigator = () => {
  const queryClient = useQueryClient()
  const [isReady, setReady] = React.useState(false)
  const [hideSplash, setHideSplash] = React.useState(false)
  const [notificationsReady, setNotificationsReady] = React.useState(false)

  // const appleAuth = useAppleAuth()
  const googleAuth = useGoogleAuth()
  const facebookAuth = useFacebookAuth()
  const socialLogin = useSocialLogin()
  const store = useStore()
  const notifications = useNotificationProvider()
  const deeplink = useDeeplinkProvider()

  const getAuthState = React.useCallback(
    state => ({
      currentCredentials: {
        token: state.token,
        tokenDomain: state.tokenDomain,
      },
    }),
    []
  )

  const { currentCredentials } = useStore(getAuthState)

  async function deviceCodeCheck() {
    try{
    let url = k.baseUrl+"/device/1"
    console.log(url,"=====88888");
    // const response = await fetch(`http://localhost:3000/device/1`);
    const response = await fetch(url);
    const json = await response.json();
    store.setLoginData(json);
    console.log(json,"json data");
    if(json.result=="ok1"){
      store.setDeviceCode(true);
     // store.isVisitor(true);
     let subcription =true;
    
     
     store.setSubcription(subcription);
    }else{
      store.setDeviceCode(false);
      let subcription = true ;
      store.setSubcription(subcription);
    }
    
    //return json;
    //console.log(json);
    }
    catch(err) {
      throw err;
      console.log(err);
    }
  }

//   const getData = async () => {
//     await fetch('http://localhost:3000/device/1',{
//          method: 'GET',
//          headers: {
//              Accept: 'application/json',
//              'Content-Type': 'application/json'
//          }
//      })
//      .then((response) => {
//          console.log('Response:')
//          console.log(response,"999999999")
//          let loginData = response.json();
//          store.setLoginData(response);
//          console.info('=================================')
//      })
//      .catch(err => console.error(err));
 
//  } 

  

  const logout = React.useCallback(async () => {
    // if (store.tokenDomain === 'facebook') {
    //   facebookAuth.logout()
    // }
    // if (store.tokenDomain === 'google') {
    //   await googleAuth.logout()
    // }
    store.setToken(null)
    store.setTokenDomain(null)
    store.setVisitor(false)
    store.setUser(null)
    queryClient.invalidateQueries()
    setReady(true)
  }, [store, queryClient])

  const refreshToken = React.useCallback(
    async (token: string, domain: SocialDomains) => {
      try {
        const fcmToken = await firebase.messaging().getToken()
        const res = await socialLogin.mutateAsync({
          token,
          domain,
          fcm_token: fcmToken,
        })
        if (res) {
          store.setToken(res.token)
          store.setTokenDomain(domain)
          store.setVisitor(false)
          store.setUser(transform.user(res.user))
          setReady(true)
        }
      } catch (e) {
        Sentry.captureException(e)
        Alert.alert('An error was encountered', 'Please try again later')
        logout()
      }
    },
    [socialLogin, store, logout]
  )

  const attemptSilentLogin = React.useCallback(async () => {
    const { tokenDomain, token } = currentCredentials
    try {
      switch (tokenDomain) {
        case 'apple': {
          /* TODO: DON'T REMOVE ME! 
          Revisit when lib has fixed refreshing token issue*/
          // const appleUser = await appleAuth.validate(token)
          // refreshToken(appleUser.user, tokenDomain)
          !!token && refreshToken(token, tokenDomain)
          break
        }
        case 'google': {
          const token = await googleAuth.validate()
          refreshToken(token, tokenDomain)
          break
        }
        case 'facebook': {
          const token = await facebookAuth.validate()
          refreshToken(token, tokenDomain)
          break
        }
      }
    } catch (e) {
      Sentry.captureException(e)
      logout()
    }
  }, [currentCredentials, googleAuth, facebookAuth, refreshToken, logout])

  const init = React.useCallback(() => {
    if (
      currentCredentials.tokenDomain !== 'email' &&
      currentCredentials.tokenDomain !== 'apple'
    ) {
      if (notificationsReady) {
        attemptSilentLogin()
      }
    }
  }, [currentCredentials, attemptSilentLogin, notificationsReady])

  /**
   * If Deeplink hide splash straight away
   */

  React.useEffect(() => {
     let loginData  = deviceCodeCheck();
    
     console.log(loginData,"dummy data");
      let    deviceStatusValue  =true;
      
   
    
     
    if (deeplink.info) {
      setReady(true)
    }
  }, [deeplink.info])

  /**
   * Init app
   */

  React.useEffect(() => {
    init()
  }, [notificationsReady])

  /**
   * If user is logged out &
   * notifications are ready, hide splash
   */

  React.useEffect(() => {
    if (!currentCredentials.token && notificationsReady) {
      setTimeout(() => setReady(true), 4000)
    }
  }, [currentCredentials, notificationsReady])

  /**
   * If user apple or email, no further auth required.
   * If notifications are ready, hide splash
   */

  React.useEffect(() => {
    if (
      currentCredentials.tokenDomain === 'email' ||
      currentCredentials.tokenDomain === 'apple'
    ) {
      if (notificationsReady) {
        setTimeout(() => setReady(true), 4000)
      }
    }
  }, [currentCredentials, notificationsReady])

  /**
   * Init Notifications
   */

  React.useEffect(() => {
    notifications
      .bootstrap()
      .then(() => setNotificationsReady(true))
      .catch(e => Sentry.captureException(e))
  }, [notifications])

  const handleAnimateEnd = (isFinished: boolean) => {
    if (isFinished) {
      setHideSplash(true)
    }
  }

  return (
    <>
      <MainNavigator />
      {!hideSplash && (
        <SplashScreen hide={isReady} onAnimationEnd={handleAnimateEnd} />
      )}
    </>
  )
}
