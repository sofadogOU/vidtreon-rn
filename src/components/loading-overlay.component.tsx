import * as React from 'react'
import Spinner from 'react-native-spinkit'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import { MotiView } from 'moti'

interface Props {
  isVisible: boolean
  message?: string
}

export const LoadingOverlay = ({ isVisible = false, message }: Props) => {
  const [isShowing, setShowing] = React.useState(isVisible)

  React.useEffect(() => {
    setShowing(isVisible)
  }, [isVisible])

  return (
    <Wrapper
      animate={{ opacity: isShowing ? 1 : 0 }}
      transition={{ type: 'timing', duration: 200 }}
      pointerEvents={isShowing ? 'auto' : 'none'}
    >
      <Spinner type="Pulse" size={100} color="white" />
      {message && <Message>{message}</Message>}
    </Wrapper>
  )
}

const Wrapper = styled(MotiView)`
  ${tw(`absolute inset-0 justify-center items-center bg-black bg-opacity-75`)}
`
const Message = styled.Text`
  ${tw(`text-base mt-2 text-center font-semibold`)};
  color: ${({ theme }) => theme.text.light};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
`
