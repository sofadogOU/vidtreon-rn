import * as React from 'react'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import { Channel } from '@/hooks'

import { RemoteImage } from '../remote-image.component'
import { Placeholder } from '../placeholders.component'

interface Props {
  item: Channel
  isLastChild?: boolean
  onItemPress: () => void
}

export const ChannelItem = ({ item, isLastChild, onItemPress }: Props) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        item.avatarUrl ? onItemPress() : null
      }}
    >
      <Wrapper>
        <Container noSeparator={!!isLastChild}>
          <AvatarWrapper>
            <RemoteImage source={item.avatarUrl} />
          </AvatarWrapper>
          {item.name && item.description && (
            <DetailWrapper>
              <TitleWrapper>
                <Title numberOfLines={1} ellipsizeMode="tail">
                  {item.name?.trim()}
                </Title>
                {!!item.followerCount && item.followerCount !== 0 ? (
                  <FollowerTag>
                    <FollowerLabel>
                      {item.followerCount} Followers
                    </FollowerLabel>
                  </FollowerTag>
                ) : null}
              </TitleWrapper>
              <Description numberOfLines={2} ellipsizeMode="tail">
                {item.description?.trim()}
              </Description>
              <TagWrapper horizontal showsHorizontalScrollIndicator={false}>
                {item.categories &&
                  item.categories?.length > 0 &&
                  item.categories.map(item => (
                    <Tag key={item}>
                      <TagLabel>{item}</TagLabel>
                    </Tag>
                  ))}
              </TagWrapper>
            </DetailWrapper>
          )}
          {!item.name && !item.description && (
            <PlaceholderContainer>
              <TitlePlaceholder>
                <Placeholder animate={true} />
              </TitlePlaceholder>
              <DescriptionPlaceholder>
                <Placeholder animate={true} />
              </DescriptionPlaceholder>
            </PlaceholderContainer>
          )}
        </Container>
      </Wrapper>
    </TouchableWithoutFeedback>
  )
}

const Wrapper = styled.View`
  ${tw(`w-full px-4 justify-center`)};
  height: 112px;
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
const TitleWrapper = styled.View`
  ${tw(`flex-row items-center`)}
`
const Title = styled.Text`
  ${tw(`text-sm font-semibold h-5 flex-initial flex-shrink`)};
  color: ${({ theme }) => theme.text.body};
`
const Description = styled.Text`
  ${tw(`text-xs font-normal`)};
  color: ${({ theme }) => theme.text.muted};
`
const TagWrapper = styled.ScrollView`
  ${tw(`flex-row mt-2`)};
`
const Tag = styled.View`
  ${tw(`py-1 px-2 rounded-full mr-1`)};
  background-color: ${({ theme }) => theme.backgroundAlt};
`
const TagLabel = styled.Text`
  ${tw(`text-xs font-normal`)};
  color: ${({ theme }) => theme.text.muted};
`
const FollowerTag = styled(Tag)`
  ${tw(`h-4 py-0 justify-center ml-2 px-2`)}
  background-color: ${({ theme }) => theme.tag.blue.bg};
`
const FollowerLabel = styled(TagLabel)`
  color: ${({ theme }) => theme.tag.blue.text};
`
const PlaceholderContainer = styled.View`
  ${tw(`flex-1 ml-3 justify-center`)};
`
const TitlePlaceholder = styled.View`
  ${tw(`w-3/5 h-4 mb-2`)}
`
const DescriptionPlaceholder = styled.View`
  ${tw(`w-full h-8`)}
`
