import React from 'react'
import { Alert } from 'react-native'
import * as Sentry from '@sentry/react-native'

import {
  useAddNewsItem,
  useNewsItem,
  useUploadNewsItemVideo,
  useUploadNewsItemThumbnail,
  usePublishNewsItem,
  useUnpublishNewsItem,
} from '@/hooks'
import {
  VideoUpload,
  UploadFormData,
  TitleBar,
  LoadingOverlay,
} from '@/components'
import {
  CreatorStackNavigationProp,
  CreatorStackRouteProp,
} from '@/typings/navigators'
import { createFormData } from '@/utils/video-helpers.util'

interface Props {
  navigation: CreatorStackNavigationProp<'Creator'>
  route: CreatorStackRouteProp<'CreatorUpload'>
}

export const CreatorUploadScreen = (props: Props) => {
  const [videoId, setVideoId] = React.useState<string>()
  const [isLoading, setLoading] = React.useState(false)
  const [isReady, setReady] = React.useState(false)
  const [formData, setFormData] = React.useState<UploadFormData>()

  const postNewsItem = useAddNewsItem()
  const uploadVideo = useUploadNewsItemVideo()
  const uploadThumbnail = useUploadNewsItemThumbnail()
  const publishNewsItem = usePublishNewsItem()
  const unpublishNewsItem = useUnpublishNewsItem()
  const { data: newsItemData } = useNewsItem({ videoId })

  const handleAlertPress = () => {
    props.navigation.goBack()
  }

  React.useEffect(() => {
    if (newsItemData && newsItemData.length > 0) {
      if (newsItemData[0].status === 'ready_for_push') {
        setLoading(false)
        Alert.alert('Upload Complete', 'Video uploaded successfully', [
          { text: 'OK', onPress: handleAlertPress },
        ])
      }
    }
  }, [newsItemData])

  const handleNavBackPress = () => {
    props.navigation.goBack()
  }

  const handleDataChange = (data: UploadFormData) => {
    const isValid = validateData(data)
    if (isValid) {
      setReady(true)
    } else {
      setReady(false)
    }
  }

  const uploadMedia = async (videoData: FormData, formData: UploadFormData) => {
    try {
      if (videoData && formData) {
        setLoading(true)
        /* create news item to attach video to */
        const newsItemRes = await postNewsItem.mutateAsync({
          feedId: props.route.params.feedId,
          title: formData.title!,
          description: formData.description!,
          categoryId: formData.category ? formData.category : '1',
          tags:
            formData.tags && formData.tags.length > 0
              ? formData.tags.map(item => item.text)
              : [],
        })

        /* update thumbnail if provided */
        formData.thumbnailData &&
          typeof formData.thumbnailData !== 'string' &&
          (await uploadThumbnail.mutateAsync({
            videoId: newsItemRes.news_item.id,
            data: createFormData(formData.thumbnailData),
          }))

        /* update published state */
        formData.isPublic
          ? await publishNewsItem.mutateAsync({
              videoId: newsItemRes.news_item.id,
            })
          : await unpublishNewsItem.mutateAsync({
              videoId: newsItemRes.news_item.id,
            })

        /* upload video to news item */
        const uploadRes = await uploadVideo.mutateAsync({
          videoId: newsItemRes.news_item.id,
          data: videoData,
        })

        setVideoId(uploadRes.news_item.id)
      }
    } catch (e) {
      setLoading(false)
      Sentry.captureException(e)
      Alert.alert('An error has occurred', 'Please try again later')
    }
  }

  const validateData = (data: UploadFormData): boolean => {
    const { videoData, title, description } = data
    if (videoData && title && description) {
      setFormData(data)
      return true
    } else {
      return false
    }
  }

  const handleSave = () => {
    if (formData) {
      setLoading(true)
      uploadMedia(createFormData(formData.videoData!), formData)
    }
  }

  return (
    <>
      <TitleBar
        title="Upload New Video"
        onBackPress={handleNavBackPress}
        onActionPress={handleSave}
        actionTitle="Save"
        actionEnabled={isReady}
      />
      <VideoUpload onDataChange={handleDataChange} />
      {isLoading && (
        <LoadingOverlay
          isVisible={true}
          message={`Please be patient\nThis may take a while`}
        />
      )}
    </>
  )
}
