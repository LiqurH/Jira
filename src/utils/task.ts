

import { useQuery } from "react-query";
import { Task } from "types/task";
import { useHttp } from "./http";

export const useTasks = (param?: Partial<Task>) => {
    const client = useHttp();
  
    //['projects', param]  里面的值变化的时候就会重新触发useQuery来发请求
    return useQuery<Task[]>(["tasks", param], () =>
      client("tasks", { data: param })
    );
  };