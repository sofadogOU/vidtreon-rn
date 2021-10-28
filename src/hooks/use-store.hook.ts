import create, { GetState, SetState, StateCreator, StoreApi } from 'zustand'
import MMKVStorage from 'react-native-mmkv-storage'
import { ColorSchemeName, Appearance } from 'react-native-appearance'
import { SocialDomains, User } from '@/hooks'

const MMKV = new MMKVStorage.Loader().initialize()
const defaultTheme = Appearance.getColorScheme() || 'light'

interface SessionStore extends Record<string, unknown> {
  token: string | null
  tokenDomain: SocialDomains | 'email' | null
  user: User | null
  theme: ColorSchemeName
  isVisitor: boolean
  setToken: (token: string | null) => void
  setTokenDomain: (domain: SocialDomains | 'email' | null) => void
  setUser: (user: User | null) => void
  setTheme: (theme: ColorSchemeName) => void
  setVisitor: (isVisitor: boolean) => void
}

const persist =
  <T extends Record<string, unknown>>(name: string, config: StateCreator<T>) =>
  (set: SetState<T>, get: GetState<T>, api: StoreApi<T>): T => {
    const state = config(
      payload => {
        set(payload)
        MMKV.setMap(name, payload)
      },
      get,
      api
    )

    return {
      ...state,
      ...MMKV.getMap(name),
    }
  }

export const useStore = create(
  persist<SessionStore>('sessionStore', (set, get) => ({
    token: null,
    tokenDomain: null,
    user: null,
    theme: defaultTheme,
    isVisitor: false,
    setToken: (payload: string | null) => {
      const state = get()
      set({ ...state, token: payload })
    },
    setTokenDomain: (payload: SocialDomains | 'email' | null) => {
      const state = get()
      set({ ...state, tokenDomain: payload })
    },
    setTheme: (payload: ColorSchemeName) => {
      const state = get()
      set({ ...state, theme: payload })
    },
    setUser: (payload: User | null) => {
      const state = get()
      set({ ...state, user: payload })
    },
    setVisitor: (payload: boolean) => {
      const state = get()
      set({ ...state, isVisitor: payload })
    },
  }))
)
