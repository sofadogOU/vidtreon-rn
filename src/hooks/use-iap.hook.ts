import * as React from 'react'
import { Alert } from 'react-native'
import * as Sentry from '@sentry/react-native'
import Iaphub from 'react-native-iaphub'

import * as k from '@/utils/constants'
import { useStore } from './use-store.hook'

export type ProductInfo = Iaphub.IapHubProductInformation
type ErrorCodes = Iaphub.IapHubPurchaseErrorCodes & 'IapHubPurchaseErrorCodes'
type IAPError = { code: ErrorCodes; params: { platform: string } }

export const useIAP = () => {
  const getUserState = React.useCallback(
    state => ({
      userId: state.user.id,
    }),
    []
  )
  const { userId } = useStore(getUserState)

  const init = React.useCallback(async (): Promise<
    { success: boolean } | undefined
  > => {
    const isSimulator = await k.isSimulator()
    if (!isSimulator) {
      try {
        await Iaphub.init({
          appId: k.authCredentials.iapHub.appId,
          apiKey: k.authCredentials.iapHub.apiKey,
          environment: __DEV__ ? 'development' : 'production',
        })
        Iaphub.setDeviceParams({ appVersion: k.appVersion })
        await Iaphub.setUserId(`${userId}`)
        return { success: true }
      } catch (e) {
        Sentry.captureException(e)
        throw new Error(e)
      }
    }
  }, [userId])

  const getActiveProducts = async (): Promise<ProductInfo[] | undefined> => {
    try {
      const activeProducts = await Iaphub.getActiveProducts()
      return activeProducts
    } catch (e) {
      Sentry.captureException(e)
      throw new Error(e)
    }
  }

  const getProductsForSale = async (): Promise<ProductInfo[] | undefined> => {
    try {
      const productsForSale = await Iaphub.getProductsForSale()
      return productsForSale
    } catch (e) {
      Sentry.captureException(e)
      throw new Error(e)
    }
  }

  const restore = React.useCallback(async () => {
    try {
      await Iaphub.restore()
      await getActiveProducts()
      await getProductsForSale()
      Alert.alert('Restore', 'Purchases restored')
      return { success: true }
    } catch (e) {
      Sentry.captureException(e)
      throw new Error(e)
    }
  }, [])

  const handleReceiptProcess = (receipt: Iaphub.IapHubReceipt) => {
    // handle receipt for validation on server
  }

  const handleError = React.useCallback(
    (e: IAPError) => {
      switch (e.code) {
        case 'user_cancelled':
          throw new Error('USER CANCELLED')
          break
        // Couldn't buy product because it has been bought in the past but hasn't been consumed (restore needed)
        case 'product_already_owned':
          Alert.alert(
            'Product already owned',
            'Please restore your purchases in order to fix that issue',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Restore', onPress: () => restore() },
            ]
          )
          break
        // The payment has been deferred (its final status is pending external action such as 'Ask to Buy')
        case 'deferred_payment':
          Alert.alert(
            'Purchase awaiting approval',
            'Your purchase has been processed but is awaiting approval'
          )
          break
        // The receipt has been processed on IAPHUB but something went wrong
        case 'receipt_validation_failed':
          Alert.alert(
            "We're having trouble validating your transaction",
            "Give us some time, we'll retry to validate your transaction ASAP!"
          )
          break
        // The receipt hasn't been validated on IAPHUB (Could be an issue like a network error...)
        case 'receipt_request_failed':
          Alert.alert(
            "We're having trouble validating your transaction",
            'Please try to restore your purchases later (Button in the settings) or contact the support (support@myapp.com)'
          )
          break
        // The user has already an active subscription on a different platform (android or ios)
        case 'cross_platform_conflict':
          Alert.alert(
            `Seems like you already have a subscription on ${e.params.platform}`,
            `Please use the same platform to change your subscription or wait for your current subscription to expire`
          )
          break
        default:
          Alert.alert(
            'Purchase error',
            'We were not able to process your purchase, please try again later or contact the support (support@myapp.com)'
          )
      }
    },
    [restore]
  )

  const buy = React.useCallback(
    async (sku: string): Promise<{ success: boolean }> => {
      try {
        const transaction = await Iaphub.buy(sku, {
          // onReceiptProcess: handleReceiptProcess,
        })
        if (transaction.webhookStatus === 'failed') {
          Alert.alert(
            'Purchase delayed',
            'Your purchase was successful but we need some more time to validate it, should arrive soon! Otherwise contact the support (support@myapp.com)'
          )
        } else {
          Alert.alert(
            'Purchase successful',
            'Your purchase has been processed successfully!'
          )
        }
        try {
          await getActiveProducts()
          await getProductsForSale()
          return { success: true }
        } catch (e) {
          Sentry.captureException(e)
          throw new Error(e)
        }
      } catch (e) {
        Sentry.captureException(e)
        handleError(e)
        throw new Error(e)
      }
    },
    [handleError]
  )

  return { init, buy, restore, getActiveProducts, getProductsForSale }
}
