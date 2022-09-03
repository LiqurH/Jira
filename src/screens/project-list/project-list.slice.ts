// projectlist 状态得切片

import {createSlice} from "@reduxjs/toolkit"
import { RootState } from "store";

interface State {
    projectModalOpen:boolean;
}

const initialState:State ={
    projectModalOpen:false
}

export const projectListSlice = createSlice({
    name : 'projectListSlice' ,
    initialState,
    // 此处immer进行了处理，并没有违反纯函数的原则
    reducers:{
        openProjectModal(state){
            state.projectModalOpen = true
        },
        closeProjectModal(state){
            state.projectModalOpen = false
        }
    }
})

export const projectListActions = projectListSlice.actions

export const selectProjectModalOpen = (state: RootState) => state.projectList.projectModalOpen

