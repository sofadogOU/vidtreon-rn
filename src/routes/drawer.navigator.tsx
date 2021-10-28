import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerContentOptions,
  useIsDrawerOpen,
} from '@react-navigation/drawer'
import { useTheme } from 'styled-components'

import { useCategories } from '@/hooks'
import { useTranslation } from '@/providers'

import { TabNavigator } from './tab.navigator'
import { Sidebar, CategoryList } from '@/components'

const Drawer = createDrawerNavigator()

const CustomDrawerContent = (
  props: DrawerContentComponentProps<DrawerContentOptions>
) => {
  const theme = useTheme()
  const i18n = useTranslation()
  const wasDrawerOpen = useIsDrawerOpen()
  const selectedIdsRef = React.useRef<string[]>()
  const [reset, setReset] = React.useState(false)

  const contentStyle: StyleProp<ViewStyle> = {
    backgroundColor: theme.backgroundDark,
    flex: 1,
  }

  const handleOnChange = (selectedIds: string[]) => {
    setReset(false)
    selectedIdsRef.current = selectedIds
  }

  const { data: categoryData } = useCategories()

  React.useEffect(() => {
    return () => {
      if (wasDrawerOpen) {
        props.navigation.navigate('Explore', {
          screen: 'ExploreSearch',
          params: {
            categoryIds: selectedIdsRef.current,
          },
        })
      }
    }
  }, [wasDrawerOpen, props])

  return (
    <>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={contentStyle}
        removeClippedSubviews
      >
        <Sidebar
          title={i18n.t('title_categories')}
          onClear={() => setReset(true)}
        >
          <CategoryList
            items={categoryData}
            onChange={handleOnChange}
            reset={reset}
          />
        </Sidebar>
      </DrawerContentScrollView>
    </>
  )
}

export const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerType="slide"
      drawerPosition="right"
      edgeWidth={0}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Drawer" component={TabNavigator} />
    </Drawer.Navigator>
  )
}
