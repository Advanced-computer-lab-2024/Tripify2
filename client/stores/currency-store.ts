import { createStore } from "zustand/vanilla";

export type CurrencyState = {
    currency: 'USD' | 'EUR' | 'EGP';
}

export type CurrencyActions = {
    setCurrency: (currency: 'USD' | 'EUR' | 'EGP') => void;
}

export type CurrencyStore = CurrencyState & CurrencyActions;

export const defaultInitialState: CurrencyState = {
    currency: localStorage.getItem('currency') as 'USD' | 'EUR' | 'EGP' ?? 'USD'
}

export const createCurrencyStore = (initState: CurrencyState = defaultInitialState) => {
    return createStore<CurrencyStore>()((set) => ({
        ...initState,
        setCurrency: (currency) => {
            localStorage.setItem('currency', currency);
            set(() => ({ currency }))
        }
    }))
}