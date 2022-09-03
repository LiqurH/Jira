import React from "react";
import { Drawer ,Button} from "antd";
import { useDispatch } from "react-redux";
import { projectListActions, selectProjectModalOpen } from "./project-list.slice";
import { useSelector } from "react-redux";

// export const ProjectModal = (props:{projectModalOpen :boolean ,onClose:()=>void}) => {
//     return <Drawer onClose={props.onClose} visible={props.projectModalOpen} width={'100%'}>
//         <h1>Project Modal</h1>
//         <Button onClick ={props.onClose}>关闭</Button>
//     </Drawer>
// }

export const ProjectModal = () => {
    const dispatch = useDispatch()
    //useSelector 该hook用来读取总的状态树里面的状态
    const projectModalOpen = useSelector(selectProjectModalOpen)
    return <Drawer onClose={() => dispatch(projectListActions.closeProjectModal())} visible={projectModalOpen} width={'100%'}>
        <h1>Project Modal</h1>
        <Button onClick ={() => dispatch(projectListActions.closeProjectModal())}>关闭</Button>
    </Drawer>
}