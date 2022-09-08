//抽取搜索请求返回状态得hook

import { useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Project } from "types/project";
import { useProjectsSearchParam } from "screens/project-list/util";
import { cleanObject, useDebounce } from "utils";
import { useHttp } from "./http";
import { useAsync } from "./use-async";
import { useAddConfig, useEditConfig ,useDeleteConfig} from "./use-optimistic-options";
import { QueryKey } from "react-query"
//注意这个引入  import * as 一次性全部导入模块的所有变量 as qs 用来命名
//import * as qs from 'qs'
//用于获取Project列表
// export const useProjects = (param?: Partial<Project>) => {
//      //使用自定义hook封装http请求
//     const client = useHttp()

//     //维持loading得信息
//     const {run, ...result} = useAsync<Project[]>()
//     // const [list , setList] = useState([])
//     // const [isLoading ,setIsLoading] = useState(false)
//     // const [error , setError] = useState< null | Error>(null)

//     const fetchProjects = useCallback(() => client('projects',{data:cleanObject(param || {})}),[client ,param])
//     useEffect(()=>{
//         // 调用run函数的时候client('projects',{data:cleanObject(param || {})})该函数已经执行完了，所以在其他地方给run函数里面传入Promise并不会出发该请求的重新请求
//         // run(client('projects',{data:cleanObject(param || {})}))
//         // 解决这个问题需要将请求函数传过去重新调用
//         run(fetchProjects() , {
//             retry:fetchProjects
//         })
//         // run函数封装  client函数返回一个promise
//         // setIsLoading(true)
//         // client('projects',{data:qs.stringify(cleanObject(debouncedParam))})
//         // .then(setList)
//         // .catch((err) => {
//         //     //请求出错返回错误信息，及空数组
//         //     setList([])
//         //     setError(err)
//         // })
//         // .finally(()=>setIsLoading(false))

//         //${apiUrl}/projects?name=${param.name}&personId=${param.personId}
//         // fetch(`${apiUrl}/projects?${qs.stringify(cleanObject(debouncedParam))}`).then(async res => {
//         //     if(res.ok){
//         //         setList(await res.json())
//         //     }
//         // })

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//         // run函数是非状态非基本类型的变量，放状态里会导致无限循环
//     },[param ,run ,fetchProjects])
//     return result
// }

// 用useQuery改造
export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();

  //['projects', param]  里面的值变化的时候就会重新触发useQuery来发请求
  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );
};

// 向服务端发送编辑请求的方法  下面是用reactQuery替换useAsync
// export const useEditProject = () => {
//     const {run,...asyncResult} = useAsync();
//     const client = useHttp();
//     const mutate = (params : Partial<Project>) => {
//         return run(client(`projects/${params.id}` , {
//             data:params,
//             method:'PATCH'
//         }))
//     }
//     return {
//         mutate,
//         ...asyncResult
//     }
// }
export const useEditProject = (queryKey:QueryKey) => {
  // 编辑收藏项目列表
  const client = useHttp();
//   const queryClient = useQueryClient();
//   const [searchParams] = useProjectsSearchParam();
//   const queryKey = ["projects", searchParams];
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
      useEditConfig(queryKey)
    // {
    //   onSuccess: () => queryClient.invalidateQueries(queryKey),
    //   async onMutate(target: Partial<Project>) {
    //     console.log(queryKey);
    //     const previousItems = queryClient.getQueryData(queryKey);
    //     queryClient.setQueryData(queryKey, (old?: Project[]) => {
    //       return (
    //         old?.map((project) =>
    //           project.id === target.id ? { ...project, ...target } : project
    //         ) || []
    //       );
    //     });
    //     return { previousItems };
    //   },
    //   onError(error, newItem, context) {
    //     queryClient.setQueryData(
    //       queryKey,
    //       (context as { previousItems: Project[] }).previousItems
    //     );
    //   },
    // }
  );
};
// export const useAddProject = () => {
//     const {run,...asyncResult} = useAsync();
//     const client = useHttp();
//     const mutate = (params : Partial<Project>) => {
//         return run(client(`projects/${params.id}` , {
//             data:params,
//             method:'POST'
//         }))
//     }
//     return {
//         mutate,
//         ...asyncResult
//     }
// }

export const useAddProject = (queryKey:QueryKey) => {
  // 增加项目列表
  const client = useHttp();
//   const queryClient = useQueryClient();
  return useMutation(
    (params: Partial<Project>) =>
      client(`projects`, {
        data: params,
        method: "POST",
      }),
      useAddConfig(queryKey)
    // {
    //   onSuccess: () => queryClient.invalidateQueries("projects"),
    // }
  );
};

export const useDeleteProject = (queryKey:QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({id} : {id:number}) =>
      client(`projects/${id}`, {
        method: "DELETE",
      }),
      useDeleteConfig(queryKey)
  );
};

// 获取project详情的API
export const useProject = (id?: number) => {
  const client = useHttp();
  return useQuery<Project>(
    ["project", { id }],
    () => client(`projects/${id}`),
    {
      enabled: Boolean(id), // !!id
    }
  );
};
