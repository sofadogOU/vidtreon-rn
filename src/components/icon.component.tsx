import React from 'react'
import {} from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { StyleProp, ViewStyle } from 'react-native'
import { useTheme } from 'styled-components'

import * as Regular from '@fortawesome/pro-regular-svg-icons'
import * as Light from '@fortawesome/pro-light-svg-icons'
import * as Solid from '@fortawesome/pro-solid-svg-icons'
import * as Duo from '@fortawesome/pro-duotone-svg-icons'

import * as Social from '@fortawesome/free-brands-svg-icons'
import { InlineWrapper } from '@/components/wrappers.component'

const iconMap: Record<IconNamesEnum, Light.IconDefinition> = {
  // light icons
  home: Light.faHome,
  share: Light.faShareAlt,
  shareChannel: Light.faTvAlt,
  info: Light.faInfoCircle,
  unmute: Light.faVolume,
  mute: Light.faVolumeMute,
  drawer: Light.faBars,
  close: Light.faTimes,
  refresh: Light.faSync,
  link: Light.faLink,
  videoError: Light.faVideoSlash,
  miniMenu: Light.faEllipsisV,
  more: Light.faEllipsisH,
  closeCircle: Light.faTimesCircle,
  heart: Light.faHeart,
  comment: Light.faComment,
  camera: Light.faCamera,
  backArrow: Light.faArrowLeft,
  forward: Light.faRedo,
  backward: Light.faUndo,
  filter: Light.faSlidersH,
  channel: Light.faUser,
  videos: Light.faPlay,
  // regular icons
  search: Regular.faSearch,
  tick: Regular.faCheck,
  arrowRight: Regular.faChevronRight,
  language: Regular.faGlobe,
  avatar: Regular.faImage,
  account: Regular.faUserCircle,
  email: Regular.faAt,
  contact: Regular.faEnvelope,
  subscriptions: Regular.faCheckCircle,
  restore: Regular.faCartArrowDown,
  theme: Regular.faPalette,
  privacy: Regular.faBadgeCheck,
  terms: Regular.faBook,
  community: Regular.faUsers,
  delete: Regular.faTimesCircle,
  logout: Regular.faSignOut,
  notifications: Regular.faBell,
  tv: Regular.faTvRetro,
  watching: Regular.faPlayCircle,
  latest: Regular.faSparkles,
  popular: Regular.faFireAlt,
  mostViewed: Regular.faEye,
  suggested: Regular.faBullhorn,
  new: Regular.faStar,
  like: Regular.faSmile,
  watchlist: Regular.faHistory,
  about: Regular.faInfoCircle,
  cameraBold: Regular.faCamera,
  image: Regular.faImagePolaroid,
  video: Regular.faFilmAlt,
  media: Regular.faPhotoVideo,
  // solid icons
  play: Solid.faPlay,
  downArrow: Solid.faSortDown,
  upArrow: Solid.faSortUp,
  plus: Solid.faPlus,
  pause: Solid.faPause,
  send: Solid.faPaperPlane,
  heartFill: Solid.faHeart,
  eye: Solid.faEye,
  lock: Solid.faLock,
  premium: Solid.faLock,
  edit: Solid.faPencil,
  remove: Solid.faTrash,
  // social icons
  apple: Social.faApple,
  google: Social.faGoogle,
  facebook: Social.faFacebookF,
  // duotone icons
  cVideos: Duo.faFilmAlt,
  cChannel: Duo.faTvAlt,
  cSubscribers: Duo.faUsers,
  cFinancial: Duo.faCoins,
  cAnalytics: Duo.faAnalytics,
}

const sizeMap: Record<IconSize, number> = {
  xs: 16,
  sm: 24,
  md: 32,
  lg: 48,
}

export type IconNamesEnum =
  | 'home'
  | 'share'
  | 'info'
  | 'unmute'
  | 'mute'
  | 'drawer'
  | 'play'
  | 'close'
  | 'refresh'
  | 'tick'
  | 'downArrow'
  | 'upArrow'
  | 'link'
  | 'videoError'
  | 'plus'
  | 'apple'
  | 'google'
  | 'facebook'
  | 'search'
  | 'miniMenu'
  | 'closeCircle'
  | 'heart'
  | 'comment'
  | 'more'
  | 'pause'
  | 'camera'
  | 'send'
  | 'heartFill'
  | 'account'
  | 'arrowRight'
  | 'email'
  | 'subscriptions'
  | 'language'
  | 'theme'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'delete'
  | 'logout'
  | 'backArrow'
  | 'restore'
  | 'forward'
  | 'backward'
  | 'notifications'
  | 'tv'
  | 'watching'
  | 'latest'
  | 'popular'
  | 'mostViewed'
  | 'avatar'
  | 'filter'
  | 'suggested'
  | 'new'
  | 'like'
  | 'watchlist'
  | 'about'
  | 'eye'
  | 'cameraBold'
  | 'image'
  | 'video'
  | 'media'
  | 'community'
  | 'lock'
  | 'premium'
  | 'shareChannel'
  | 'channel'
  | 'videos'
  | 'cVideos'
  | 'cChannel'
  | 'cSubscribers'
  | 'cFinancial'
  | 'cAnalytics'
  | 'edit'
  | 'remove'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg'

interface Props {
  name: IconNamesEnum
  size?: IconSize | number
  color?: string
  secondaryColor?: string
  backgroundColor?: string
  containerStyle?: StyleProp<ViewStyle>
}

export const Icon = ({
  name,
  size = 'md',
  color,
  secondaryColor,
  backgroundColor = 'transparent',
  containerStyle,
}: Props) => {
  const theme = useTheme()
  const iconSize = typeof size === 'string' ? sizeMap[size] : size
  const style = [containerStyle, { backgroundColor }]

  return (
    <InlineWrapper style={style}>
      <FontAwesomeIcon
        icon={iconMap[name]}
        size={iconSize}
        color={color || theme.white}
        secondaryColor={secondaryColor}
      />
    </InlineWrapper>
  )
}
