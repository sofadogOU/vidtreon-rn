import * as React from 'react'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import Spinner from 'react-native-spinkit'

import { Channel } from '@/hooks'
import { useTranslation } from 'providers/TranslationProvider'
import * as k from '@/utils/constants'

import { Placeholder } from '../placeholders.component'
import { RemoteImage } from '../remote-image.component'

interface Props {
  item: Channel
  isLastChild?: boolean
  onCancelPress: (id: string) => void
  onSubscribePress: (id: string) => void
  showSpinner: boolean
}

export const SubscriptionItem = ({
  item,
  isLastChild,
  onCancelPress,
  onSubscribePress,
  showSpinner,
}: Props) => {
  const i18n = useTranslation()
  const theme = useTheme()

  const renderSpinner = React.useMemo(() => {
    const style = {
      marginHorizontal: 4,
      marginTop: k.isAndroid ? 0 : -5,
    }
    return (
      <Spinner
        type="ThreeBounce"
        size={24}
        color={theme.tab.active}
        style={style}
      />
    )
  }, [theme])

  return item.name !== '' ? (
    <Wrapper>
      <Container noSeparator={!!isLastChild}>
        <AvatarWrapper>
          <RemoteImage source={item.avatarUrl} />
        </AvatarWrapper>
        <DetailWrapper>
          <Title>{item.name}</Title>
          <Description numberOfLines={2} ellipsizeMode="tail">
            {item.description}
          </Description>
          <TagWrapper>
            <StatusTag warn={item.status === 'cancelled'}>
              <StatusLabel>{item.status}</StatusLabel>
            </StatusTag>
            <PriceLabel>
              {item.price !== 0
                ? `${item.price} ${i18n.t('label_coins_month')}`
                : i18n.t('label_free')}
            </PriceLabel>
          </TagWrapper>
        </DetailWrapper>
        <ActionWrapper>
          {item.status === 'cancelled' ? (
            <Action
              onPress={() => onSubscribePress(item.feedId)}
              disabled={showSpinner}
            >
              {showSpinner ? (
                renderSpinner
              ) : (
                <ActionLabel>{i18n.t('button_resubscribe')}</ActionLabel>
              )}
            </Action>
          ) : (
            <Action
              onPress={() => onCancelPress(item.feedId)}
              disabled={showSpinner}
            >
              {showSpinner ? (
                renderSpinner
              ) : (
                <ActionLabel>{i18n.t('button_cancel')}</ActionLabel>
              )}
            </Action>
          )}
        </ActionWrapper>
      </Container>
    </Wrapper>
  ) : (
    <Wrapper>
      <Container noSeparator={!!isLastChild}>
        <AvatarWrapper>
          <Placeholder animate />
        </AvatarWrapper>
        <DetailWrapper>
          <PlaceholderTitle>
            <Placeholder animate />
          </PlaceholderTitle>
          <PlaceholderDescription>
            <Placeholder animate />
          </PlaceholderDescription>
          <PlaceholderDescription>
            <Placeholder animate />
          </PlaceholderDescription>
        </DetailWrapper>
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.View`
  ${tw(`w-full px-4`)}
`
const Container = styled.View<{ noSeparator: boolean }>`
  ${tw(`flex-row items-center w-full py-4 border-b`)};
  ${({ noSeparator }) => noSeparator && `border-bottom-width: 0px`};
  border-color: ${({ theme }) => theme.backgroundDark};
`
const AvatarWrapper = styled.View`
  ${tw(`h-11 w-11 rounded-full overflow-hidden`)}
`
const DetailWrapper = styled.View`
  ${tw(`flex-1 ml-3`)}
`
const Title = styled.Text`
  ${tw(`text-sm font-semibold h-5`)};
  color: ${({ theme }) => theme.text.body};
`
const Description = styled.Text`
  ${tw(`text-xs font-normal h-8`)};
  color: ${({ theme }) => theme.text.muted};
`
const TagWrapper = styled.View`
  ${tw(`flex-row mt-2 items-center h-6`)};
`
const Tag = styled.View`
  ${tw(`py-1 px-2 rounded-full mr-1`)};
  background-color: ${({ theme }) => theme.backgroundAlt};
`
const TagLabel = styled.Text`
  ${tw(`text-xs font-normal`)};
  color: ${({ theme }) => theme.text.muted};
`
const StatusTag = styled(Tag)<{ warn: boolean }>`
  background-color: ${({ theme, warn }) =>
    warn ? theme.tag.red.bg : theme.tag.green.bg};
`
const StatusLabel = styled(TagLabel)`
  ${tw(`capitalize font-semibold`)}
  color: ${({ theme }) => theme.social.text};
`
const PlaceholderTitle = styled.View`
  ${tw(`w-3/4 h-4 rounded-sm overflow-hidden`)}
`
const PlaceholderDescription = styled.View`
  ${tw(`w-full h-2 mt-2 rounded-sm overflow-hidden`)}
`
const ActionWrapper = styled.View`
  ${tw(`items-center justify-center`)}
`
const Action = styled.TouchableOpacity`
  ${tw(`px-2 ml-4 h-8 items-center justify-center rounded-md`)};
  background-color: ${({ theme }) => theme.backgroundAlt};
`
const ActionLabel = styled.Text`
  ${tw(`text-xs`)};
  color: ${({ theme }) => theme.tab.active};
`
const PriceLabel = styled.Text`
  ${tw(`ml-1 text-xs font-medium`)};
  color: ${({ theme }) => theme.tab.active};
`
