'use client'

import { createContext, useContext, useState } from 'react'

const ReadyCtx = createContext<{ ready: boolean }>({ ready: false })
const SetReadyCtx = createContext<(ready: boolean) => void>(() => {})

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  return (
    <SetReadyCtx.Provider value={setReady}>
      <ReadyCtx.Provider value={{ ready }}>{children}</ReadyCtx.Provider>
    </SetReadyCtx.Provider>
  )
}

export const usePreloader = () => useContext(ReadyCtx)
export const useSetPreloaderReady = () => useContext(SetReadyCtx)
