

import { QueryKey, useMutation, useQuery } from "react-query";
import { Project } from "types/project";
import { Task } from "types/task";
import { useDebounce } from "utils";
import { useHttp } from "./http";
import { SortProps } from "./kanban";
import { useAddConfig, useDeleteConfig, useEditConfig, useReorderTaskConfig } from "./use-optimistic-options";

export const useTasks = (param?: Partial<Task>) => {
    const client = useHttp();
    const debouncedParam = { ...param , name: useDebounce(param?.name , 200)}
    //['projects', param]  里面的值变化的时候就会重新触发useQuery来发请求
    return useQuery<Task[]>(["tasks", debouncedParam], () =>
      client("tasks", { data: debouncedParam })
    );
  };

  export const useAddTask = (queryKey:QueryKey) => {
    // 增加任务列表
    const client = useHttp();
  //   const queryClient = useQueryClient();
    return useMutation(
      (params: Partial<Task>) =>
        client(`tasks`, {
          data: params,
          method: "POST",
        }),
        useAddConfig(queryKey)
      // {
      //   onSuccess: () => queryClient.invalidateQueries("projects"),
      // }
    );
  };

// 获取task详情的API
export const useTask = (id?: number) => {
  const client = useHttp();
  return useQuery<Task>(
    ["task", { id }],
    () => client(`tasks/${id}`),
    {
      enabled: Boolean(id), // !!id
    }
  );
};

export const useEditTask = (queryKey:QueryKey) => {
  // 编辑收藏项目列表
  const client = useHttp();
  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
      useEditConfig(queryKey)
  );
};

  //删除Task功能
  export const useDeleteTask = (queryKey:QueryKey) => {
    const client = useHttp();
    return useMutation(
      ({id} : {id:number}) =>
        client(`tasks/${id}`, {
          method: "DELETE",
        }),
        useDeleteConfig(queryKey)
    );
  };

  export const useReorderTask = (queryKey: QueryKey) => {
    const client = useHttp();
    return useMutation((params: SortProps) => {
      return client("tasks/reorder", {
        data: params,
        method: "POST",
      });
    }, useReorderTaskConfig(queryKey));
  };
  