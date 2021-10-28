import { User } from '@/typings'
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react'
import { ColorSchemeName } from 'react-native-appearance'

interface Context {
  user?: User
  setUser: (user?: User) => void
  userTheme?: ColorSchemeName
  setUserTheme: (theme: ColorSchemeName) => void
  isInitialSession: boolean
  setInitialSession: (isInitial: 1 | -1) => void
}

const LocalStateContext = createContext({} as Context)

interface Props {
  children: React.ReactNode
}

const LocalStateProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | undefined>()
  const [isInitialSession, setInitialSession] = useState(true)
  const [userTheme, setUserTheme] = useState<ColorSchemeName>()

  const _setInitialSession = useCallback((isInitial: 1 | -1) => {
    // MMKV.set('session.initial', isInitial)
    setInitialSession(isInitial === 1)
  }, [])

  const _setUserTheme = useCallback((theme: ColorSchemeName) => {
    // MMKV.set('user.theme', theme as string)
    setUserTheme(theme)
  }, [])

  const _setUser = useCallback((user?: User) => {
    if (user === undefined) {
      // MMKV.delete('user.info')
    } else {
      // MMKV.set('user.info', JSON.stringify(user))
    }
    setUser(user)
  }, [])

  // useEffect(() => {
  //   // const storedIIS = MMKV.getNumber('session.initial')
  //   if (storedIIS === 0) {
  //     _setInitialSession(1)
  //   } else if (storedIIS === -1 || user !== undefined) {
  //     _setInitialSession(-1)
  //   }
  // }, [user, _setInitialSession])

  // useEffect(() => {
  //   // const storedUser = MMKV.getString('user.info')
  //   if (storedUser) {
  //     const user: User = JSON.parse(storedUser)
  //     setUser(user)
  //   }
  // }, [_setUser])

  // useEffect(() => {
  //   // const storedTheme = MMKV.getString('user.theme')
  //   if (storedTheme) {
  //     _setUserTheme(storedTheme as ColorSchemeName)
  //   }
  // }, [_setUserTheme])

  const context = useMemo(
    () => ({
      user,
      setUser: _setUser,
      userTheme,
      setUserTheme: _setUserTheme,
      isInitialSession,
      setInitialSession: _setInitialSession,
    }),
    [
      isInitialSession,
      _setInitialSession,
      userTheme,
      _setUserTheme,
      _setUser,
      user,
    ]
  )
  return (
    <LocalStateContext.Provider value={context}>
      {children}
    </LocalStateContext.Provider>
  )
}

export const useLocalState = () => useContext(LocalStateContext)
export default LocalStateProvider
