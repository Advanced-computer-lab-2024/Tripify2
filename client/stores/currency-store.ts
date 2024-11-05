import { createStore } from "zustand/vanilla";

export type CurrencyState = {
    currency: 'USD' | 'EUR' | 'EGP';
}

export type CurrencyActions = {
    setCurrency: (currency: 'USD' | 'EUR' | 'EGP') => void;
}

export type CurrencyStore = CurrencyState & CurrencyActions;

export const defaultInitialState: CurrencyState = {
    currency: 'USD'
}

export const createCurrencyStore = (initState: CurrencyState = defaultInitialState) => {
    return createStore<CurrencyStore>()((set) => ({
        ...initState,
        setCurrency: (currency) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('currency', currency);
            }
            set(() => ({ currency }))
        }
    }))
}