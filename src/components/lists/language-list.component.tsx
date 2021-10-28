import * as React from 'react'
import { ListRenderItem } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'

import { Language } from '@/typings'

import { LanguageItem } from './language-item.component'

interface Props {
  items: Language[]
}

export const LanguageList = ({ items }: Props) => {
  const renderItem: ListRenderItem<Language> = ({ item }) => {
    return <LanguageItem key={item.id} {...item} />
  }

  return (
    <List data={items} renderItem={renderItem as ListRenderItem<unknown>} />
  )
}

const List = styled.FlatList`
  ${tw(`flex-1 mt-2`)}
`
