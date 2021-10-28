import React from 'react'
import {
  ProfileStackNavigationProp,
  ProfileStackRouteProp,
} from '@/typings/navigators'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'

import { Language, User, useStore } from '@/hooks'
import { useTranslation } from '@/providers/TranslationProvider'

import {
  TitleBar,
  LanguageList,
  ProfileForm,
  SubscriptionsList,
  UserFormData,
} from '@/components'

interface Props {
  navigation: ProfileStackNavigationProp<'ProfileDetail'>
  route: ProfileStackRouteProp<'ProfileDetail'>
}

const EmptyView = () => {
  const i18n = useTranslation()
  return (
    <Container>
      <EmptyContainer>
        <EmptyTitle>{i18n.t('empty_title')}</EmptyTitle>
        <EmptyDescription>{i18n.t('empty_later')}</EmptyDescription>
      </EmptyContainer>
    </Container>
  )
}

export const ProfileDetailScreen = ({ route, navigation }: Props) => {
  const { items, label, type } = route.params.info
  const store = useStore()

  const getUserState = React.useCallback(
    state => ({
      user: state.user,
    }),
    []
  )

  const { user } = useStore(getUserState)

  const handleUpdateUserState = (data: UserFormData, avatarUrl: string) => {
    const newUserDetails: User = {
      ...user,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      avatarUrl: avatarUrl,
    }
    if (data && avatarUrl) {
      store.setUser(newUserDetails)
    }
  }

  const handleBackPress = () => navigation.navigate('Profile')

  return (
    <>
      <TitleBar title={label} onBackPress={handleBackPress} />
      {type === 'lang' && <LanguageList items={items as Language[]} />}
      {type === 'field' && user && (
        <ProfileForm user={user} updateUserState={handleUpdateUserState} />
      )}
      {type === 'subscription' && user && <SubscriptionsList />}
      {type !== 'lang' && !user && <EmptyView />}
    </>
  )
}

const Container = styled.View`
  ${tw(`flex-1 items-center justify-center p-8`)};
`
const EmptyContainer = styled.View`
  ${tw(`w-full items-center justify-center p-8 rounded-xl`)};
  background-color: ${({ theme }) => theme.backgroundDark};
`
const EmptyTitle = styled.Text`
  ${tw(`text-sm text-center font-bold mb-2`)};
  color: ${({ theme }) => theme.text.body};
`
const EmptyDescription = styled.Text`
  ${tw(`text-base text-center text-sm`)};
  color: ${({ theme }) => theme.text.body};
`
