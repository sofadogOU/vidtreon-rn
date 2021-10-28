import * as React from 'react'
import branch from 'react-native-branch'
import * as Sentry from '@sentry/react-native'

export type ShareDomain = 'share_video' | 'share_channel'

export interface Deeplink {
  id: string
  domain: ShareDomain
}

export const useDeeplinkProvider = () => {
  const [info, setInfo] = React.useState<Deeplink>()
  const bootstrap = React.useCallback(async () => {
    branch.subscribe(({ error, params, uri }) => {
      if (error) {
        Sentry.captureException('Error from Branch: ' + error)
        return
      }
      if (params?.['+non_branch_link']) {
        // const nonBranchUrl = params?.['+non_branch_link']
        // Route non-Branch URL if appropriate.
        return
      }
      if (!params?.['+clicked_branch_link']) {
        // Indicates initialization success and some other conditions.
        // No link was opened.
        return
      } else {
        const { shareId: id, domain } = params

        if (id && domain) {
          if (id !== info?.id && domain !== info?.domain) {
            setInfo({ id, domain })
          }
          // if (domain === 'share_channel') {
          //   navigation.navigate('Channel', {
          //     screen: 'ChannelDetail',
          //     params: {
          //       id,
          //     },
          //   })
          // } else if (domain === 'share_video') {
          //   navigation.navigate('MediaPlayer', {
          //     id,
          //   })
          // }
          // setDeeplink({ id, domain })
          // useNavigation({})
        }
      }
    })
  }, [info])

  return React.useMemo(() => ({ bootstrap, info }), [bootstrap, info])
}
