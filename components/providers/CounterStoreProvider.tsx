'use client'

import { createCounterStore, initCounterStore, type CounterStore } from '@/store/counter-store'
import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore, type StoreApi } from 'zustand'

export const CounterStoreContext = createContext<StoreApi<CounterStore> | null>(null)

export interface CounterStoreProviderProps {
  children: ReactNode
}

export const CounterStoreProvider = ({ children }: CounterStoreProviderProps) => {
  const storeRef = useRef<StoreApi<CounterStore>>()
  if (!storeRef.current) {
    storeRef.current = createCounterStore(initCounterStore())
  }

  return (
    <CounterStoreContext.Provider value={storeRef.current}>{children}</CounterStoreContext.Provider>
  )
}

export const useCounterStore = <T,>(selector: (store: CounterStore) => T): T => {
  const counterStoreContext = useContext(CounterStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
