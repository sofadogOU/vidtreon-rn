jest.mock('react-native-reanimated', () => ({
  Sentry: {
    init: () => jest.fn(),
    setTagsContext: jest.fn(),
    setExtraContext: jest.fn(),
    captureBreadcrumb: jest.fn(),
    captureException: jest.fn(),
    captureMessage: jest.fn(),
  },
}))
