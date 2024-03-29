import { configureStore } from '@reduxjs/toolkit'

import cardReducer from "../features/cardSlices"

export const store = configureStore({
    reducer: cardReducer
})