import * as React from 'react'
import { Animated } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import faker from 'faker'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BottomSheet, {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
} from '@gorhom/bottom-sheet'

import * as k from '@/utils/constants'
import { IconNamesEnum } from '../icon.component'
import { Icon } from '../icon.component'

type SnapPoints = '10%' | '20%' | '30%' | '50%' | '100%' | number
type ToastModalType = 'normal' | 'modal'
const ITEM_HEIGHT = 48

export type ToastModalItem = {
  title: string
  iconName?: IconNamesEnum
  onPress: () => void
}

interface Props {
  type?: ToastModalType
  snapPoints?: SnapPoints[]
  items: ToastModalItem[]
}

const BackgroundComponent: React.FC<BottomSheetBackgroundProps> = ({
  style,
}) => {
  const theme = useTheme()
  const backgroundStyle = React.useMemo(
    () => ({
      backgroundColor: theme.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    }),
    [theme]
  )

  const containerStyle = React.useMemo(
    () => [style, backgroundStyle],
    [style, backgroundStyle]
  )
  return React.useMemo(
    () => <Animated.View style={containerStyle} />,
    [containerStyle]
  )
}

export const ToastModal = React.forwardRef<
  BottomSheetModal | BottomSheet,
  Props
>(({ type = 'normal', snapPoints, items }: Props, parentRef) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  const _snapPoints = React.useMemo(
    () =>
      snapPoints || [
        ITEM_HEIGHT * items.length +
          insets.bottom +
          (k.isAndroid ? 16 : insets.bottom === 0 ? 12 : 0),
      ],
    [snapPoints, items, insets]
  )
  const isFullScreen = _snapPoints.length === 1 && _snapPoints[0] === '100%'

  const renderBackdrop = React.useMemo(() => BottomSheetBackdrop, [])

  const renderHandle = React.useMemo(
    () => (isFullScreen ? () => <ModalHandle /> : undefined),
    [isFullScreen]
  )

  const renderContent = React.useCallback(
    (item: ToastModalItem) => (
      <ItemPressable key={faker.datatype.uuid()} onPress={item.onPress}>
        <ItemContainer>
          {item.iconName && (
            <IconView
              name={item.iconName}
              size="sm"
              containerStyle={{ marginRight: k.sizes.md }}
              color={theme.text.body}
            />
          )}
          <ItemLabel>{item.title}</ItemLabel>
        </ItemContainer>
      </ItemPressable>
    ),
    [theme]
  )

  return type === 'normal' ? (
    <BaseModal
      key={faker.datatype.uuid()}
      ref={parentRef as any}
      index={0}
      snapPoints={_snapPoints}
      backdropComponent={renderBackdrop}
      backgroundComponent={BackgroundComponent}
      handleComponent={renderHandle}
      isFullScreen
    >
      <Wrapper>{items.map(item => renderContent(item))}</Wrapper>
    </BaseModal>
  ) : (
    <OverlayModal
      key={faker.datatype.uuid()}
      ref={parentRef}
      index={0}
      snapPoints={[0, _snapPoints[0]]}
      backdropComponent={renderBackdrop}
      backgroundComponent={BackgroundComponent}
      handleComponent={renderHandle}
      isFullScreen
    >
      <Wrapper>{items.map(item => renderContent(item))}</Wrapper>
    </OverlayModal>
  )
})

const BaseModal = styled(BottomSheetModal)<{ isFullScreen: boolean }>`
  box-shadow: ${({ isFullScreen }) =>
    isFullScreen ? 'none' : '0px -6px 12px rgba(0, 0, 0, 0.25)'};
`
const OverlayModal = styled(BottomSheet)<{ isFullScreen: boolean }>`
  box-shadow: ${({ isFullScreen }) =>
    isFullScreen ? 'none' : '0px -6px 12px rgba(0, 0, 0, 0.25)'};
`
const ModalHandle = styled.View`
  ${tw(`h-0 w-full`)}
`
const Wrapper = styled.View``
const ItemPressable = styled.TouchableOpacity`
  ${tw(`w-full h-12 px-6`)}
`
const ItemContainer = styled.View`
  ${tw(`flex-row h-full items-center`)}
`
const ItemLabel = styled.Text`
  ${tw(`text-sm ml-1 font-medium`)};
  color: ${({ theme }) => theme.text.body};
`
const IconView = styled(Icon)`
  color: ${({ theme }) => theme.text.body};
`
