'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type CurrencyStore, createCurrencyStore } from '@/stores/currency-store'

export type CurrencyStoreApi = ReturnType<typeof createCurrencyStore>

export const CurrencyStoreContext = createContext<CurrencyStoreApi | undefined>(
  undefined,
)

export interface CurrencyStoreProviderProps {
  children: ReactNode
}

export const CurrencyStoreProvider = ({
  children,
}: CurrencyStoreProviderProps) => {
  const storeRef = useRef<CurrencyStoreApi>()
  if (!storeRef.current) {
    // if (typeof window !== 'undefined') {
    //   storeRef.current = createCurrencyStore({ currency: (localStorage.getItem('currency') as 'USD' | 'EUR' | 'EGP') ?? 'USD' })
    // }
    // else storeRef.current = createCurrencyStore()
    storeRef.current = createCurrencyStore({ currency: (localStorage.getItem('currency') as 'USD' | 'EUR' | 'EGP') ?? 'USD' })
  }

  return (
    <CurrencyStoreContext.Provider value={storeRef.current}>
      {children}
    </CurrencyStoreContext.Provider>
  )
}

export const useCurrencyStore = <T,>(
  selector: (store: CurrencyStore) => T,
): T => {
  const currencyStoreContext = useContext(CurrencyStoreContext)

  if (!currencyStoreContext) {
    throw new Error(`useCurrencyStore must be used within CurrencyStoreProvider`)
  }

  return useStore(currencyStoreContext, selector)
}
