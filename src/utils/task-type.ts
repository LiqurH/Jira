//获取task-type的列表

import { useQuery } from "react-query";
import { TaskType } from "types/task-type";
import { useHttp } from "./http";

export const useTaskTypes = () => {
    const client = useHttp();
  
    //['projects', param]  里面的值变化的时候就会重新触发useQuery来发请求
    return useQuery<TaskType[]>(["taskTypes"], () =>
      client("taskTypes", )
    );
  };