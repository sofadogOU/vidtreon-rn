import React from 'react'
import {
  NativeSyntheticEvent,
  Switch,
  TextInputSubmitEditingEventData,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import SelectDropdown from 'react-native-select-dropdown'
import uniqueId from 'lodash-es/uniqueId'
import clone from 'lodash-es/clone'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Icon } from '../icon.component'
import { RemoteImage } from '../remote-image.component'
import { NewsItem, useCategories } from '@/hooks'
import { TextStyle, ViewStyle } from 'react-native'
import {
  launchImageLibrary,
  ImagePickerResponse,
  AndroidVideoOptions,
  iOSVideoOptions,
  PhotoQuality,
} from 'react-native-image-picker'

export type UploadFormData = {
  videoData: ImagePickerResponse | undefined
  thumbnailData?: ImagePickerResponse | string
  title: string | undefined
  description: string | undefined
  tags?: Tag[]
  category?: string
  isPublic: boolean
}

type Tag = {
  id: string
  text: string
}

type Category = Tag

type Action =
  | 'video'
  | 'thumbnail'
  | 'title'
  | 'description'
  | 'category'
  | 'tags'
  | 'visibility'

type Payloads = {
  video: ImagePickerResponse
  thumbnail: ImagePickerResponse
  title: string
  description: string
  category: Category
  tags: Tag[]
  visibility: boolean
}

type Payload<T extends Action> = Payloads[T]

interface Props {
  onDataChange: (data: UploadFormData) => void
  data?: NewsItem
}

const reducer = (
  state: UploadFormData,
  action: { type: Action; payload: Payload<typeof action.type> }
): UploadFormData => {
  switch (action.type) {
    case 'video': {
      const pl = action.payload as ImagePickerResponse
      if (pl && !pl.didCancel) {
        return { ...state, videoData: pl }
      } else {
        return { ...state }
      }
    }
    case 'thumbnail': {
      const pl = action.payload as ImagePickerResponse
      if (pl && !pl.didCancel) {
        if (
          pl.type === 'image/jpg' ||
          pl.type === 'image/jpeg' ||
          pl.type === 'image/png'
        ) {
          return { ...state, thumbnailData: pl }
        }
      } else {
        return { ...state }
      }
    }
    case 'title': {
      const pl = action.payload as string
      console.log('TITLE')
      console.log(pl)
      return {
        ...state,
        title: pl !== '' ? pl : undefined,
      }
    }
    case 'description': {
      const pl = action.payload as string
      console.log('TITLE')
      console.log(pl)
      return {
        ...state,
        description: pl !== '' ? pl : undefined,
      }
    }
    case 'category': {
      const pl = action.payload as Category
      return {
        ...state,
        category: pl.id,
      }
    }
    case 'tags': {
      const pl = action.payload as Tag[]
      return {
        ...state,
        tags: pl,
      }
    }
    case 'visibility': {
      const pl = action.payload as boolean
      return {
        ...state,
        isPublic: pl,
      }
    }
    default:
      return state
  }
}

export const VideoUpload = (props: Props) => {
  const initialState: UploadFormData = {
    videoData: undefined,
    thumbnailData: props.data?.thumbnail || undefined,
    title: props.data?.title || undefined,
    description: props.data?.description || undefined,
    tags:
      props.data?.tags?.map(item => ({ id: uniqueId(), text: item })) ||
      undefined,
    category: props.data?.categoryId || undefined,
    isPublic: props.data?.status === 'pushed_to_feed',
  }

  const theme = useTheme()
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const [tagText, setTagText] = React.useState<string>()
  const { data: categoryData } = useCategories()

  const mediaOptions = React.useMemo(
    () => ({
      maxWidth: 600,
      maxHeight: 600,
      quality: 0.5 as PhotoQuality,
      videoQuality: 'medium' as AndroidVideoOptions | iOSVideoOptions,
    }),
    []
  )

  React.useEffect(() => {
    props.onDataChange(state)
  }, [state])

  const handlePickMedia = React.useCallback(() => {
    launchImageLibrary({ mediaType: 'video', ...mediaOptions }, response =>
      dispatch({ type: 'video', payload: response })
    )
  }, [mediaOptions])

  const handlePickImage = React.useCallback(() => {
    launchImageLibrary({ mediaType: 'photo', ...mediaOptions }, response =>
      dispatch({ type: 'thumbnail', payload: response })
    )
  }, [mediaOptions])

  const handleCategoryChange = React.useCallback((value: string) => {
    console.log(value)
    dispatch({ type: 'category', payload: value })
  }, [])

  const dropdownButtonStyle: ViewStyle = React.useMemo(
    () => ({
      backgroundColor: theme.background,
      borderRadius: 8,
      height: 44,
      width: '100%',
      elevation: 2,
      shadowOffset: { width: 0, height: 2 },
      shadowColor: 'rgba(0,0,0)',
      shadowOpacity: 0.1,
      shadowRadius: 2,
      overflow: 'visible',
    }),
    [theme]
  )

  const dropdownTextStyle: TextStyle = React.useMemo(
    () => ({
      fontSize: 14,
      color: state.category ? theme.text.body : theme.text.muted,
    }),
    [theme, state.category]
  )

  const dropdownRowStyle: ViewStyle = React.useMemo(() => ({}), [])

  const handleRemoveTag = (id: string) => {
    if (state.tags) {
      const copy = clone(state.tags).filter(item => item.id !== id)
      dispatch({ type: 'tags', payload: copy })
    }
  }

  const handleAddTag = ({
    nativeEvent,
  }: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    const { text } = nativeEvent
    if (text && text !== '') {
      const tag = { id: uniqueId(), text }
      console.log(tag)
      dispatch({
        type: 'tags',
        payload: state.tags ? [...state.tags, tag] : [tag],
      })
      setTagText('')
    }
  }

  return (
    <KeyboardAwareScrollView enableOnAndroid>
      <Wrapper>
        {!props.data && (
          <RowButton onPress={handlePickMedia}>
            <RowContainer>
              <RowLabel bold>Please select a video to upload</RowLabel>
              <RowLabel small muted>
                MP4, MOV, WMV (up to 500MB)
              </RowLabel>
            </RowContainer>
            <RowContainer>
              <RowIcon>
                {(!state.videoData || state.videoData.didCancel) && (
                  <Icon name="video" size="md" color={theme.text.muted} />
                )}
                {state.videoData && !state.videoData.didCancel && (
                  <Icon name="tick" size="sm" color={theme.text.muted} />
                )}
              </RowIcon>
            </RowContainer>
          </RowButton>
        )}
        <RowButton onPress={handlePickImage}>
          <RowContainer>
            <RowLabel bold>Please select a thumbnail image</RowLabel>
            <RowLabel small muted>
              Optional
            </RowLabel>
          </RowContainer>
          <RowContainer>
            {!state.thumbnailData && (
              <RowIcon>
                <Icon name="image" size="md" color={theme.text.muted} />
              </RowIcon>
            )}
            {state.thumbnailData && (
              <ThumbnailWrapper>
                <RemoteImage
                  source={
                    typeof state.thumbnailData === 'string'
                      ? state.thumbnailData
                      : state.thumbnailData.uri!
                  }
                  resizeMode="cover"
                  style={{ borderRadius: 8 }}
                />
              </ThumbnailWrapper>
            )}
          </RowContainer>
        </RowButton>
        <DetailsContainer>
          <DetailRow>
            <FieldLabelContainer>
              <FieldLabel bold>Title</FieldLabel>
            </FieldLabelContainer>
            <Field
              defaultValue={props.data?.title}
              onChangeText={text => dispatch({ type: 'title', payload: text })}
            />
          </DetailRow>
          <DetailRow>
            <FieldLabel bold>Description</FieldLabel>
            <MultilineWrapper>
              <MultilineField
                multiline
                defaultValue={props.data?.description}
                onChangeText={text =>
                  dispatch({ type: 'description', payload: text })
                }
              />
            </MultilineWrapper>
          </DetailRow>
          <DetailRow>
            <FieldLabelContainer>
              <FieldLabel bold>Category</FieldLabel>
              <FieldLabel small muted>
                Optional
              </FieldLabel>
            </FieldLabelContainer>
            {categoryData && (
              <SelectDropdown
                data={categoryData}
                defaultValue={
                  state.category
                    ? categoryData.filter(item => item.id === state.category)[0]
                    : null
                }
                rowTextForSelection={item => item.title}
                buttonTextAfterSelection={selectedItem => selectedItem.title}
                onSelect={handleCategoryChange}
                buttonStyle={dropdownButtonStyle}
                buttonTextStyle={dropdownTextStyle}
                rowStyle={dropdownRowStyle}
                defaultButtonText="Select an option"
                renderCustomizedRowChild={item => (
                  <DDRow>
                    <DDLabel>{item}</DDLabel>
                  </DDRow>
                )}
              />
            )}
          </DetailRow>
          <DetailRow>
            <FieldLabelContainer>
              <FieldLabel bold>Tags</FieldLabel>
              <FieldLabel small muted>
                Optional
              </FieldLabel>
            </FieldLabelContainer>
            <Field
              onSubmitEditing={handleAddTag}
              value={tagText}
              onChangeText={setTagText}
              returnKeyType="done"
              returnKeyLabel="Add"
            />
            {state && state.tags && state.tags.length > 0 && (
              <TagContainer>
                {state.tags?.map(item => (
                  <Tag key={item.id}>
                    <TagLabel>{item.text}</TagLabel>
                    <TagRemoveButton onPress={() => handleRemoveTag(item.id)}>
                      <Icon name="close" size="xs" color={theme.text.muted} />
                    </TagRemoveButton>
                  </Tag>
                ))}
              </TagContainer>
            )}
          </DetailRow>
          {props.data && (
            <DetailRow>
              <FieldLabel bold>Visibility</FieldLabel>
              <SwitchRow>
                {state.isPublic && (
                  <SwitchTextContainer>
                    <RowLabel>Public</RowLabel>
                    <RowLabel small muted numberOfLines={1}>
                      Subscribers can watch your video
                    </RowLabel>
                  </SwitchTextContainer>
                )}
                {!state.isPublic && (
                  <SwitchTextContainer>
                    <RowLabel>Private</RowLabel>
                    <RowLabel small muted>
                      No one can watch your video
                    </RowLabel>
                  </SwitchTextContainer>
                )}
                <Switch
                  disabled={false}
                  trackColor={{
                    true: theme.primary.tint,
                    false: 'grey',
                  }}
                  value={state.isPublic}
                  onValueChange={v => {
                    dispatch({ type: 'visibility', payload: v })
                  }}
                />
              </SwitchRow>
            </DetailRow>
          )}
        </DetailsContainer>
      </Wrapper>
    </KeyboardAwareScrollView>
  )
}

const Wrapper = styled.View`
  ${tw(`p-4`)};
`
const RowButton = styled.TouchableOpacity`
  ${tw(`justify-between items-center p-4 rounded-md flex-row mb-4`)};
  background-color: ${({ theme }) => theme.backgroundDark};
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
`
const RowContainer = styled.View``

const RowIcon = styled.View`
  ${tw(`flex-1 items-center justify-center p-2 rounded-md`)};
  background-color: ${({ theme }) => theme.background};
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  elevation: 2;
  min-width: 50px;
`
const RowLabel = styled.Text<{
  small?: boolean
  muted?: boolean
  bold?: boolean
}>`
  ${tw(`text-sm`)};
  ${({ small }) => small && `font-size: 12px`};
  ${({ bold }) => bold && `font-weight: 600`}
  color: ${({ theme, muted }) => (muted ? theme.text.muted : theme.text.body)};
`
const DetailsContainer = styled.View`
  ${tw(`rounded-md items-start justify-start p-4 pb-0`)};
  background-color: ${({ theme }) => theme.backgroundDark};
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  elevation: 2;
`
const DetailRow = styled.View`
  ${tw(`w-full items-start justify-start mb-4`)}
`
const FieldLabel = styled(RowLabel)`
  ${tw(`mb-2`)}
`
const Field = styled.TextInput<{ disabled?: boolean }>`
  ${tw(`h-11 w-full px-3 rounded-md`)};
  background-color: ${({ theme }) => theme.background};
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  elevation: 2;
  color: ${({ theme }) => theme.text.body};
  ${({ disabled }) => disabled && `opacity: 0.75`};
`
const MultilineWrapper = styled.View`
  ${tw(`w-full px-3 py-3 rounded-md`)};
  height: 88px;
  background-color: ${({ theme }) => theme.background};
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  elevation: 2;
  color: ${({ theme }) => theme.text.body};
`
const MultilineField = styled.TextInput`
  ${tw(`w-full h-full`)};
  color: ${({ theme }) => theme.text.body};
`
const DDRow = styled.View`
  ${tw(`flex-1 items-center justify-center`)}
`
const DDLabel = styled.Text`
  ${tw(`text-sm text-center`)}
`
const SwitchRow = styled.View`
  ${tw(`flex-row p-4 items-center rounded-md`)};
  background-color: ${({ theme }) => theme.background};
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  elevation: 2;
`
const SwitchTextContainer = styled.View`
  ${tw(`flex-1 justify-start items-start mr-4`)}
`
const ThumbnailWrapper = styled.View`
  ${tw(`flex-1 rounded-md`)};
  background-color: ${({ theme }) => theme.background};
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  elevation: 2;
  min-width: 50px;
`
const TagContainer = styled.View`
  ${tw(`mt-4 w-full flex-row flex-wrap`)}
`
const Tag = styled.View`
  ${tw(`rounded-full flex-row items-center justify-center mr-2 mb-2`)};
  background-color: ${({ theme }) => theme.background};
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  elevation: 2;
`
const TagLabel = styled.Text`
  ${tw(`text-xs font-semibold py-2 pl-3`)};
  color: ${({ theme }) => theme.text.muted};
`
const TagRemoveButton = styled.TouchableOpacity`
  ${tw(`py-2 pr-2 pl-1`)};
`
const FieldLabelContainer = styled.View`
  ${tw(`w-full flex-row justify-between`)}
`
