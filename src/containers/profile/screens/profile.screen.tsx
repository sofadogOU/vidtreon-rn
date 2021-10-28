import React from 'react'
import { Alert, Switch, TouchableWithoutFeedback } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import { InAppBrowser } from 'react-native-inappbrowser-reborn'
import faker from 'faker'
import { useQueryClient } from 'react-query'

import { ProfileStackNavigationProp } from '@/typings/navigators'
import { Setting, SettingSection } from '@/typings'

import { useTheme as useThemeConfig, useTranslation } from '@/providers'

import { useGoogleAuth, useStore } from '@/hooks'
import { Icon, TitleBar, SafeWrapper } from '@/components'

interface Props {
  navigation: ProfileStackNavigationProp<'Profile'>
}

export const ProfileScreen = ({ navigation }: Props) => {
  const queryClient = useQueryClient()
  const themeConfig = useThemeConfig()
  const theme = useTheme()
  const i18n = useTranslation()
  const store = useStore()
  const googleAuth = useGoogleAuth()
  const facebookAuth = useGoogleAuth()
  const [isDarkMode, setDarkMode] = React.useState(themeConfig.mode === 'dark')

  const items: SettingSection[] = [
    {
      title: i18n.t('settings_section1'),
      items: [
        {
          id: faker.datatype.uuid(),
          icon: 'account',
          label: i18n.t('settings_section1_item1'),
          description: i18n.t('settings_section1_item1_description'),
          type: 'field',
        },
        {
          id: faker.datatype.uuid(),
          icon: 'subscriptions',
          label: i18n.t('settings_section1_item2'),
          description: i18n.t('settings_section1_item2_description'),
          type: 'subscription',
        },
        // {
        //   id: faker.datatype.uuid(),
        //   icon: 'restore',
        //   label: i18n.t('settings_section1_item3'),
        //   description: i18n.t('settings_section1_item3_description'),
        //   type: 'list',
        // },
      ],
    },
    {
      title: i18n.t('settings_section2'),
      items: [
        {
          id: faker.datatype.uuid(),
          icon: 'language',
          label: i18n.t('settings_section2_item1'),
          description: i18n.t('settings_section2_item1_description'),
          type: 'lang',
          items: [
            {
              id: faker.datatype.uuid(),
              lang: 'English',
              code: 'en',
              flag: '🇺🇸',
            },
            {
              id: faker.datatype.uuid(),
              lang: 'Estonian',
              code: 'en-EE',
              flag: '🇪🇪',
            },
            {
              id: faker.datatype.uuid(),
              lang: 'Brazilian Portuguese',
              code: 'pt-BR',
              flag: '🇧🇷',
            },
          ],
        },
        {
          id: faker.datatype.uuid(),
          icon: 'theme',
          label: i18n.t('settings_section2_item2'),
          description: i18n.t('settings_section2_item2_description'),
          type: 'theme',
        },
      ],
    },

    {
      title: i18n.t('settings_section3'),
      items: [
        {
          id: faker.datatype.uuid(),
          icon: 'privacy',
          label: i18n.t('settings_section3_item1'),
          description: i18n.t('settings_section3_item1_description'),
          type: 'link',
          path: 'https://so.fa.dog/policy/privacy',
        },
        {
          id: faker.datatype.uuid(),
          icon: 'terms',
          label: i18n.t('settings_section3_item2'),
          description: i18n.t('settings_section3_item2_description'),
          type: 'link',
          path: 'https://so.fa.dog/policy/terms',
        },
        {
          id: faker.datatype.uuid(),
          icon: 'community',
          label: i18n.t('settings_section3_item3'),
          description: i18n.t('settings_section3_item3_description'),
          type: 'link',
          path: 'https://so.fa.dog/policy/guidelines',
        },
      ],
    },
    {
      title: i18n.t('settings_section4'),
      items: [
        // {
        //   id: faker.datatype.uuid(),
        //   icon: 'contact',
        //   label: i18n.t('settings_section4_item1'),
        //   description: i18n.t('settings_section4_item1_description'),
        //   type: 'contact',
        //   path: 'mailto:contact@so.fa.dog',
        // },
        {
          id: faker.datatype.uuid(),
          icon: 'logout',
          label: i18n.t('settings_section4_item2'),
          description: i18n.t('settings_section4_item2_description'),
          type: 'logout',
        },
        // {
        //   id: faker.datatype.uuid(),
        //   icon: 'delete',
        //   label: i18n.t('settings_section4_item3'),
        //   description:  i18n.t('settings_section4_item3_description'),
        //   type: 'link',
        // },
      ],
    },
  ]

  const handleLogout = async () => {
    if (store.tokenDomain === 'google') {
      await googleAuth.logout()
    }
    if (store.tokenDomain === 'facebook') {
      facebookAuth.logout()
    }
    queryClient.invalidateQueries()
    store.setTokenDomain(null)
    store.setToken(null)
    store.setVisitor(false)
    store.setUser(null)
  }

  const handleItemPress = (item: Setting) => {
    if (item.type === 'link' && item.path) {
      InAppBrowser.open(item.path)
    } else if (item.type === 'logout') {
      Alert.alert('Please confirm', 'Are you sure you want to log out?', [
        { text: 'Cancel' },
        { text: 'Yes', onPress: handleLogout },
      ])
    } else {
      navigation.navigate('ProfileDetail', { info: item })
    }
  }

  return (
    <>
      <TitleBar title={i18n.t('title_bar_setting')} />
      <SafeWrapper>
        {items.map((section, index) => {
          return (
            <Container key={index}>
              <SectionTitle>{section.title}</SectionTitle>
              <Section>
                {section.items.map((item, itemIdx) => {
                  const { id, icon, label, description, type } = item
                  return (
                    <TouchableWithoutFeedback
                      disabled={type === 'theme'}
                      key={id}
                      onPress={() => handleItemPress(item)}
                    >
                      <Item isLast={itemIdx === section.items.length - 1}>
                        <LeftContainer>
                          <IconWrapper>
                            <Icon
                              name={icon}
                              size={20}
                              color={theme.progressBg}
                            />
                          </IconWrapper>
                          <TextWrapper>
                            <ItemTitle>{label}</ItemTitle>
                            <ItemDescription>{description}</ItemDescription>
                          </TextWrapper>
                        </LeftContainer>
                        {type === 'theme' && (
                          <RightContainer>
                            <Switch
                              disabled={false}
                              trackColor={{
                                true: theme.primary.tint,
                                false: 'grey',
                              }}
                              value={isDarkMode}
                              onValueChange={value => {
                                setDarkMode(v => !v)
                                themeConfig.setMode(value ? 'dark' : 'light')
                                store.setTheme(value ? 'dark' : 'light')
                              }}
                            />
                          </RightContainer>
                        )}
                      </Item>
                    </TouchableWithoutFeedback>
                  )
                })}
              </Section>
            </Container>
          )
        })}
      </SafeWrapper>
    </>
  )
}

const Container = styled.View`
  ${tw(`px-4 mt-4`)}
`
const Section = styled.View``
const SectionTitle = styled.Text`
  ${tw(`text-sm font-semibold mb-4`)};
  color: ${({ theme }) => theme.text.muted};
`
const Item = styled.View<{ isLast: boolean }>`
  ${tw(`flex-row items-center pb-2 mb-2 border-b`)};
  ${({ isLast }) => (isLast ? `border-bottom-width: 0` : null)};
  border-color: ${({ theme }) => theme.backgroundDark};
`
const LeftContainer = styled.View`
  ${tw(`flex-1 flex-row items-center`)}
`
const RightContainer = styled.View`
  ${tw(`items-center ml-4`)}
`
const TextWrapper = styled.View`
  ${tw(`flex-1`)}
`
const ItemTitle = styled.Text`
  ${tw(`font-semibold`)};
  padding-bottom: 2px;
  color: ${({ theme }) => theme.text.body};
`
const ItemDescription = styled.Text`
  ${tw(`text-xs w-4/5`)};
  color: ${({ theme }) => theme.text.muted};
`
const IconWrapper = styled.View`
  ${tw(`h-11 w-11 justify-center items-center rounded-lg mr-2`)};
  background-color: ${({ theme }) => theme.backgroundDark};
`
