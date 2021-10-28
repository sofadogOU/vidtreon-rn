import React from 'react'
import { Alert } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import * as Sentry from '@sentry/react-native'

import {
  useUploadNewsItemThumbnail,
  usePatchNewsItem,
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
  route: CreatorStackRouteProp<'CreatorEdit'>
}

export const CreatorEditScreen = (props: Props) => {
  const [isLoading, setLoading] = React.useState(false)
  const [isReady, setReady] = React.useState(false)
  const [formData, setFormData] = React.useState<UploadFormData>()

  const uploadThumbnail = useUploadNewsItemThumbnail()
  const patchNewsItem = usePatchNewsItem()
  const publishNewsItem = usePublishNewsItem()
  const unpublishNewsItem = useUnpublishNewsItem()

  const handleAlertPress = () => {
    props.navigation.goBack()
  }

  React.useEffect(() => {
    console.log(props.route.params.item)
  }, [])

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

  const validateData = (data: UploadFormData): boolean => {
    const { title, description } = data
    if (title && description) {
      setFormData(data)
      return true
    } else {
      return false
    }
  }

  const uploadData = async (data: UploadFormData) => {
    const { item } = props.route.params
    const videoId = item.id
    const feedId = item.feedId
    try {
      setLoading(true)
      /** update thumbnail */
      data.thumbnailData &&
        typeof data.thumbnailData !== 'string' &&
        (await uploadThumbnail.mutateAsync({
          videoId,
          data: createFormData(data.thumbnailData),
        }))

      /** update details */
      await patchNewsItem.mutateAsync({
        videoId,
        categoryId: data.category,
        title: data.title!,
        description: data.description!,
        feedId: feedId!,
        tags: data.tags?.map(item => item.text) || [],
      })

      /** update published state */
      data.isPublic
        ? await publishNewsItem.mutateAsync({
            videoId,
          })
        : await unpublishNewsItem.mutateAsync({
            videoId,
          })
      setLoading(false)
      Alert.alert('Updated Successfully', 'Your changes have been saved', [
        { text: 'OK', onPress: handleAlertPress },
      ])
    } catch (e) {
      setLoading(false)
      Sentry.captureException(e)
      Alert.alert('An error has occurred', 'Please try again later')
    }
  }

  const handleSave = () => {
    if (formData) {
      uploadData(formData)
    }
  }

  return (
    <>
      <TitleBar
        title="Edit Video"
        onBackPress={handleNavBackPress}
        onActionPress={handleSave}
        actionTitle="Save"
        actionEnabled={isReady}
      />
      <Container>
        <VideoUpload
          onDataChange={handleDataChange}
          data={props.route.params.item}
        />
      </Container>
      {isLoading && (
        <LoadingOverlay
          isVisible={true}
          message={`Please be patient\nThis may take a while`}
        />
      )}
    </>
  )
}

const Container = styled.ScrollView`
  ${tw(``)}
`
