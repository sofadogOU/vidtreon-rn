import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Alert, Share } from 'react-native'
import branch, {
  BranchLinkControlParams,
  BranchLinkProperties,
  BranchShareSheetOptions,
  // BranchEvent,
} from 'react-native-branch'
import * as Sentry from '@sentry/react-native'

import { IS_ANDROID } from '@/utils/constants'

export type ShareDomain = 'share_video' | 'share_channel'

export interface DeepLink {
  id: string
  domain: ShareDomain
}

type ShareOptions = {
  id: string
  title: string
  message: string
  feature: ShareDomain
  previewImage?: string
}

interface Context {
  create: (options: ShareOptions) => void
  deepLink?: DeepLink
  resetDeepLink: () => void
}

const ShareContext = createContext({} as Context)

interface Props {
  children: React.ReactNode
}

const ShareProvider = ({ children }: Props) => {
  const [deepLink, setDeepLink] = useState<DeepLink>()

  const init = useCallback(async () => {
    branch.subscribe(({ error, params, uri }) => {
      if (error) {
        Sentry.captureException('Error from Branch: ' + error)
        return
      }
      if (params?.['+non_branch_link']) {
        const nonBranchUrl = params?.['+non_branch_link']
        // Route non-Branch URL if appropriate.
        return
      }
      if (!params?.['+clicked_branch_link']) {
        // Indicates initialization success and some other conditions.
        // No link was opened.
        return
      }
      // A Branch link was opened.
      // Route link based on data in params, e.g.
      // Get props required for routing
      const { shareId: id, domain } = params

      if (id && domain) {
        setDeepLink({ id, domain })
      }
    })
  }, [])

  useEffect(() => {
    const initBranch = async () => await init()
    initBranch()
  }, [init])

  const initBUO = async (options: ShareOptions) => {
    try {
      const branchUniversalObject = await branch.createBranchUniversalObject(
        'canonicalIdentifier',
        {
          locallyIndex: true,
          title: IS_ANDROID ? 'I saw this on so.fa.dog' : options.title,
          contentDescription: IS_ANDROID
            ? `${options.title} | ${options.message}`
            : `I saw this on so.fa.dog | ${options.title}`,
          contentMetadata: {
            customMetadata: {
              domain: options.feature,
              shareId: options.id,
            },
          },
        }
      )
      return branchUniversalObject
    } catch (e) {
      Alert.alert(e)
    }
  }

  const getOptions = ({
    title,
    message,
  }: ShareOptions): BranchShareSheetOptions => {
    return {
      messageHeader: title,
      messageBody: message,
    }
  }

  const getProperties = ({ feature }: ShareOptions): BranchLinkProperties => {
    return {
      feature: 'share',
      channel: feature || 'unknown',
    }
  }

  const getParams = (options: ShareOptions): BranchLinkControlParams => {
    return {
      $ios_url: 'itms-apps://itunes.apple.com/app/id1510957190',
    }
  }

  const create = useCallback(async (options: ShareOptions) => {
    try {
      const BUO = await initBUO(options)
      const shareOptions = getOptions(options)
      const linkProperties = getProperties(options)
      const controlParams = getParams(options)
      // @ts-ignore
      const { url } = await BUO?.generateShortUrl(linkProperties, controlParams)
      if (url) {
        const title = IS_ANDROID ? `${options.title} | ${url}` : options.title
        const message = IS_ANDROID ? `${options.title} | ${url}` : options.title
        await Share.share({ url, title, message })
      }
    } catch (e) {
      Sentry.captureException(e)
    }
  }, [])

  const resetDeepLink = useCallback(() => setDeepLink(undefined), [])

  const context = useMemo(
    () => ({
      create,
      deepLink,
      resetDeepLink,
    }),
    [create, deepLink, resetDeepLink]
  )
  return (
    <ShareContext.Provider value={context}>{children}</ShareContext.Provider>
  )
}

export const useShare = () => useContext(ShareContext)
export default ShareProvider
