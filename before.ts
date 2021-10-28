/// <reference types="@welldone-software/why-did-you-render" />
import React from 'react'
import { LogBox } from 'react-native'
// import clone from 'lodash-es/clone'

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    exclude: [/StaticContainer/],
  })

  // Ignore setting a timer warning
  // https://stackoverflow.com/questions/44603362/setting-a-timer-for-a-long-period-of-time-i-e-multiple-minutes
  LogBox.ignoreLogs([
    "Accessing the 'state'",
    'Setting a timer',
    'Expected style "lineHeight:',
    'Expected style "width:',
    'Expected style "height:',
    'RCTBridge required dispatch_sync to load RCTDevLoadingView. This may lead to deadlocks',
    'The native view manager required by name',
  ])
  // const _console = clone(console)
  // console.warn = (message: string) => {
  //   if (message?.indexOf('Setting a timer') <= -1) {
  //     _console.warn(message)
  //   }
  // }
}
