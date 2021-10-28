import React, { createContext, useContext, useState, useMemo } from 'react'

interface Context {
  isBusy: boolean
  setBusy: (status: boolean) => void
}

const NetworkContext = createContext({} as Context)

interface Props {
  children: React.ReactNode
}

const NetworkProvider = ({ children }: Props) => {
  const [isBusy, setBusy] = useState(true)

  const context = useMemo(
    () => ({
      isBusy,
      setBusy,
    }),
    [isBusy]
  )

  return (
    <NetworkContext.Provider value={context}>
      {children}
    </NetworkContext.Provider>
  )
}

export const useNetwork = () => useContext(NetworkContext)
export default NetworkProvider
