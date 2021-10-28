import { Dimensions, Platform, StatusBar } from 'react-native'
import { isEmulator } from 'react-native-device-info'

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen')
const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

export const isAndroid = Platform.OS === 'android'
export const isIOS = Platform.OS === 'ios'
export const isSimulator = () => isEmulator()

const statusBarHeight = StatusBar.currentHeight ?? 0
export const navBarHeight = isAndroid
  ? screenHeight - (windowHeight + statusBarHeight)
  : 0

export const screen = {
  w: isAndroid ? windowWidth : screenWidth,
  h: isAndroid ? windowHeight + statusBarHeight : screenHeight,
}

export const appVersion = '3.0.0'

export const sizes = {
  hit: 40,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  defPadding: 16,
  headerHeight: 72,
  fieldHeight: 44,
}

export const authCredentials = {
  google: {
    // TODO: GOOGLE_IOS_CLIENT_ID Phase 3 test ID, replace with:
    // 844580151916-ut3cllcl14081khp2anua26t4550flrm.apps.googleusercontent.com
    googleIosClientId:
      '920734956176-07botff27cs9nrr3g3ohmrj6t1nvcno4.apps.googleusercontent.com',
    googleAndroidClientId:
      '920734956176-tc83loijmt4m8od94gfkhgj46jfbgbmk.apps.googleusercontent.com',
  },
  facebook: {
    appId: '311203853574729',
    secret: 'd5f50c0bdbfdf9ca8818e0d9228e0676',
  },
  iapHub: {
    appId: __DEV__ ? '5fb730eb70df310e9d96aeb4' : '5fb730eb70df310e9d96aeb4',
    apiKey: __DEV__
      ? 'YLyUe3xweRZEBK46QJOUVxzEyfTMm'
      : 'YLyUe3xweRZEBK46QJOUVxzEyfTMm',
  },
}

export const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
}

export const iapItems = {
  ios: {
    pack001: 'vc001',
    pack002: 'vc002',
    pack003: 'vc003',
  },
  android: {
    pack001: 'vc001',
    pack002: 'vc002',
    pack003: 'vc003',
  },
}

export const baseUrl = __DEV__
  ? 'https://x.so.fa.dog/dsa'
  : 'https://x.so.fa.dog/dsa'

export const nonDsaBaseUrl = __DEV__
  ? 'https://x.so.fa.dog'
  : 'https://x.so.fa.dog'
