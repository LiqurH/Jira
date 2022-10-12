//封装类似下拉菜单的方法
import React from "react";
import { Popover, Typography, List, Divider, Button } from "antd";
import { useProjects } from "utils/project";
import styled from "@emotion/styled";
import { ButtonNoPadding } from "./lib";
import { useProjectModal } from "screens/project-list/util";

export const ProjectPopover = (props: {
  /* 组件提升源码解决多层控制项目管理页面 */
  // setProjectModalOpen: (isOpen: boolean) => void;
  /* 组件组合源码解决多层控制项目管理页面  */
  // projectButton: JSX.Element;
}) => {
  const { data: projects, refetch } = useProjects();
  const pinnedProjects = projects?.filter((project) => project.pin);
  const { open } = useProjectModal()
  const content = (
    <ContentContainer>
      <Typography.Text type={"secondary"}>收藏项目</Typography.Text>
      <List>
        {pinnedProjects?.map((project) => (
          <List.Item>
            <List.Item.Meta title={project.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
      {/* <ButtonNoPadding
        type={"link"}
        onClick={() => props.setProjectModalOpen(true)}
      >
        {" "}
        创建项目
      </ButtonNoPadding> */}
      {/* {props.projectButton} */}
      <ButtonNoPadding
        type={"link"}
        onClick={open}
      >
        {" "}
        创建项目
      </ButtonNoPadding>
    </ContentContainer>
  );
  return (
    <Popover onVisibleChange={()=> refetch()} placement={"bottom"} content={content}>
      <span>项目</span>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 30rem;
`;
