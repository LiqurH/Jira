import React, { useState } from "react";
import { useAuth } from "context/auth-context";
import { ProjectListScreen } from "screens/project-list";
import styled from "@emotion/styled";
import { ButtonNoPadding, Row } from "components/lib";
import { ReactComponent as SoftwareLogo } from "./assets/software-logo.svg";
import { Dropdown, Menu, Button } from "antd";
//react-router 和react-router-dom得关系，类似于react和 react-dom/react-native..,
//react是核心库，主要处理虚拟，理论，计算得逻辑     计算得到的结果会被react-dom消费
import { Routes, Route } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { ProjectScreen } from "screens/project";
import { resetRoute } from "utils";
import { ProjectModal } from "screens/project-list/ProjectModal";
import { ProjectPopover } from "components/project-popover";

//登录后的主页
export const AuthenticatedApp = () => {
  const [projectModalOpen, setProjectModalOpen] = useState(false);

  return (
    <Container>
      {/* 组件提升源码解决多层控制项目管理页面 */}
      {/* <PageHeader setProjectModalOpen = {setProjectModalOpen}/> */}
      {/* 组件组合源码解决多层控制项目管理页面  */}
      <PageHeader
        projectButton={
          <ButtonNoPadding
            type={"link"}
            onClick={() => setProjectModalOpen(true)}
          >
            {" "}
            创建项目
          </ButtonNoPadding>
        }
      />
      <Main>
        {/* <ProjectListScreen/> */}
        <Router>
          <Routes>
            <Route
              path={"projects"}
              element={
                // <ProjectListScreen setProjectModalOpen={setProjectModalOpen} />
                <ProjectListScreen
                  projectButton={
                    <ButtonNoPadding
                      type={"link"}
                      onClick={() => setProjectModalOpen(true)}
                    >
                      {" "}
                      创建项目
                    </ButtonNoPadding>
                  }
                />
              }
            />
            <Route path={"projects/:projectId/*"} element={<ProjectScreen />} />
            {/*  两者都匹配不上时默认跳转的页面*/}
            <Route
              index
              element={
                // <ProjectListScreen setProjectModalOpen={setProjectModalOpen} />
                <ProjectListScreen
                projectButton={
                  <ButtonNoPadding
                    type={"link"}
                    onClick={() => setProjectModalOpen(true)}
                  >
                    {" "}
                    创建项目
                  </ButtonNoPadding>
                }
              />
              }
            />
          </Routes>
        </Router>
      </Main>
      <ProjectModal
        projectModalOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      />
    </Container>
  );
};

// 提取header组件
const PageHeader = (props: {
  /* 组件提升源码解决多层控制项目管理页面 */
  //   setProjectModalOpen: (isOpen: boolean) => void;
  /* 组件组合源码解决多层控制项目管理页面  */
  projectButton: JSX.Element;
}) => {
  return (
    <Header between={true}>
      <HeaderLeft gap={true}>
        <ButtonNoPadding type={"link"} onClick={resetRoute}>
          <SoftwareLogo width={"18rem"} color={"rgb(38 , 132 , 255)"} />
        </ButtonNoPadding>
        {/* <ProjectPopover setProjectModalOpen={props.setProjectModalOpen} /> */}
        <ProjectPopover {...props} />
        <span>用户</span>
      </HeaderLeft>
      <HeaderRight>
        <User />
      </HeaderRight>
    </Header>
  );
};

const User = () => {
  const { logout, user } = useAuth();
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key={"logout"}>
            <Button onClick={logout} type={"link"}>
              登出
            </Button>
          </Menu.Item>
        </Menu>
      }
    >
      <Button type={"link"} onClick={(e) => e.preventDefault()}>
        Hi, {user?.name}
      </Button>
    </Dropdown>
  );
};

//grid-template-rows/columns 横向/纵向排列三份各占宽度  1fr
//grid-template-areas: "header header header" "nav main aside" "footer footer footer ";  页面布局
const Container = styled.div`
  display: grid;
  grid-template-rows: 6rem 1fr;
  height: 100vh;
  grid-template-areas: "header header" "main main";
`;

const Header = styled(Row)`
  padding: 3.2rem;
  grid-area: header;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
  /* justify-content: space-between; */
`;
const HeaderLeft = styled(Row)``;
const HeaderRight = styled.div``;

const Main = styled.main`
  grid-area: main;
`;
