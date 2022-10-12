// 获取看板页面数据

import { QueryKey, useQuery } from "react-query";
import { KanBan } from "types/kanban";
import { useHttp } from "./http";
import { useMutation} from "react-query";
import { useAddConfig, useDeleteConfig ,useReorderKanbanConfig } from "./use-optimistic-options";

export const useKanBans = (param?: Partial<KanBan>) => {
    const client = useHttp();
  
    //['projects', param]  里面的值变化的时候就会重新触发useQuery来发请求
    return useQuery<KanBan[]>(["kanbans", param], () =>
      client("kanbans", { data: param })
    );
  };

  export const useAddKanban = (queryKey:QueryKey) => {
    // 增加项目列表
    const client = useHttp();
  //   const queryClient = useQueryClient();
    return useMutation(
      (params: Partial<KanBan>) =>
        client(`kanbans`, {
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
  export const useDeleteKanban = (queryKey:QueryKey) => {
    const client = useHttp();
    return useMutation(
      ({id} : {id:number}) =>
        client(`kanbans/${id}`, {
          method: "DELETE",
        }),
        useDeleteConfig(queryKey)
    );
  };


  export interface SortProps {
    // 要重新排序的 item
    fromId: number;
    // 目标 item
    referenceId: number;
    // 放在目标item的前还是后
    type: "before" | "after";
    fromKanbanId?: number;
    toKanbanId?: number;
  }
  
  export const useReorderKanban = (queryKey: QueryKey) => {
    const client = useHttp();
    return useMutation((params: SortProps) => {
      return client("kanbans/reorder", {
        data: params,
        method: "POST",
      });
    }, useReorderKanbanConfig(queryKey));
  };
  