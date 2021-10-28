import React from 'react'
import '@testing-library/jest-native'
import { render, fireEvent } from '@/config/test-utils'

import theme from '@/themes/dark'
import Profile from '@/containers/profile/screens/profile.screen'

/**
 * Prevent `dispatchCommand` warning when using an RN Switch component
 * https://github.com/callstack/react-native-testing-library/issues/329
 */
jest.mock('react-native/Libraries/Components/Switch/Switch', () => {
  const mockComponent = require('react-native/jest/mockComponent')
  return mockComponent('react-native/Libraries/Components/Switch/Switch')
})

describe('Testing Theme Provider', () => {
  test('switching themes works', async () => {
    const { getByText, getByTestId } = render(<Profile />)
    const switchComponent = getByTestId('theme-switch')
    const title = getByText(/settings/i)
    fireEvent(switchComponent, 'onValueChange', true)
    expect(title).toHaveStyle({ color: theme.text.body })
  })
})

describe('Testing i18n Provider', () => {
  const setup = async () => {
    const { getByTestId } = render(<Profile />)
    const title = getByTestId('i18n-title')
    const switchComponent = await getByTestId('i18n-switch')
    return { title, switchComponent }
  }

  test('default (EN) localization works', async () => {
    const utils = await setup()
    expect(utils.title).toHaveTextContent(/hello/i)
  })

  test('Switching localization works', async () => {
    const utils = await setup()
    expect(utils.title).toHaveTextContent(/hello/i)
    fireEvent(utils.switchComponent, 'onValueChange', true)
    expect(utils.title).toHaveTextContent(/ee_hello/i)
  })
})
