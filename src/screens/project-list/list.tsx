import React from "react";
import { User } from "types/user";
import { Dropdown, Menu, Modal, Table } from "antd";
import { TableProps } from "antd/es/table";
import { Link } from "react-router-dom";
import { Pin } from "components/pin";
import dayjs from "dayjs";
import { useDeleteProject, useEditProject } from "utils/project";
import { ButtonNoPadding } from "components/lib";
import { useProjectModal, useProjectQueryKey } from "./util";
import {Project } from 'types/project'

//TableProps代表了Table组件得属性类型  dataSource也是其中一个属性类型
interface ListProps extends TableProps<Project> {
  users: User[];
  // refresh?:() => void;
  // setProjectModalOpen : (isOpen:boolean) => void
  // projectButton:JSX.Element
}

export const List = ({ users, ...props }: ListProps) => {
  // const { open } = useProjectModal();
  const { mutate } = useEditProject(useProjectQueryKey());
  // const pinProject = (id:number , pin: boolean) => mutate({id , pin})
  //柯里化
  const pinProject = (id: number) => (pin: boolean) =>mutate({ id, pin })
    // mutate({ id, pin }).then(props.refresh);
  // console.log(props);      //{loading: true, dataSource: Array(1)}

  // pagination不需要分页  columns靠着dataSource获取到类型为数组Project每一列渲染方式  dataSource原始数据
  return (
    <Table
      pagination={false}
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            // return <Pin checked={project.pin} onCheckedChange={(pin) => {pinProject(project.id ,pin)}}/>
            return (
              <Pin
                checked={project.pin}
                onCheckedChange={pinProject(project.id)}
              />
            );
          },
        },
        {
          title: "名称",
          sorter: (a, b) => a.name.localeCompare(b.name), // 排序，localeCompare可以排序中文字符
          render(value, project) {
            return (
              <Link to={`projects/${String(project.id)}`}>{project.name}</Link>
            );
          },
        },
        {
          title: "部门",
          dataIndex: "organization",
        },
        {
          title: "负责人",
          render(value, project) {
            return (
              <span>
                {users.find((user) => user.id === project.personId)?.name ||
                  "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          render(value, propject) {
            return (
              <span>
                {propject.created
                  ? dayjs(propject.created).format("YYYY-MM-DD")
                  : "无"}
              </span>
            );
          },
        },
        {
          render(value, project) {
            return <More project={project}/>
          },
        },
      ]}
      // dataSource ={list} //dataSource原始数据
      {...props}
    >
      {/* <thead>
            <tr>
                <th>名称</th>
                <th>负责人</th>
            </tr>
        </thead>
        <tbody>
            {
                list.map((project) => {  
                    return  (
                        <tr key={project.id}>
                        <td>{project.name}</td>
                        <td>{users.find(user=> user.id === project.personId)?.name || '未知'}</td>
                    </tr>
                    )
                })
            }
        </tbody> */}
    </Table>
  );
};


const More =( {project} : {project:Project}) => {
  const {startEdit} = useProjectModal()
  const editProject = (id: number) => () =>startEdit(id)
  const {mutate:deleteProject} = useDeleteProject(useProjectQueryKey())
  const confirmDeleteProject = ( id : number ) => {
    Modal.confirm({
      title:'确认删除项目？',
      content:'点击确认删除',
      okText:'确定',
      onOk(){
        deleteProject({id})
      }
    })
  }
  return <Dropdown
  overlay={
    <Menu>
      <Menu.Item key={"edit"}>
        {/* <ButtonNoPadding type = {'link'} onClick={()=> props.setProjectModalOpen(true)}>编辑</ButtonNoPadding> */}
        {/* {props.projectButton} */}
        <ButtonNoPadding type={"link"} onClick={editProject(project.id)}>
          编辑
        </ButtonNoPadding>
      </Menu.Item>
      <Menu.Item key={"delete"}>
      <ButtonNoPadding type={"link"} onClick={() => confirmDeleteProject(project.id)}>
          删除
        </ButtonNoPadding>
      </Menu.Item>
    </Menu>
  }
>
  <ButtonNoPadding type={"link"}>...</ButtonNoPadding>
</Dropdown>
}