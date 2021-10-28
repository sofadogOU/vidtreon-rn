import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import * as Sentry from '@sentry/react-native'

// import * as Apple from '@/services/authApple'
// import * as Google from '@/utils/authGoogle'
// import * as Facebook from '@/utils/authFacebook'
import { useLocalState } from './LocalStateProvider'
import { useApi as API } from '@/hooks'
import { SocialDomains } from '@/typings/Requests'
import { User } from '@/typings'

type AuthType = 'apple' | 'google' | 'facebook'

interface Context {
  doAuth: (provider: AuthType) => void
  isAuthenticated: boolean
  isUpdated: boolean
  isProcessing: boolean
  clear: () => void
}

const AuthContext = createContext({} as Context)

interface Props {
  children: React.ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const localState = useLocalState()
  const [isAuthenticated, setAuthenticated] = useState(false)
  const [isUpdated, setUpdated] = useState(false)
  const [isProcessing, setProcessing] = useState(false)
  const [socialToken, setSocialToken] = useState<string>()
  const [socialDomain, setSocialDomain] = useState<SocialDomains>()

  const [data, setData] = useState<User>()

  const { data: userData } = API.useSocialLogin({
    token: socialToken,
    domain: socialDomain,
  })

  const toggleAuth = useCallback(
    (user: User) => {
      localState.setUser(user)
      setProcessing(false)
    },
    [localState]
  )

  useEffect(() => {
    if (userData) {
      setData(userData)
    }
  }, [userData])

  useEffect(() => {
    if (data) {
      toggleAuth(data)
    }
  }, [data, toggleAuth])

  const checkAuthStatus = useCallback(async () => {
    // const appleToken =
    //   localState.user &&
    //   (await Apple.doSilentAuth(localState.user.token, handleError))
    // const googleToken =
    //   localState.user && (await Google.doSilentAuth(handleError))
    // const facebookToken =
    //   localState.user && (await Facebook.doSilentAuth(handleError))
    // if (appleToken) {
    //   setSocialDomain('apple')
    //   setSocialToken(appleToken)
    // } else if (googleToken) {
    //   setSocialDomain('google')
    //   setSocialToken(googleToken)
    // } else if (facebookToken) {
    //   setSocialDomain('facebook')
    //   setSocialToken(facebookToken)
    // }
    // setUpdated(true)
  }, [localState])

  const init = useCallback(async () => {
    // await Google.initAuth(handleError)
    // await Facebook.initAuth(handleError)
    // await checkAuthStatus()
  }, [checkAuthStatus])

  const handleError = (e: NodeJS.ErrnoException) => {
    setProcessing(false)
    const { code, message } = e
    if (code === 'ERR_CANCELED' || message.indexOf('USER_CANCELED') !== -1) {
      // TODO: user cancelled login prompt
    } else {
      Sentry.captureException(e)
    }
  }

  const doAuth = useMemo(
    () => async (provider: AuthType) => {
      let token
      setProcessing(true)
      switch (
        provider
        // case 'apple':
        //   token = await Apple.doAuth(handleError)
        //   setSocialDomain('apple')
        //   break
        // case 'google':
        //   token = await Google.doAuth(handleError)
        //   setSocialDomain('google')
        //   break
        // case 'facebook':
        //   token = await Facebook.doAuth(handleError)
        //   setSocialDomain('facebook')
        //   break
      ) {
      }
      if (token) {
        setSocialToken(token)
      }
    },
    []
  )

  const clear = useCallback(() => {
    setData(undefined)
    setAuthenticated(false)
    setUpdated(false)
    setSocialToken(undefined)
    setSocialDomain(undefined)
    localState.setUser(undefined)
    localState.setInitialSession(1)
  }, [localState])

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    setAuthenticated(localState.user !== undefined)
  }, [localState.user])

  const context = useMemo(
    () => ({
      doAuth,
      isAuthenticated,
      isUpdated,
      isProcessing,
      clear,
    }),
    [isAuthenticated, doAuth, isUpdated, clear, isProcessing]
  )

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
export default AuthProvider
