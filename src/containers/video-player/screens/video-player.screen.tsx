import * as React from 'react'
import { Alert } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import Spinner from 'react-native-spinkit'
import * as Sentry from '@sentry/react-native'
import { MotiView } from 'moti'
import Haptics from 'react-native-haptic-feedback'
import { Button } from '../../../components/buttons.component'

import RNVideo, {
  LoadError,
  OnLoadData,
  OnProgressData,
} from 'react-native-video'

import {
  MainStackNavigationProp,
  MainStackRouteProp,
} from '@/typings/navigators'

import { bufferConfig } from '@/utils/video-helpers.util'
import * as k from '@/utils/constants'

import {
  useVideo,
  useVideos,
  useSubscriptions,
  useAppState,
  useBackButton,
  useLike,
  useStore,
  Channel,
  Video,
  useUnlike,
  useComments,
  useFilterPremium,
  useUpdateWatchlist,
  useShareProvider,
  useReplies,
  useReporting,
} from '@/hooks'
import { VideoComments, VideoControls, VideoReplies, Skip } from '@/components'

type ScreenType = 'Player' | 'Comments' | 'Replies'

interface Props {
  navigation: MainStackNavigationProp<'MediaPlayer'>
  route: MainStackRouteProp<'MediaPlayer'>
}

export const VideoPlayerScreen = ({ navigation, route }: Props) => {
  const videoRef = React.useRef<RNVideo>(null)
  const progressRef = React.useRef(0)

  const [videoId, setVideoId] = React.useState(route.params.id)
  const [repliesId, setRepliesId] = React.useState<string | number>(-1)

  // const doLike = useLike()
  // const doUnlike = useUnlike()
  // const report = useReporting()
  // const updateWatchlist = useUpdateWatchlist()
  // const share = useShareProvider()

  const doLike = []
  const doUnlike = []
  const report = []
  const updateWatchlist =[]
  const share =[]

  const { data: videoData } = useVideo({ videoId })
  // const { data: subsciptionData } =  useSubscriptions()
  // const { data: relatedVideosData } = useVideos({
  //   videoId,
  //   limit: 3,
  //   type: 'related',
  // })

  const subsciptionData= [];

  // const videoData = {"channel": {"avatarUrl": "https://sofadog-storage.s3.eu-west-2.amazonaws.com/8quc9o2e5ilcik4w9mcd5id423oy", "categories": undefined, "coverUrl": "https://sofadog-storage.s3.eu-west-2.amazonaws.com/ez2yfm0onujhtafuhm5z6nq8y363", "description": "Kõige tervislikumad ja maitsvamad retseptid, mis nõuavad minimaalselt aega ja pakuvad maksimaalselt naudingut! Patustada saab ka tervislikult, suhkruvabalt, gluteenivabalt ja täistaimselt!", "feedId": 1, "followerCount": 5, "id": "1", "name": "Paljas Porgand", "price": 100, "subscribed": false}, "coverUrl": "https://cdn.so.fa.dog/passion-thumbnails-prod/thumbnail-c52789f3-d8cb-43cd-84fb-590461bec096-a33698b3ccaa.jpg", "description": "Ei, pasta ei pea olema kohutav su vöökohale ja tervisele — sisaldama nisu, rasva, juustu, liha jmt. Pasta võib olla ka antioksüdandipauk ja vöökoha parim sõber, vähemalt siis, kui minu retsepti järgida!", "duration": 217790, "id": "1158", "liked": false, "likes": "0", "posterUrl": "https://cdn.so.fa.dog/passion-thumbnails-prod/thumbnail-c52789f3-d8cb-43cd-84fb-590461bec096-a33698b3ccaa.jpg", "seekPosition": undefined, "title": "Eriti küüslaugune tatrapasta", "uploaded": "2022-01-05T18:09:42.234Z", "videoUrl": "https://cdn.so.fa.dog/passion-clips-prod/c52789f3-d8cb-43cd-84fb-590461bec096-any.m3u8", "viewCount": "1"}

  const test = () => {
    console.log(videoData,"videoData lll");
    
  }

 
  

  // const { data: commentData, refetch: refetchComments } = useComments({
  //   ref: [videoId],
  //   resourceType: 'video',
  // })

  // const { data: repliesData, refetch: refetchReplies } = useReplies({
  //   ref: [videoId, repliesId],
  //   resourceType: 'video',
  // })

  const getUserState = React.useCallback(
    state => ({
      user: state.user,
    }),
    []
  )

  const filterPremium = useFilterPremium()
  const { user } = useStore(getUserState)

  const [isPaused, setPaused] = React.useState(false)
  const [isMuted, setMuted] = React.useState(false)
  const [isEnded, setEnded] = React.useState(false)
  // const [commentCount, setCommentCount] = React.useState(
  //   commentData?.length || 0
  // )
  const [progress, setProgress] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [buffered, setBuffered] = React.useState(0)

  const [shownScreen, setShownScreen] = React.useState<ScreenType>('Player')
  const [likeCount, setLikeCount] = React.useState(videoData?.likes || '0')
  const [isLiked, setLiked] = React.useState(videoData?.liked)

  const { appState } = useAppState({
    onBackground: () => {
      setPaused(true)
      //doWatchlistUpdate()
    },
  })

  React.useEffect(() => {
    //console.log("inside media player ");
    if (videoData) {
      setLikeCount(videoData.likes)
      setLiked(videoData.liked)
    }
  }, [videoData])

  // React.useEffect(() => {
  //   refetchComments()
  // }, [videoId, refetchComments])

  // React.useEffect(() => {
  //   if (repliesId !== -1) {
  //     refetchReplies()
  //   }
  // }, [videoId, repliesId, refetchReplies])

  // React.useEffect(() => {
  //   setCommentCount(commentData?.length || 0)
  // }, [commentData])

  const hasAuth = React.useCallback(
    (video: Video, subscriptions?: Channel[]) => {
      if (!user || !subscriptions) {
        return false
      }
      const isAuthorized = subscriptions?.find(
        item => item?.feedId === video?.channel.id
      )
      return isAuthorized !== undefined
    },
    [user]
  )

  const handleLoad = (meta: OnLoadData) => {
    setDuration(meta.duration)
    setPaused(false)
  }

  const handleProgress = (progress: OnProgressData) => {
    progressRef.current = progress.currentTime
    setProgress(progress.currentTime)
    setBuffered(progress.playableDuration)
  }

  const handleEnd = () => {
    setEnded(true)
    setPaused(true)
    if (videoData && !hasAuth(videoData, subsciptionData)) {
      Alert.alert(
        'Did you like this video?',
        'Why not subscribe to this channel to view more',
        [
          { text: 'Subscribe', onPress: handleChannelPress },
          { text: 'Maybe later' },
        ]
      )
    }
  }

  const handleError = (e: LoadError) => {
    Sentry.captureException(e)
  }

  /*
   * Controls Methods
   */

  const handleChannelPress = () => {
    Haptics.trigger('impactLight', k.hapticOptions)
    navigation.navigate('Channel', {
      screen: 'ChannelDetail',
      params: {
        id: videoData?.channel.feedId,
      },
    })
  }
de
  const handlePremiumVideoPress = (feedId: string) => {
    Haptics.trigger('impactLight', k.hapticOptions)
    navigation.navigate('Channel', {
      screen: 'ChannelDetail',
      params: {
        id: feedId,
      },
    })
  }

  const handleLikePress = () => {
    Haptics.trigger('impactLight', k.hapticOptions)
    setLiked(v => {
      const didLike = !v
      const asNumber = parseInt(likeCount)
      const newLikeCount = didLike ? asNumber + 1 : asNumber - 1
      setLikeCount(`${newLikeCount}`)
      didLike
        ? doLike.mutate({ resourceType: 'video', ref: [videoId] })
        : doUnlike.mutate({ resourceType: 'video', ref: [videoId] })
      return didLike
    })
  }

  // const doWatchlistUpdate = () => {
  //   if (videoData) {
  //     updateWatchlist.mutate({
  //       videoId,
  //       progress: isEnded ? 0 : progress * 1000,
  //       duration: videoData?.duration,
  //     })
  //   }
  // }

  const handleDismiss = () => {
  //  doWatchlistUpdate()
    navigation.pop()
  }

  const handlePlaybackChange = () => {
    Haptics.trigger('impactLight', k.hapticOptions)
    if (isEnded) {
      videoRef.current?.seek(0)
      setEnded(false)
    }
    setPaused(v => !v)
  }

  const handleSkip = (dir: Skip) => {
    Haptics.trigger('impactLight', k.hapticOptions)
    const progress = progressRef.current
    const n = 10
    const newProgress = dir === Skip.forwards ? progress + n : progress - n
    videoRef.current?.seek(newProgress)
  }

  const handleScrub = (ms: number) => {
    setProgress(ms)
    videoRef.current?.seek(ms)
  }

  const handleSharePress = () => {
    if (videoData) {
      share.create({
        id: videoData.id,
        title: videoData.title,
        message: videoData.description,
        feature: 'share_video',
      })
    }
  }

  useBackButton(() => {
    if (shownScreen === 'Player') {
      handleDismiss()
    }
    if (shownScreen === 'Comments') {
      setShownScreen('Player')
    }
    if (shownScreen === 'Replies') {
      setShownScreen('Comments')
    }
  })

  /**
   * Replies Nethods
   */

  const handleBackPress = () => {
    setShownScreen('Comments')
  }

  // const handleRepliesCommentLike = React.useCallback(
  //   async (id: string, isLiked: boolean) => {
  //     if (repliesId) {
  //       if (isLiked) {
  //         doLike.mutate({
  //           ref: [videoId, id],
  //           resourceType: 'comment',
  //         })
  //       } else {
  //         doUnlike.mutate({
  //           ref: [videoId, id],
  //           resourceType: 'comment',
  //         })
  //       }
  //     }
  //   },
  //   [videoId, repliesId]
  // )

  // const handleRepliesCommentReport = React.useCallback(
  //   (id: string) => {
  //     Alert.alert(
  //       'Please Confirm',
  //       'Are you sure you would like to report this comment?',
  //       [
  //         { text: 'Cancel' },
  //         {
  //           text: 'Yes',
  //           onPress: async () => {
  //             try {
  //               if (repliesId) {
  //                 const res = await report.mutateAsync({
  //                   commentId: [id],
  //                   reason: 'Innapropriate Comment',
  //                 })
  //                 if (res) {
  //                   Alert.alert(
  //                     'Thank you for flagging this comment',
  //                     `We'll review the item shortly`
  //                   )
  //                 }
  //               }
  //             } catch (e) {
  //               Alert.alert(
  //                 'An error was encountered',
  //                 `Please try again later`
  //               )
  //             }
  //           },
  //         },
  //       ]
  //     )
  //   },
  //   [repliesId]
  // )

  // const renderReplies = React.useMemo(
  //   () =>
  //     videoData && (
  //       <VideoReplies
  //         userId={user?.id}
  //         onBackPress={handleBackPress}
  //         items={repliesData || []}
  //         onRepliesCommentLike={handleRepliesCommentLike}
  //         commentingEnabled={hasAuth(videoData, subsciptionData)}
  //         onRepliesCommentReport={handleRepliesCommentReport}
  //       />
  //     ),
  //   [
  //     repliesData,
  //     handleRepliesCommentLike,
  //     handleRepliesCommentReport,
  //     videoData,
  //     user?.id,
  //     hasAuth,
  //     subsciptionData,
  //   ]
  // )

  /*
   * Comments Methods
   */

  // const handleCommentsChange = React.useCallback(
  //   () => (count: number) => {
  //     setCommentCount(count)
  //   },
  //   []
  // )

  // const handleCommentPlay = React.useCallback(() => {
  //   setPaused(true)
  // }, [])

  // const handleCommentsBackPress = React.useCallback(
  //   () => setShownScreen('Player'),
  //   []
  // )

  // const handleRepliesPress = (id: string) => {
  //   setRepliesId(id)
  //   setShownScreen('Replies')
  // }

  // const handleReportComment = React.useCallback((id: string) => {
  //   Alert.alert(
  //     'Please Confirm',
  //     'Are you sure you would like to report this comment?',
  //     [
  //       { text: 'Cancel' },
  //       {
  //         text: 'Yes',
  //         onPress: async () => {
  //           try {
  //             const res = await report.mutateAsync({
  //               commentId: [id],
  //               reason: 'Innapropriate Comment',
  //             })
  //             if (res) {
  //               Alert.alert(
  //                 'Thank you for flagging this comment',
  //                 `We'll review the item shortly`
  //               )
  //             }
  //           } catch (e) {
  //             Alert.alert('An error was encountered', `Please try again later`)
  //           }
  //         },
  //       },
  //     ]
  //   )
  // }, [])

  const isViewingComments = React.useMemo(() => {
    return shownScreen === 'Comments'
  }, [shownScreen])

  // const renderComments = React.useMemo(
  //   () =>
  //     videoData && (
  //       <VideoComments
  //         isShowing={isViewingComments}
  //         videoId={videoId}
  //         comments={commentData}
  //         user={user}
  //         onCommentPlay={handleCommentPlay}
  //         onBackPress={handleCommentsBackPress}
  //         commentingEnabled={hasAuth(videoData, subsciptionData)}
  //         onCommentsChange={handleCommentsChange}
  //         onRepliesPress={handleRepliesPress}
  //         onReportComment={handleReportComment}
  //       />
  //     ),
  //   [
  //     commentData,
  //     videoData,
  //     subsciptionData,
  //     hasAuth,
  //     videoId,
  //     user,
  //     isViewingComments,
  //     handleCommentsBackPress,
  //     handleCommentPlay,
  //     handleCommentsChange,
  //     handleReportComment,
  //   ]
  // )

  const renderPlayer = (
    <VideoPlayer
      ref={videoRef}
      muted={isMuted}
      paused={isPaused}
      source={{ uri: videoData?.videoUrl }}
      // poster={videoData?.posterUrl}
      resizeMode="cover"
      posterResizeMode="cover"
      bufferConfig={k.isAndroid ? bufferConfig : undefined}
      removeClippedSubviews
      ignoreSilentSwitch="ignore"
      onLoad={handleLoad}
      onProgress={handleProgress}
      onEnd={handleEnd}
      onError={handleError}
    />
  )

  const handleViewCommentsPress = () => setShownScreen('Comments')

  const handleSlideAnimation = React.useMemo(
    () => ({
      left:
        shownScreen === 'Player'
          ? 0
          : shownScreen === 'Comments'
          ? -k.screen.w
          : -k.screen.w * 2,
    }),
    [shownScreen]
  )

  return (
    <>
      <Container>
      <Button
                type="social"
              
                onPress={() => test()}
              >
                <Button.Icon name="facebook" />
                <Button.Label>{`Facebook`}</Button.Label>
              </Button>
        {videoData ? (
          <>
            {renderPlayer}
            <ViewSlider
              animate={handleSlideAnimation}
              transition={{ type: 'timing', duration: 250 }}
            >
              <Slide>
                <VideoControls
                  /* video props  */
                  paused={isPaused}
                  muted={isMuted}
                  progress={progress}
                  duration={duration}
                  buffered={buffered}
                  /* view props  */
                  channelName={videoData.channel.name}
                  avatarUrl={videoData.channel.avatarUrl}
                  title={videoData.title}
                  description={videoData.description}
                  liked={!!isLiked}
                  likes={likeCount}
                  // shares={videoData.shares}
                  // uploaded={videoData.uploaded}
                  // commentCount={commentCount}
                  // relatedVideos={filterPremium(
                  //   relatedVideosData,
                  //   subsciptionData
                  // )}
                  /* video effecting methods */
                  onPlaybackChange={handlePlaybackChange}
                  onMuteChange={() => setMuted(v => !v)}
                  onSkip={handleSkip}
                  onScrub={handleScrub}
                  /* view methods */
                  onVideoChange={id => {
                    setRepliesId(-1)
                    setVideoId(id)
                  }}
                  onPremiumVideoPress={handlePremiumVideoPress}
                  onLikePress={handleSharePress}
                  onSharePress={handleSharePress}
                  onChannelPress={handleChannelPress}
                  onViewCommentsPress={handleViewCommentsPress}
                  onClose={handleDismiss}
                  isSubscribed={true}
                />
              </Slide>
              {/* <Slide>{renderComments}</Slide>
              <Slide>{renderReplies}</Slide> */}
            </ViewSlider>
          </>
        ) : (
          <SpinnerWrapper>
            <Spinner type="Pulse" color="white" size={60} />
          </SpinnerWrapper>
        )}
      </Container>
    </>
  )
}

const Container = styled.View`
  ${tw(`absolute bg-black inset-0 
  justify-center items-center`)}
`
const VideoPlayer = styled(RNVideo)`
  ${tw(`bg-black h-full w-full`)};
`
const SpinnerWrapper = styled.View`
  ${tw(`absolute inset-0 bg-black items-center justify-center`)}
`

const ViewSlider = styled(MotiView)`
  ${tw(`absolute left-0 flex-row`)};
  height: ${k.screen.h}px;
  width: ${k.screen.w * 3}px;
`

const Slide = styled.View`
  ${tw(`h-full items-center justify-center`)};
  width: ${k.screen.w}px;
`
