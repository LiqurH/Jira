import {configureStore} from '@reduxjs/toolkit'
import { projectListSlice } from 'screens/project-list/project-list.slice'

export const rootReducer = {
    projectList : projectListSlice.reducer
}

export const store = configureStore({
    reducer:rootReducer
})

export type AppDispatch = typeof store.dispatch
// 整个state树的类型
export type RootState = ReturnType<typeof store.getState>