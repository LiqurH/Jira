import React from "react";
import { Form, Input, Select } from "antd";
import { Project } from "types/project";
import { UserSelect } from "components/user-select";
import {User} from 'types/user'

interface SearchPanelProps {
  users: User[];
  param: Partial<Pick<Project, "name" | "personId">>;
  setParam: (param: SearchPanelProps["param"]) => void;
}

export const SearchPanel = ({ users, param, setParam }: SearchPanelProps) => {
  return (
    <Form style={{ marginBottom: "2rem" }} layout={"inline"}>
      <Form.Item>
        {/* setParam(Object.assign({},param,{name:evt.target.value})) */}
        <Input
          placeholder="项目名"
          type="text"
          value={param.name}
          onChange={(evt) => {
            setParam({ ...param, name: evt.target.value });
          }}
        />
      </Form.Item>
      <Form.Item>
        {/* Select组件自身会把所传入的value值当成string，返回string,对一些number属性的值会造成潜在风险 */}
        {/* <Select value={param.personId}  onChange={(value)=>{
                    setParam({...param,personId:value})
                }}>
                    <Select.Option value={''}>负责人</Select.Option>
                    {
                        users.map((user)=>{
                            return (<Select.Option key={user.id} value={String(user.id)}>{user.name}</Select.Option>)
                        })
                    }
            </Select> */}
        <UserSelect
          defaultOptionName={'负责人'}
          value={param.personId}
          onChange={(value) => {
            setParam({ ...param, personId: value });
          }}
        />
      </Form.Item>
    </Form>
  );
};
