import * as React from 'react'
import { ListRenderItem, FlatList, KeyboardAvoidingView } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FlatList as RNGHFlatList } from 'react-native-gesture-handler'

import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'

import * as k from '@/utils/constants'
import { useTranslation } from '@/providers/TranslationProvider'
import { useKeyboard, Comment } from '@/hooks'
import { CommentsMessage } from './comments-message.component'

interface Props {
  items?: Comment[]
  userId: string
  onCommentPlay: () => void
  onCommentReply: (id: string, name: string) => void
  onCommentLike: (id: string, isLiked: boolean) => void
  onRepliesPress: (id: string) => void
  onReportComment: (id: string) => void
  isShowing: boolean
  commentingEnabled: boolean
}

export const CommentsList = React.forwardRef<KeyboardAwareFlatList, Props>(
  (
    {
      items,
      userId,
      onCommentPlay,
      onCommentReply,
      onCommentLike,
      onRepliesPress,
      onReportComment,
      isShowing,
      commentingEnabled,
    }: Props,
    parentRef
  ) => {
    const flatlistRef = React.useRef<FlatList>(null)

    const insets = useSafeAreaInsets()
    const i18n = useTranslation()

    const [selectedIdx, setSelectedIdx] = React.useState(-1)

    React.useEffect(() => {
      if (!isShowing) {
        setSelectedIdx(-1)
      }
    }, [isShowing])

    const [keyboardVisible, keyboardHeight] = useKeyboard({
      useWillShow: k.isAndroid ? false : true,
      useWillHide: k.isAndroid ? false : true,
    })

    const scrollToIndexFailed = React.useCallback(() => {
      const wait = new Promise(resolve => setTimeout(resolve, 0))
      wait.then(() => {
        flatlistRef.current?.scrollToEnd()
      })
    }, [])

    const renderMessage: ListRenderItem<Comment> = React.useCallback(
      ({ item, index }) => {
        const handleCommentPlay = () => {
          setSelectedIdx(index)
          onCommentPlay()
        }
        return (
          item && (
            <CommentsMessage
              key={item.id}
              userId={userId}
              item={item}
              onPlayVideo={handleCommentPlay}
              playVideo={selectedIdx === index}
              onReply={onCommentReply}
              onRepliesPress={onRepliesPress}
              onGotoReply={id => null}
              onCommentLike={onCommentLike}
              commentingEnabled={commentingEnabled}
              onReport={onReportComment}
            />
          )
        )
      },
      [
        commentingEnabled,
        onCommentLike,
        onCommentReply,
        onCommentPlay,
        selectedIdx,
        userId,
        onRepliesPress,
        onReportComment,
      ]
    )

    const emptyContainerStyle = React.useMemo(
      () => ({
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }),
      []
    )

    const iosListStyle = React.useMemo(
      () => ({
        paddingHorizontal: 16,
        marginBottom: !commentingEnabled ? 0 : insets.bottom + 40,
        paddingTop: 16,
      }),
      [insets, commentingEnabled]
    )

    const androidListStyle = React.useMemo(
      () => ({
        marginBottom: !commentingEnabled
          ? insets.bottom
          : keyboardVisible
          ? keyboardHeight + insets.bottom + 70 + k.navBarHeight
          : insets.bottom + 40 + k.navBarHeight,
        paddingTop: 16,
        paddingHorizontal: 16,
      }),
      [insets, keyboardHeight, keyboardVisible, commentingEnabled]
    )

    return (
      <SafeWrapper>
        {!items && (
          <EmptyContainer
            contentContainerStyle={emptyContainerStyle as any}
            behavior="position"
          >
            <EmptyPlaceholder>
              {`Error loading comments \nPlease try again later`}
            </EmptyPlaceholder>
          </EmptyContainer>
        )}
        {items?.length === 0 ? (
          <EmptyContainer
            contentContainerStyle={emptyContainerStyle as any}
            behavior="position"
          >
            <EmptyPlaceholder>
              {!!userId
                ? commentingEnabled
                  ? i18n.t('comment_empty_placeholder')
                  : i18n.t('comment_subscribe_placeholder')
                : i18n.t('comment_login_placeholder')}
            </EmptyPlaceholder>
          </EmptyContainer>
        ) : (
          items &&
          items.length > 0 &&
          (k.isAndroid ? (
            <RNGHFlatList
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="none"
              ref={ref => {
                // @ts-ignore
                parentRef.current = ref
                // @ts-ignore
                flatlistRef.current = ref
              }}
              data={items}
              removeClippedSubviews
              onScrollToIndexFailed={scrollToIndexFailed}
              renderItem={renderMessage as ListRenderItem<unknown>}
              style={androidListStyle}
            />
          ) : (
            <KeyboardAwareFlatList
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="none"
              innerRef={ref => {
                // @ts-ignore
                flatlistRef.current = ref
              }}
              ref={ref => {
                // @ts-ignore
                parentRef.current = ref
              }}
              data={items}
              removeClippedSubviews
              onScrollToIndexFailed={scrollToIndexFailed}
              renderItem={renderMessage as ListRenderItem<unknown>}
              style={iosListStyle}
            />
          ))
        )}
      </SafeWrapper>
    )
  }
)

const SafeWrapper = styled.SafeAreaView`
  ${tw(`flex-1 h-full w-full`)};
`
const EmptyContainer = styled(KeyboardAvoidingView)`
  ${tw(`flex-1`)}
`
const EmptyPlaceholder = styled.Text`
  ${tw(`text-white text-base text-center`)}
`
