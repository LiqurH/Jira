// 获取任务组页面数据

import { QueryKey, useQuery } from "react-query";
import { Epic } from "types/epic";
import { useHttp } from "./http";
import { useMutation} from "react-query";
import { useAddConfig, useDeleteConfig } from "./use-optimistic-options";

export const useEpics = (param?: Partial<Epic>) => {
    const client = useHttp();
  
    //['projects', param]  里面的值变化的时候就会重新触发useQuery来发请求
    return useQuery<Epic[]>(["epics", param], () =>
      client("epics", { data: param })
    );
  };

  export const useAddEpic = (queryKey:QueryKey) => {
    // 增加项目列表
    const client = useHttp();
  //   const queryClient = useQueryClient();
    return useMutation(
      (params: Partial<Epic>) =>
        client(`epics`, {
          data: params,
          method: "POST",
        }),
        useAddConfig(queryKey)
      // {
      //   onSuccess: () => queryClient.invalidateQueries("projects"),
      // }
    );
  };

  //删除看板功能
  export const useDeleteEpic = (queryKey:QueryKey) => {
    const client = useHttp();
    return useMutation(
      ({id} : {id:number}) =>
        client(`epics/${id}`, {
          method: "DELETE",
        }),
        useDeleteConfig(queryKey)
    );
  };
