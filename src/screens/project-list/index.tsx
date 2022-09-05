import React from "react";
import { List } from "./List";
import { SearchPanel } from "./SearchPanel";
import { useState } from "react";
import { useDebounce, useDocumentTitle } from "utils";
import styled from "@emotion/styled";
import { Typography, Button } from "antd";
import { ButtonNoPadding, ErrorBox, Row } from "components/lib";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
// import { useUrlQueryParam } from "utils/url"
import { useProjectModal, useProjectsSearchParam } from "./util";
// import { Test } from "./test"

export const ProjectListScreen = (props: {
  // setProjectModalOpen: (isOpen: boolean) => void;
  // projectButton: JSX.Element;
}) => {
  const { open } = useProjectModal()
  useDocumentTitle("项目列表", false);
  // keys是个数组，加进去就会进入循环
  // const keys = ['name','personId'];
  const [param, setParam] = useProjectsSearchParam();
  // const [users,setUsers] = useState([])
  // const debouncedParam = useDebounce(param , 200)
  const {
    isLoading,
    error,
    data: list,
    // retry,
  } = useProjects(useDebounce(param, 200));
  const { data: users } = useUsers();

  return (
    <Container>
      <Row between={true}>
        <h1>项目列表</h1>
        {/* <Button
          onClick={() => {
            props.setProjectModalOpen(true);
          }}
        >
          创建项目
        </Button> */}
        {/* {props.projectButton} */}
        <ButtonNoPadding
        type={"link"}
        onClick={open}
      >
        {" "}
        创建项目
      </ButtonNoPadding>
      </Row>
      {/* <Test/> */}
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      <ErrorBox error={error}/>
      {/* {error ? <Typography.Text>{error.message}</Typography.Text> : null} */}
      <List
      //  setProjectModalOpen = {props.setProjectModalOpen}
        // projectButton = {props.projectButton}
        // refresh={retry}
        loading={isLoading}
        users={users || []}
        dataSource={list || []}
      />
    </Container>
  );
};

//查看无限渲染的原因    {"prev ": {…}} '!==' {"next ": {…}}
// ProjectListScreen.whyDidYouRender = true;
//  === 在类式组件中写静态方法
// class Test extends React.Component{
//     static whyDidYouRender = true
// }

const Container = styled.div`
  padding: 3.2rem;
`;
