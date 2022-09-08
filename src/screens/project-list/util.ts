import { useMemo, useState } from "react";
import { useProject } from "utils/project";
import { useUrlQueryParam ,useSetUrlSearchParam} from "utils/url";

// 项目类表搜索的参数
export const useProjectsSearchParam = () => {
  const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  // param的personId是string类型的，需要一个number类型的
  return [
    useMemo(
      () => ({ ...param, personId: Number(param.personId) || undefined }),
      [param]
    ),
    setParam,
  ] as const;
};

export const useProjectQueryKey = () => {
  const [params] = useProjectsSearchParam();
  return ["projects", params];
};

// 用url管理项目模式状态框的hook  全局状态管理的功能
export const useProjectModal = () => {
  const [{ projectCreate }, setProjectCreate] = useUrlQueryParam([
    "projectCreate",
  ]);
  const [{ editingProjectId }, setEditingProjectId] = useUrlQueryParam([
    "editingProjectId",
  ]);

  const { data: editingProject, isLoading } = useProject(
    Number(editingProjectId)
  );

  const open = () => setProjectCreate({ projectCreate: true }); //项目模式状态框打开函数
//   const close = () => {
//     projectCreate
//       ? setProjectCreate({ projectCreate: undefined })
//       : setEditingProjectId({ editingProjectId: undefined });
//   }; //项目模式状态框关闭函数
  const setUrlParams = useSetUrlSearchParam();
  const close = () => setUrlParams({ projectCreate: "", editingProjectId: "" });
  const startEdit = (id: number) =>
    setEditingProjectId({ editingProjectId: id }); // 编辑id项目

  return {
    projectModalOpen: projectCreate === "true" || Boolean(editingProject),
    open,
    close,
    startEdit,
    editingProject,
    isLoading,
  };
};

/*
    return [
        projectCreate === 'true' , // 判断项目模式状态框是否打开的boolen值
        open,
        close
    ] as const

    这样返回和useState一样，可以随意命名

    const [ xxxx , xxxx ,xxxx ] = useProjectModal()
*/

/*
    当返回东西比较多的时候：（可以返回一个对象）
     return {
        projectModalOpen: projectCreate === 'true'
        open : open ,
        close : close
    }
    //名字就不能随便改了    
    const [ projectModalOpen , open ,close ] = useProjectModal()
*/
