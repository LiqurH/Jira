import React from "react";
import { Drawer, Button } from "antd";
import { useProjectModal } from "./util";

// export const ProjectModal = (props:{projectModalOpen :boolean ,onClose:()=>void}) => {
//   return (
//     <Drawer
//       onClose={props.onClose}
//       visible={props.projectModalOpen}
//       width={"100%"}
//     >
//       <h1>Project Modal</h1>
//       <Button onClick={props.onClose}>关闭</Button>
//     </Drawer>
//   );
// };


export const ProjectModal = () => {
    const { projectModalOpen ,close } = useProjectModal()
    return (
      <Drawer
        onClose={close}
        visible={projectModalOpen}
        width={"100%"}
      >
        <h1>Project Modal</h1>
        <Button onClick={close}>关闭</Button>
      </Drawer>
    );
  };