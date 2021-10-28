import * as React from 'react'
import { Share } from 'react-native'

import * as Sentry from '@sentry/react-native'
import branch, {
  BranchLinkControlParams,
  BranchLinkProperties,
  BranchShareSheetOptions,
  // BranchEvent,
} from 'react-native-branch'
import * as k from '@/utils/constants'

type ShareDomain = 'share_video' | 'share_channel'

type ShareOptions = {
  id: string
  title: string
  message: string
  feature: ShareDomain
  previewImage?: string
  channelName?: string
}

export const useShareProvider = () => {
  const initBUO = async (options: ShareOptions) => {
    try {
      const branchUniversalObject = await branch.createBranchUniversalObject(
        'canonicalIdentifier',
        {
          locallyIndex: true,
          title: k.isAndroid ? 'I saw this on so.fa.dog' : options.title,
          contentDescription: k.isAndroid
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
      Sentry.captureException(eval)
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

  const getProperties = ({
    feature,
    channelName,
  }: ShareOptions): BranchLinkProperties => {
    return {
      feature: 'share',
      channel: feature || 'unknown',
      alias: channelName || undefined,
    }
  }

  const getParams = (options: ShareOptions): BranchLinkControlParams => {
    return {
      $ios_url: 'itms-apps://itunes.apple.com/app/id1510957190',
    }
  }

  const presentShareSheet = async (options: ShareOptions, url: string) => {
    console.log(url)
    const title = k.isAndroid ? `${options.title} | ${url}` : options.title
    const message = k.isAndroid ? `${options.title} | ${url}` : options.title
    await Share.share({ url, title, message })
  }

  const create = React.useCallback(async (options: ShareOptions) => {
    try {
      const BUO = await initBUO(options)
      // const shareOptions = getOptions(options)
      const linkProperties = getProperties(options)
      const controlParams = getParams(options)
      // @ts-ignore
      const { url } = await BUO?.generateShortUrl(linkProperties, controlParams)
      if (url) {
        presentShareSheet(options, url)
      }
    } catch (e) {
      console.log(e)
      if (
        e.message.indexOf('A resource with this identifier already exists.') !==
          -1 ||
        e.message.indexOf('Unable to create a URL with that alias') !== -1
      ) {
        presentShareSheet(options, `https://s.fa.dog/${options.channelName}`)
      } else {
        Sentry.captureException(e)
      }
    }
  }, [])

  return { create }
}
