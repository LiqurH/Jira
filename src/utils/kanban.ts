// 获取看板页面数据

import { useQuery } from "react-query";
import { KanBan } from "types/kanban";
import { useHttp } from "./http";

export const useKanBans = (param?: Partial<KanBan>) => {
    const client = useHttp();
  
    //['projects', param]  里面的值变化的时候就会重新触发useQuery来发请求
    return useQuery<KanBan[]>(["kanbans", param], () =>
      client("kanbans", { data: param })
    );
  };