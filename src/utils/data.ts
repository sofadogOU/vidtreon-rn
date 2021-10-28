import faker from 'faker'
import numeral from 'numeral'
// import moment from 'moment'

import SlideA from '@/assets/lottie/onboarding/a_welcome.json'
import SlideB from '@/assets/lottie/onboarding/b_discover.json'
import SlideC from '@/assets/lottie/onboarding/c_subscribe.json'
import SlideD from '@/assets/lottie/onboarding/d_enjoy.json'

import {
  VideoPreview,
  Channel,
  Category,
  Media,
  Comment,
  CommentType,
  Tag,
  SettingSection,
  ChannelProfile,
  OnboardingSlide,
} from '@/typings'

const STREAM_URL =
  'https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8'

const generateAvatar = () =>
  `${faker.image.people()}?random=${Math.round(Math.random() * 1000)}}`

const generateVideoPreview = (): VideoPreview => {
  const randViews = faker.datatype.number(10000000)
  const formatter = randViews < 1000000 ? '0a' : '0.0a'
  const viewCount = numeral(randViews).format(formatter)
  const randLikes = faker.datatype.number(10000)
  const likesFormatter = randLikes < 1000 ? '0a' : '0.0a'
  const likesCount = numeral(randLikes).format(likesFormatter)
  return {
    id: faker.datatype.uuid(),
    title: faker.lorem.paragraph(),
    poster: generateAvatar(),
    viewCount,
    duration: '11:59',
    likes: likesCount,
    description: faker.lorem.paragraph(),
    channel: {
      name: faker.random.words(5),
      id: faker.datatype.uuid(),
      avatar: generateAvatar(),
    },
  }
}

export const channelPreviews: Channel[] = new Array(10).fill(null).map(() => ({
  id: faker.datatype.uuid(),
  name: faker.random.words(3),
  thumbnail: generateAvatar(),
}))

export const channelProfile = (): ChannelProfile => {
  const followers = faker.datatype.number(900000)
  const formatter = followers < 1000000 ? '0a' : '0.0a'
  const followerCount = numeral(followers).format(formatter)
  return {
    id: faker.datatype.uuid(),
    name: faker.random.words(3),
    thumbnail: generateAvatar(),
    cover: faker.random.image(),
    followers: followerCount,
    description: faker.lorem.paragraphs(1),
    featuredVideo: [generateVideoPreview()],
  }
}

const generateChannelProfile = (): ChannelProfile => {
  const followers = faker.datatype.number(900000)
  const formatter = followers < 1000000 ? '0a' : '0.0a'
  const followerCount = numeral(followers).format(formatter)
  return {
    id: faker.datatype.uuid(),
    name: faker.random.words(3),
    thumbnail: generateAvatar(),
    cover: faker.random.image(),
    followers: followerCount,
    description: faker.lorem.paragraphs(1),
    featuredVideo: [generateVideoPreview()],
  }
}

export const channelProfiles: ChannelProfile[] = new Array(10)
  .fill(null)
  .map(() => generateChannelProfile())

export const watchingSuggestions: VideoPreview[] = new Array(10)
  .fill(null)
  .map(() => {
    const randViews = faker.datatype.number(10000000)
    const formatter = randViews < 1000000 ? '0a' : '0.0a'
    const viewCount = numeral(randViews).format(formatter)
    const randLikes = faker.datatype.number(10000)
    const likesFormatter = randLikes < 1000 ? '0a' : '0.0a'
    const likesCount = numeral(randLikes).format(likesFormatter)
    return {
      id: faker.datatype.uuid(),
      title: faker.lorem.paragraph(),
      poster: generateAvatar(),
      viewCount,
      duration: '11:59',
      likes: likesCount,
      seekPosition: faker.datatype.number(100),
      description: faker.lorem.paragraph(),
      channel: {
        name: faker.random.words(5),
        id: faker.datatype.uuid(),
        thumbnail: generateAvatar(),
      },
    }
  })

export const videoSuggestions: VideoPreview[] = new Array(10)
  .fill(null)
  .map(() => {
    const randViews = faker.datatype.number(10000000)
    const formatter = randViews < 1000000 ? '0a' : '0.0a'
    const viewCount = numeral(randViews).format(formatter)
    const randLikes = faker.datatype.number(10000)
    const likesFormatter = randLikes < 1000 ? '0a' : '0.0a'
    const likesCount = numeral(randLikes).format(likesFormatter)
    return {
      id: faker.datatype.uuid(),
      title: faker.lorem.words(12),
      poster: generateAvatar(),
      viewCount,
      duration: '11:59',
      likes: likesCount,
      description: faker.lorem.paragraph(),
      channel: {
        name: faker.random.words(5),
        id: faker.datatype.uuid(),
        thumbnail: generateAvatar(),
      },
    }
  })

const generateMessage = (type: CommentType) => {
  switch (type) {
    case 'text':
      return {
        text: faker.lorem.sentences(1),
      }
    case 'image':
      return {
        imageUrl: faker.random.image(),
      }
    case 'video':
      return {
        videoUrl: STREAM_URL,
        videoPoster: generateAvatar(),
      }
  }
}

const generateComments = (
  count: number,
  type: CommentType = 'video'
): Comment[] => {
  const messageVal = generateMessage(type)
  return new Array(count).fill(null).map(() => ({
    id: faker.datatype.uuid(),
    date: '', // moment().subtract(5, 'minutes').unix(),
    likes: faker.datatype.number(100),
    parentId: faker.datatype.uuid(),
    type,
    user: {
      id: faker.datatype.uuid(),
      name: faker.name.firstName(),
      thumbnail: generateAvatar(),
    },
    ...messageVal,
  }))
}

// const generateImageComments = (count: number): Comment[] =>
//   new Array(count).fill(null).map(() => ({
//     id: faker.datatype.uuid(),
//     text: faker.lorem.sentences(1),
//     date: moment().subtract(5, 'minutes').unix(),
//     likes: faker.datatype.number(100),
//     parentId: faker.datatype.uuid(),
//     type: 'image',
//     user: {
//       id: faker.datatype.uuid(),
//       name: faker.name.firstName(),
//       thumbnail: generateAvatar(),
//     },
//   }))

export const mediaItem = ((): Media => {
  const randViews = faker.datatype.number(10000000)
  const formatter = randViews < 1000000 ? '0a' : '0.0a'
  const viewCount = numeral(randViews).format(formatter)
  const randLikes = faker.datatype.number(10000)
  const likesFormatter = randLikes < 1000 ? '0a' : '0.0a'
  const likesCount = numeral(randLikes).format(likesFormatter)
  return {
    id: faker.datatype.uuid(),
    title: faker.lorem.paragraph(),
    viewCount,
    duration: '11:59',
    seekPosition: faker.datatype.number(100),
    uploaded: '', // moment().subtract(5, 'minutes').unix(),
    likes: likesCount,
    shares: faker.datatype.number(200),
    comments: generateComments(4, 'video'),
    poster: generateAvatar(),
    cover: generateAvatar(),
    description: faker.lorem.paragraph(),
    url: STREAM_URL,
    channel: {
      id: faker.datatype.uuid(),
      thumbnail: generateAvatar(),
      name: faker.random.words(5),
    },
  }
})()

export const mediaItemB = ((): Media => {
  const randViews = faker.datatype.number(10000000)
  const formatter = randViews < 1000000 ? '0a' : '0.0a'
  const viewCount = numeral(randViews).format(formatter)
  const randLikes = faker.datatype.number(30000)
  const likesFormatter = randLikes < 1000 ? '0a' : '0.0a'
  const likesCount = numeral(randLikes).format(likesFormatter)
  return {
    id: faker.datatype.uuid(),
    title: faker.lorem.paragraph(),
    viewCount,
    duration: '11:59',
    seekPosition: faker.datatype.number(100),
    uploaded: '', // moment().subtract(5, 'minutes').unix(),
    likes: likesCount,
    shares: faker.datatype.number(1000),
    comments: generateComments(8, 'video'),
    poster: generateAvatar(),
    cover: generateAvatar(),
    description: faker.lorem.paragraph(),
    url: 'http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8',
    channel: {
      id: faker.datatype.uuid(),
      thumbnail: generateAvatar(),
      name: faker.random.words(5),
    },
  }
})()

export const categories: Category[] = [
  { id: faker.datatype.uuid(), name: 'Film & Animation', hex: '#FF2310' },
  { id: faker.datatype.uuid(), name: 'Autos & Vehicles', hex: '#FF0060' },
  { id: faker.datatype.uuid(), name: 'Music', hex: '#AC00B8' },
  { id: faker.datatype.uuid(), name: 'Pets & Animals', hex: '#712AC3' },
  { id: faker.datatype.uuid(), name: 'Sports', hex: '#3D4BBF' },
  { id: faker.datatype.uuid(), name: 'Travel & Events', hex: '#0095FE' },
  { id: faker.datatype.uuid(), name: 'Gaming', hex: '#00A9FD' },
  { id: faker.datatype.uuid(), name: 'People & Blogs', hex: '#00BFDB' },
  { id: faker.datatype.uuid(), name: 'Comedy', hex: '#009A88' },
  { id: faker.datatype.uuid(), name: 'Entertainment', hex: '#00B53B' },
  { id: faker.datatype.uuid(), name: 'News & Politics', hex: '#75C817' },
  { id: faker.datatype.uuid(), name: 'Howto & Style', hex: '#C8E000' },
  { id: faker.datatype.uuid(), name: 'Education', hex: '#FFEE00' },
  { id: faker.datatype.uuid(), name: 'Science & Technology', hex: '#FFC000' },
  { id: faker.datatype.uuid(), name: 'Nonprofits & Activism', hex: '#FF9400' },
]

export const tags: Tag[] = [
  { id: faker.datatype.uuid(), name: 'All' },
  { id: faker.datatype.uuid(), name: 'Travel' },
  { id: faker.datatype.uuid(), name: 'Love' },
  { id: faker.datatype.uuid(), name: 'Funny' },
  { id: faker.datatype.uuid(), name: 'Cute' },
  { id: faker.datatype.uuid(), name: 'Fun' },
  { id: faker.datatype.uuid(), name: 'Music' },
  { id: faker.datatype.uuid(), name: 'Happy' },
  { id: faker.datatype.uuid(), name: 'Fashion' },
  { id: faker.datatype.uuid(), name: 'Comedy' },
  { id: faker.datatype.uuid(), name: 'Meme' },
  { id: faker.datatype.uuid(), name: 'Girl' },
  { id: faker.datatype.uuid(), name: 'Dance' },
  { id: faker.datatype.uuid(), name: 'TBT' },
  { id: faker.datatype.uuid(), name: 'Me' },
  { id: faker.datatype.uuid(), name: 'Love' },
  { id: faker.datatype.uuid(), name: 'Summer' },
  { id: faker.datatype.uuid(), name: 'Life' },
  { id: faker.datatype.uuid(), name: 'Friends' },
  { id: faker.datatype.uuid(), name: 'Beauty' },
  { id: faker.datatype.uuid(), name: 'Repost' },
  { id: faker.datatype.uuid(), name: 'Family' },
  { id: faker.datatype.uuid(), name: 'Beach' },
  { id: faker.datatype.uuid(), name: 'Fitness' },
  { id: faker.datatype.uuid(), name: 'Food' },
  { id: faker.datatype.uuid(), name: 'Photography' },
  { id: faker.datatype.uuid(), name: 'Drawing' },
  { id: faker.datatype.uuid(), name: 'Model' },
  { id: faker.datatype.uuid(), name: 'Nature' },
  { id: faker.datatype.uuid(), name: 'Health' },
  { id: faker.datatype.uuid(), name: 'Gym' },
  { id: faker.datatype.uuid(), name: 'Party' },
  { id: faker.datatype.uuid(), name: 'Night' },
  { id: faker.datatype.uuid(), name: 'Motivation' },
  { id: faker.datatype.uuid(), name: 'Baby' },
  { id: faker.datatype.uuid(), name: 'Handmade' },
  { id: faker.datatype.uuid(), name: 'Lifestyle' },
  { id: faker.datatype.uuid(), name: 'Work' },
]

export const profileItems: SettingSection[] = [
  {
    title: 'Account',
    items: [
      {
        id: faker.datatype.uuid(),
        icon: 'account',
        label: 'Profile',
        description: 'View and edit your profile details',
        type: 'field',
      },
      {
        id: faker.datatype.uuid(),
        icon: 'subscriptions',
        label: 'Subscriptions',
        description:
          'View and edit the status of channels you are subscribed to',
        type: 'list',
      },
      {
        id: faker.datatype.uuid(),
        icon: 'restore',
        label: 'Restore Purchases',
        description: 'Retrieve active subscriptions and purchases',
        type: 'list',
      },
    ],
  },
  {
    title: 'Preferences',
    items: [
      {
        id: faker.datatype.uuid(),
        icon: 'language',
        label: 'Language',
        description: 'Change the language for all in-app labels and details',
        type: 'lang',
        items: [
          {
            id: faker.datatype.uuid(),
            lang: 'English',
            code: 'en',
            flag: '🇺🇸',
          },
          // {
          //   id: faker.datatype.uuid(),
          //   lang: 'Estonian',
          //   code: 'en-EE',
          //   flag: '🇪🇪',
          // },
          // {
          //   id: faker.datatype.uuid(),
          //   lang: 'Brazilian Portuguese',
          //   code: 'pt-BR',
          //   flag: '🇧🇷',
          // },
        ],
      },
      {
        id: faker.datatype.uuid(),
        icon: 'theme',
        label: 'Dark theme',
        description: "Change the color scheme for the app's interface",
        type: 'theme',
      },
    ],
  },
  {
    title: 'About',
    items: [
      {
        id: faker.datatype.uuid(),
        icon: 'privacy',
        label: 'Privacy Policy',
        description: 'Read the so.fa.dog privacy policy',
        type: 'link',
        path: 'https://v.so.fa.dog/docs/privacy.html',
      },
      {
        id: faker.datatype.uuid(),
        icon: 'terms',
        label: 'Terms & Conditions',
        description: 'Read the so.fa.dog terms and conditions',
        type: 'link',
        path: 'https://v.so.fa.dog/docs/terms.html',
      },
    ],
  },
  {
    title: 'Other',
    items: [
      {
        id: faker.datatype.uuid(),
        icon: 'contact',
        label: 'Contact us',
        description: "Email us with any feedback. We'd love to hear from you",
        type: 'contact',
        path: 'mailto:contact@so.fa.dog',
      },
      {
        id: faker.datatype.uuid(),
        icon: 'logout',
        label: 'Log out',
        description: 'Log out of your current session',
        type: 'link',
      },
      // {
      //   id: faker.datatype.uuid(),
      //   icon: 'delete',
      //   label: 'Delete your account',
      //   type: 'link',
      // },
    ],
  },
]

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: '001',
    animUrl: SlideA,
    title: 'Welcome!',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in et ultricies.',
  },
  {
    id: '002',
    animUrl: SlideB,
    title: 'Discover',
    description: 'Discover creators that are sharing their passion.',
  },
  {
    id: '003',
    animUrl: SlideC,
    title: 'Subscribe',
    description: 'Subscribe and support the ones you love!',
  },
  {
    id: '004',
    animUrl: SlideD,
    title: 'Watch',
    description: 'Watch exclusive content and be a part of the community.',
  },
  {
    id: '005',
    animUrl: SlideD,
    title: 'Get Started',
    description: 'or skip for now',
  },
]

export const FeaturedChannels: Channel[] = [
  {
    id: faker.datatype.uuid(),
    avatar: generateAvatar(),
    cover: faker.random.image(),
    name: 'The Breakfast Club 105.1 FM',
    description:
      'DJ Envy, Angela Yee, and Charlamagne Tha God. The best and latest news and interviews in Hip Hop',
  },
  {
    id: faker.datatype.uuid(),
    avatar: generateAvatar(),
    cover: faker.random.image(),
    name: 'Foodies & Furnishings',
    description:
      'An intelligent and quirky mashup discussing fine dining and the decor that makes them stand-out.',
  },
  {
    id: faker.datatype.uuid(),
    avatar: generateAvatar(),
    cover: faker.random.image(),
    name: 'Carlos & The chicken Comedy Hour',
    description:
      'The funniest, latest and greatest takes on current events in the comedy scence.',
  },
  {
    id: faker.datatype.uuid(),
    avatar: generateAvatar(),
    cover: faker.random.image(),
    name: 'Carlos & The chicken Comedy Hour',
    description:
      'The funniest, latest and greatest takes on current events in the comedy scence.',
  },
  {
    id: faker.datatype.uuid(),
    avatar: generateAvatar(),
    cover: faker.random.image(),
    name: 'Carlos & The chicken Comedy Hour',
    description:
      'The funniest, latest and greatest takes on current events in the comedy scence.',
  },
  {
    id: faker.datatype.uuid(),
    avatar: generateAvatar(),
    cover: faker.random.image(),
    name: 'Carlos & The chicken Comedy Hour',
    description:
      'The funniest, latest and greatest takes on current events in the comedy scence.',
  },
  {
    id: faker.datatype.uuid(),
    avatar: generateAvatar(),
    cover: faker.random.image(),
    name: 'Carlos & The chicken Comedy Hour',
    description:
      'The funniest, latest and greatest takes on current events in the comedy scence.',
  },
  {
    id: faker.datatype.uuid(),
    avatar: generateAvatar(),
    cover: faker.random.image(),
    name: 'Carlos & The chicken Comedy Hour',
    description:
      'The funniest, latest and greatest takes on current events in the comedy scence.',
  },
]
