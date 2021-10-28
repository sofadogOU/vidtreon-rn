type Token = {
  token: string
}

type Avatar = {
  image_url: string
  width: string
  height: string
}

type AdminRole =
  | 'journalist'
  | 'lead_journalist'
  | 'video_editor'
  | 'lead_video_editor'
  | 'feed_manager'

type AdminRoles = {
  id: AdminRole
  description: string
}

type Activity = {
  likes: boolean
  comments: boolean
  mentions: boolean
}

type Preferences = {
  notifications: {
    interactions: Activity
  }
  video_updates: {
    followed_channels: boolean
    suggestions: boolean
  }
}

type Finance = {
  balance: number
}

type User = {
  username: string
  email: string
  first_name: string
  last_name: string
  job_title: string
  phone: string
  avatar: Avatar
  id: string
  admin_roles: AdminRoles[]
  disabled: boolean
  on_shift: boolean
  creator_type: 'sofadog'
  preference: Preferences
  finance: Finance
}

export type AuthUser = Token & {
  user: User
}
