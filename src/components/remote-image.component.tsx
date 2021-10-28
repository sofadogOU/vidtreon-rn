import React from 'react'
import { StyleProp, View, ImageStyle, ViewStyle } from 'react-native'
import { MotiView } from 'moti'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import FastImage, {
  ImageStyle as FImageStyle,
  ResizeMode,
  Source,
} from 'react-native-fast-image'

import * as k from '@/utils/constants'
import { Placeholder } from './placeholders.component'
import { useIsMounted } from '@/hooks'

type FetchType = 'local' | 'remote'

interface Props {
  source: string
  type?: FetchType
  style?: StyleProp<ImageStyle>
  resizeMode?: ResizeMode
  tintColor?: number | string
  onLoaded?: () => void
}

export const RemoteImage = ({
  source,
  type = 'remote',
  style,
  onLoaded,
  ...rest
}: Props) => {
  const isMounted = useIsMounted()
  const [isLoaded, setLoaded] = React.useState(false)
  const [isHidden, setHidden] = React.useState(false)

  const src = React.useMemo(
    () => (type === 'remote' ? { uri: source } : source),
    [source, type]
  )

  const imageStyle: StyleProp<FImageStyle> = React.useMemo(
    () => ({
      position: 'absolute',
      height: '100%',
      width: '100%',
    }),
    []
  )

  const containerStyle: StyleProp<ViewStyle> = React.useMemo(
    () => ({
      overflow: 'hidden',
      height: '100%',
      width: '100%',
    }),
    []
  )

  const motiStyle: StyleProp<ViewStyle> = imageStyle

  const handleLoaded = React.useCallback(() => {
    if (isMounted()) {
      setLoaded(true)
      // if (k.isAndroid) {
      //   onLoaded?.()
      // }
    }
  }, [isMounted, onLoaded])

  const handleAnimationEnd = React.useCallback(
    (_: string, isFinished: boolean) => {
      if (isFinished && isLoaded && isMounted()) {
        setHidden(true)
        // onLoaded?.()
      }
    },
    [isLoaded, onLoaded, isMounted]
  )

  const opacityStyle = React.useMemo(
    () => ({ opacity: isLoaded ? 1 : 0 }),
    [isLoaded]
  )

  return (
    <View style={[containerStyle, style]}>
      {k.isAndroid ? (
        <>
          {!isLoaded && type !== 'local' && <AndroidPlaceholder />}
          <FastImage
            {...rest}
            style={imageStyle}
            source={src as Source}
            onLoad={handleLoaded}
          />
        </>
      ) : (
        <>
          {!isHidden && type !== 'local' && <Placeholder animate={true} />}
          <MotiView
            style={motiStyle}
            animate={opacityStyle}
            delay={2000}
            transition={{
              type: 'timing',
              duration: 350,
              delay: 50,
            }}
            onDidAnimate={handleAnimationEnd}
          >
            <FastImage
              {...rest}
              style={imageStyle}
              source={src as Source}
              onLoad={handleLoaded}
            />
          </MotiView>
        </>
      )}
    </View>
  )
}

const AndroidPlaceholder = styled.View`
  ${tw(`absolute inset-0`)};
  background-color: ${({ theme }) => theme.backgroundAlt};
`
