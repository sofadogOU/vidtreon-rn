import * as React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import {
  Notification,
  NotificationComment,
  NotificationTypes,
  Video,
} from '@/hooks'
import { RemoteImage } from '../remote-image.component'

dayjs.extend(relativeTime)

interface Props {
  item: Notification
  isLastChild?: boolean
  onItemPress: () => void
}

const mapTagLabel = (
  type: NotificationTypes,
  resourceType?: 'Video' | 'Comment'
) => {
  if (resourceType === 'Comment') {
    switch (type) {
      case 'liked':
        return 'Liked Comment'
      case 'unliked':
        return 'Unliked Comment'
    }
  }
  switch (type) {
    case 'video_published':
      return 'Liked'
    case 'liked':
      return 'New Video'
    case 'unliked':
      return 'Unliked'
  }
}

const mapBackgroundColor = (
  type: NotificationTypes,
  resourceType?: 'Video' | 'Comment'
) => {
  if (resourceType === 'Comment') {
    switch (type) {
      case 'liked':
        return '#3BB273'
    }
  }

  switch (type) {
    case 'video_published':
      return '#3BB273'
    case 'liked':
      return '#4186f6'
    case 'unliked':
      return '#4A5568'
  }
}

export const ActivityItem = ({ item, isLastChild, onItemPress }: Props) => {
  return (
    <TouchableWithoutFeedback onPress={onItemPress}>
      <Wrapper>
        {item.resourceType === 'Video' && (
          <Container noSeparator={!!isLastChild}>
            <LeftContainer>
              <CoverWrapper>
                <RemoteImage source={(item.resource as Video).coverUrl} />
              </CoverWrapper>
              <DetailsWrapper>
                <Date>
                  {dayjs((item.resource as Video).uploaded).fromNow()}
                </Date>
                <TitleWrapper>
                  <AvatarWrapper>
                    <RemoteImage
                      source={(item.resource as Video).channel.avatarUrl}
                    />
                  </AvatarWrapper>
                  <Title numberOfLines={1} ellipsizeMode="tail">
                    {(item.resource as Video).title}
                  </Title>
                </TitleWrapper>
                <Description numberOfLines={2} ellipsizeMode="tail">
                  {(item.resource as Video).description}
                </Description>
              </DetailsWrapper>
            </LeftContainer>
            <RightContainer>
              <Tag type={item.type} resourceType={item.resourceType}>
                <TagLabel>{mapTagLabel(item.type)}</TagLabel>
              </Tag>
            </RightContainer>
          </Container>
        )}
        {item.resourceType === 'Comment' && (
          <Container noSeparator={!!isLastChild}>
            <LeftContainer>
              <CoverWrapper
                style={{
                  height: 64,
                  width: 64,
                  borderTopLeftRadius: 9999,
                  borderTopRightRadius: 9999,
                  borderBottomLeftRadius: 9999,
                  borderBottomRightRadius: 9999,
                }}
              >
                <RemoteImage
                  source={(item.resource as NotificationComment).user.avatarUrl}
                />
              </CoverWrapper>
              <DetailsWrapper>
                <Date>
                  {dayjs(
                    (item.resource as NotificationComment).createdAt
                  ).fromNow()}
                </Date>
                {(item.type === 'liked' || item.type === 'unliked') && (
                  <TitleWrapper>
                    <Title numberOfLines={1} ellipsizeMode="tail">
                      {(item.resource as NotificationComment).user.username}{' '}
                      {`${item.type === 'liked' ? 'liked' : 'unliked'}`}&hellip;
                    </Title>
                  </TitleWrapper>
                )}
                <Description numberOfLines={2} ellipsizeMode="tail">
                  {(item.resource as NotificationComment).content.text}
                </Description>
              </DetailsWrapper>
            </LeftContainer>
            <RightContainer>
              <Tag type={item.type} resourceType={item.resourceType}>
                <TagLabel>{mapTagLabel(item.type, 'Comment')}</TagLabel>
              </Tag>
            </RightContainer>
          </Container>
        )}
      </Wrapper>
    </TouchableWithoutFeedback>
  )
}

const Wrapper = styled.View`
  ${tw(`flex-1 h-full w-full px-4 pt-4`)};
`
const Container = styled.View<{ noSeparator: boolean }>`
  ${tw(`flex-1 flex-row items-center`)};
  ${({ noSeparator }) => noSeparator && `border-bottom-width: 0px`};
  border-color: ${({ theme }) => theme.backgroundDark};
`
const LeftContainer = styled.View`
  ${tw(`flex-1 flex-row`)}
`
const RightContainer = styled.View`
  ${tw(`ml-4`)}
`
const Tag = styled.View<{
  type: NotificationTypes
  resourceType: 'Video' | 'Comment'
}>`
  ${tw(`p-1 px-2 rounded-full`)};
  ${({ type, resourceType }) =>
    `background-color: ${mapBackgroundColor(type, resourceType)}`};
`
const TagLabel = styled.Text`
  ${tw(`text-xs font-semibold`)};
  color: ${({ theme }) => theme.white};
`
const Title = styled.Text`
  ${tw(`text-xs font-semibold flex-initial flex-shrink`)};
  color: ${({ theme }) => theme.text.body};
`
const Description = styled.Text`
  ${tw(`text-xs mt-2`)};
  color: ${({ theme }) => theme.text.muted};
`
const AvatarWrapper = styled.View`
  ${tw(`h-6 w-6 rounded-full overflow-hidden mr-2`)}
`
const DetailsWrapper = styled.View`
  ${tw(`flex-1 justify-center pl-4`)}
`
const TitleWrapper = styled.View`
  ${tw(`flex-row items-center`)}
`
const Date = styled.Text`
  ${tw(`text-xs mb-2`)};
  color: ${({ theme }) => theme.text.muted};
`
const CoverWrapper = styled.View`
  ${tw(`w-16 rounded-xl overflow-hidden`)}
`
