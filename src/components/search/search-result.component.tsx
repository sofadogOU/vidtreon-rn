import * as React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'

import * as k from '@/utils/constants'
import { Video } from '@/hooks'
import { millisToMinutesAndSeconds } from '@/utils/video-helpers.util'

import { RemoteImage } from '../remote-image.component'
import { Icon } from '../icon.component'

interface Props {
  item: Video
  isLastChild?: boolean
  onItemPress: () => void
  onChannelPress: () => void
  showWatchbar?: boolean
}

export const SearchResult = ({
  item,
  isLastChild,
  onItemPress,
  onChannelPress,
  showWatchbar,
}: Props) => {
  const theme = useTheme()

  return (
    <TouchableWithoutFeedback
      onPress={item.isPremium ? onChannelPress : onItemPress}
    >
      <Wrapper isLastChild={!!isLastChild}>
        <Container showWatchbar={!!showWatchbar}>
          <InnerWrapper>
            <PosterWrapper>
              <RemoteImage source={item.posterUrl} />
            </PosterWrapper>
            <DetailWrapper>
              <MainWrapper>
                <Title numberOfLines={1} ellipsizeMode="tail">
                  {item.title}
                </Title>
                <Description numberOfLines={2} ellipsizeMode="tail">
                  {item.description}
                </Description>
                <Author>
                  {item.isPremium && (
                    <PremiumBadgeWrapper>
                      <PremiumBadge>
                        <Icon name="premium" size={10} color={theme.white} />
                      </PremiumBadge>
                    </PremiumBadgeWrapper>
                  )}
                  <AvatarWrapper>
                    <RemoteImage source={item.channel?.avatarUrl} />
                  </AvatarWrapper>
                  <AuthorLabel numberOfLines={1} ellipsizeMode="tail">
                    {item.channel?.name}
                  </AuthorLabel>
                </Author>
              </MainWrapper>
              <Footer>
                <LeftWrapper>
                  <FooterItem>
                    <Icon name="heartFill" size={11} color={theme.text.muted} />
                    <FooterLabel>{item.likes}</FooterLabel>
                  </FooterItem>
                  <FooterItem>
                    <Icon name="eye" size={13} color={theme.text.muted} />
                    <FooterLabel>{item.viewCount}</FooterLabel>
                  </FooterItem>
                </LeftWrapper>
                <Duration>{millisToMinutesAndSeconds(item.duration)}</Duration>
              </Footer>
            </DetailWrapper>
          </InnerWrapper>
          {typeof item.seekPosition === 'number' && (
            <ProgressContainer>
              <ProgressBar seekPos={item.seekPosition} />
            </ProgressContainer>
          )}
        </Container>
      </Wrapper>
    </TouchableWithoutFeedback>
  )
}

const Wrapper = styled.View<{ isLastChild: boolean }>`
  ${tw(`w-full px-4 pb-4 h-full`)};
  padding-top: 1px;
  height: 112px;
  ${({ isLastChild }) => isLastChild && `padding-bottom: 16px`};
`
const Container = styled.View<{ showWatchbar: boolean }>`
  ${tw(`items-start w-full p-3 rounded-xl`)};
  background-color: ${({ theme }) => theme.cardBg};
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
  elevation: 3;
  ${({ showWatchbar }) =>
    showWatchbar &&
    `border-bottom-left-radius: 0px; 
    border-bottom-right-radius: 0px;
    padding-bottom: 16px`}
`
const InnerWrapper = styled.View`
  ${tw(`flex-row`)}
`
const MainWrapper = styled.View``
const PosterWrapper = styled.View`
  ${tw(`h-full rounded-lg overflow-hidden mr-4 bg-black`)};
  width: ${k.screen.w * 0.22}px;
`
const DetailWrapper = styled.View`
  ${tw(`flex-1 justify-between`)}
`
const Title = styled.Text`
  ${tw(`text-xs font-semibold mb-1`)};
  color: ${({ theme }) => theme.text.body};
`
const Description = styled.Text`
  ${tw(`text-xs font-normal h-8`)};
  color: ${({ theme }) => theme.text.muted};
`
const Author = styled.View`
  ${tw(`w-full flex-row mt-2 items-center`)}
`
const AuthorLabel = styled.Text`
  ${tw(`font-semibold flex-initial flex-shrink`)};
  font-size: 9px;
  color: ${({ theme }) => theme.text.body};
`
const AvatarWrapper = styled.View`
  ${tw(`rounded-xl overflow-hidden w-5 h-5 mr-1`)};
`
const Footer = styled.View`
  ${tw(`flex-row items-center justify-between pt-2`)}
`
const LeftWrapper = styled.View`
  ${tw(`flex-row items-center`)}
`
const FooterItem = styled.View`
  ${tw(`py-1 px-2 items-center flex-row rounded-full mr-1`)};
  background-color: ${({ theme }) => theme.backgroundAlt};
`
const FooterLabel = styled.Text`
  ${tw(`text-xs font-medium ml-1 uppercase`)};
  font-size: 11px;
  color: ${({ theme }) => theme.text.muted};
`
const Duration = styled.Text`
  ${tw(`text-xs font-medium`)};
  color: ${({ theme }) => theme.text.muted};
`
const ProgressContainer = styled.View`
  ${tw(`absolute bottom-0 left-0 right-0 h-1`)};
  background-color: ${({ theme }) => theme.backgroundAlt};
`
const ProgressBar = styled.View<{ seekPos: number }>`
  ${tw(`absolute w-full h-1`)};
  width: ${({ seekPos }) => seekPos}%;
  background-color: ${({ theme }) => theme.progressBg};
`
const PremiumBadge = styled.View`
  ${tw(`h-full w-full items-center justify-center`)}
`
const PremiumBadgeWrapper = styled.View`
  ${tw(
    `rounded-full overflow-hidden items-center justify-center h-5 w-5 mr-1`
  )};
  background-color: ${({ theme }) => theme.tag.gold.bg};
`
