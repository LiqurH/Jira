import React from "react";
import { Link } from 'react-router-dom'
import { Route , Routes } from "react-router-dom";
import { EpicScreen } from "screens/epic";
import { KanBanScreen } from "screens/kanban/index";
export const ProjectScreen = () => {
    return <div>
        <h1>ProjectScreen</h1>
        <Link to={'kanban'}>看板</Link>
        <Link to={'epic'}>任务组</Link>
        <Routes>
            <Route path={'kanban'} element={<KanBanScreen/>}/>
            <Route path={'epic'} element={<EpicScreen/>}/>
            <Route index element={<KanBanScreen />} />
        </Routes>
    </div>
}