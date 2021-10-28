import * as React from 'react'
import { Keyboard, TouchableWithoutFeedback, Alert } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import { useForm, Controller } from 'react-hook-form'
import { ImagePickerResponse } from 'react-native-image-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-spinkit'

import {
  User,
  useUpload,
  MediaSchema,
  useSaveEmail,
  useSaveUsername,
  useSaveUser,
} from '@/hooks'
import { createFormData } from '@/utils/video-helpers.util'
import { useTranslation } from '@/providers/TranslationProvider'
import * as k from '@/utils/constants'

import { SafeWrapper } from '../wrappers.component'
import { Icon } from '../icon.component'
import { Button } from '../buttons.component'
import { RemoteImage } from '../remote-image.component'
import { MediaPicker } from '../media-picker.component'

export type UserFormData = {
  username: string
  email?: string
  firstName?: string
  lastName?: string
}

interface Props {
  user: User
  updateUserState?: (data: UserFormData, imageUrl: string) => void
}

export const ProfileForm = ({ user, updateUserState }: Props) => {
  const i18n = useTranslation()
  const [isBusy, setBusy] = React.useState(false)
  const [showMediaPicker, setMediaPicker] = React.useState(false)
  const [avatarUrl, setAvatarUrl] = React.useState(user.avatarUrl)
  const [uploadedMedia, setUploadedMedia] = React.useState<MediaSchema>()

  const upload = useUpload()
  const updateUser = useSaveUser()
  const updateEmail = useSaveEmail()
  const updateUsername = useSaveUsername()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  })

  const dismissKeyboard = () => Keyboard.dismiss()

  const handleSave = async (data: UserFormData) => {
    try {
      setBusy(true)
      const avatarData = {
        imageUrl: uploadedMedia?.image_url || user.avatarUrl,
        height: uploadedMedia?.height || user.avatarHeight,
        width: uploadedMedia?.width || user.avatarWidth,
      }
      await updateUser.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: avatarData,
      })
      if (data.email !== user.email) {
        await updateEmail.mutateAsync({
          email: data.email || user.email,
        })
      }
      if (data.username !== user.username) {
        await updateUsername.mutateAsync({
          username: data.username || user.username,
        })
      }
      setBusy(false)
      updateUserState?.(data, avatarUrl)
      Alert.alert(i18n.t(`form_saved_title`), i18n.t(`form_saved_messaged`))
    } catch (e) {
      setBusy(false)
      Alert.alert(
        i18n.t(`creator_form_error_title`),
        i18n.t(`creator_form_error_message`)
      )
    }
  }

  const handleMediaPicked = (response: ImagePickerResponse) => {
    if (
      response.type === 'image/jpg' ||
      response.type === 'image/jpeg' ||
      response.type === 'image/png'
    ) {
      if (response.uri) {
        setAvatarUrl(response.uri)
        uploadMedia(createFormData(response))
      }
    }
  }
  const uploadMedia = async (data: FormData) => {
    if (data) {
      const res = await upload.mutateAsync(data)
      if (res) {
        const { file } = res
        setUploadedMedia(file)
      }
    }
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <SafeWrapper>
          <Container>
            <AvatarSection>
              <AvatarWrapper>
                <InnerAvatarWrapper>
                  <RemoteImage source={avatarUrl} />
                </InnerAvatarWrapper>
                <AvatarButton onPress={() => setMediaPicker(true)}>
                  <Icon name="cameraBold" size={20} />
                </AvatarButton>
              </AvatarWrapper>
            </AvatarSection>
            <KeyboardAwareScrollView enableOnAndroid>
              <Field>
                <LabelWrapper>
                  <Label>{i18n.t('label_username')}</Label>
                  {errors.username?.type === 'required' && (
                    <ErrorLabel>{`*${i18n.t('label_required')}`}</ErrorLabel>
                  )}
                </LabelWrapper>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={(value: string) => onChange(value)}
                      value={value}
                    />
                  )}
                  name="username"
                  rules={{ required: true }}
                />
              </Field>
              <Field>
                <LabelWrapper>
                  <Label>{i18n.t('label_email')}</Label>
                  {errors.email?.message !== undefined && (
                    <ErrorLabel>{errors.email?.message}</ErrorLabel>
                  )}
                </LabelWrapper>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      keyboardType="email-address"
                      onBlur={onBlur}
                      onChangeText={(value: string) => onChange(value)}
                      value={value}
                    />
                  )}
                  name="email"
                  rules={{
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Email not valid',
                    },
                  }}
                />
              </Field>
              <Field>
                <Label>{i18n.t('label_first_name')}</Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={(value: string) => onChange(value)}
                      value={value}
                    />
                  )}
                  name="firstName"
                />
              </Field>
              <Field>
                <Label>{i18n.t('label_last_name')}</Label>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      onBlur={onBlur}
                      onChangeText={(value: string) => onChange(value)}
                      value={value}
                    />
                  )}
                  name="lastName"
                />
              </Field>
            </KeyboardAwareScrollView>
            <Action
              disabled={isBusy}
              onPress={handleSubmit(handleSave)}
              style={{ marginTop: k.sizes.defPadding }}
            >
              {isBusy ? (
                <Spinner
                  type="ThreeBounce"
                  color="white"
                  style={{
                    marginTop: k.isAndroid ? 0 : -10,
                  }}
                />
              ) : (
                <Button.Label style={{ color: 'white' }}>
                  {i18n.t('button_save')}
                </Button.Label>
              )}
            </Action>
          </Container>
        </SafeWrapper>
      </TouchableWithoutFeedback>
      <MediaPicker
        isVisible={showMediaPicker}
        onClose={() => setMediaPicker(false)}
        onPick={handleMediaPicked}
        type="image"
      />
    </>
  )
}

const Container = styled.View`
  ${tw(`flex-1 p-8`)}
`
const Field = styled.View`
  ${tw(``)}
`
const Input = styled.TextInput`
  ${tw(`w-full h-12 rounded-lg px-4 mb-4`)};
  font-size: 16px;
  color: ${({ theme }) => theme.text.body};
  background-color: ${({ theme }) => theme.backgroundAlt};
`
const Label = styled.Text`
  ${tw(`text-sm font-medium mb-2`)};
  color: ${({ theme }) => theme.text.body};
`
const AvatarSection = styled.View`
  ${tw(`flex-1 w-full items-center justify-center mb-6`)};
`
const AvatarWrapper = styled.View`
  ${tw(`rounded-full border-4`)};
  width: 98px;
  height: 98px;
  elevation: 2;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
  background-color: ${({ theme }) => theme.backgroundAlt};
  border-color: ${({ theme }) => theme.border};
`
const InnerAvatarWrapper = styled.View`
  ${tw(`h-full w-full rounded-full overflow-hidden`)}
`
const AvatarButton = styled.TouchableOpacity`
  ${tw(
    `absolute h-11 w-11 -right-4 -top-4
    rounded-full items-center justify-center border-4`
  )};
  border-color: ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.secondary.tint};
`
const LabelWrapper = styled.View`
  ${tw(`flex-row flex-1 justify-between items-center`)}
`
const ErrorLabel = styled.Text`
  ${tw(`flex-1 text-xs text-red-500 text-right`)};
`
const Action = styled.TouchableOpacity`
  ${tw(`h-10 w-full flex-row rounded-full px-4
  items-center justify-center`)};
  background-color: ${({ theme }) => theme.primary.tint};
`
