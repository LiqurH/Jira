//抽取搜索请求返回状态得hook

import { useCallback, useEffect } from "react"
import { Project } from "screens/project-list/List"
import { cleanObject, useDebounce } from "utils"
import { useHttp } from "./http"
import { useAsync } from "./use-async"
//注意这个引入  import * as 一次性全部导入模块的所有变量 as qs 用来命名
//import * as qs from 'qs' 
//用于获取Project列表
export const useProjects = (param?: Partial<Project>) => {
     //使用自定义hook封装http请求
    const client = useHttp()
    
    //维持loading得信息        
    const {run, ...result} = useAsync<Project[]>()
    // const [list , setList] = useState([])
    // const [isLoading ,setIsLoading] = useState(false)
    // const [error , setError] = useState< null | Error>(null)

    const fetchProjects = useCallback(() => client('projects',{data:cleanObject(param || {})}),[client ,param])
    useEffect(()=>{
        // 调用run函数的时候client('projects',{data:cleanObject(param || {})})该函数已经执行完了，所以在其他地方给run函数里面传入Promise并不会出发该请求的重新请求
        // run(client('projects',{data:cleanObject(param || {})}))
        // 解决这个问题需要将请求函数传过去重新调用
        run(fetchProjects() , {
            retry:fetchProjects
        })
        // run函数封装  client函数返回一个promise
        // setIsLoading(true)
        // client('projects',{data:qs.stringify(cleanObject(debouncedParam))})
        // .then(setList)
        // .catch((err) => {
        //     //请求出错返回错误信息，及空数组
        //     setList([])
        //     setError(err)
        // })
        // .finally(()=>setIsLoading(false))    


        //${apiUrl}/projects?name=${param.name}&personId=${param.personId}
        // fetch(`${apiUrl}/projects?${qs.stringify(cleanObject(debouncedParam))}`).then(async res => {
        //     if(res.ok){
        //         setList(await res.json())
        //     }
        // })


        // eslint-disable-next-line react-hooks/exhaustive-deps
        // run函数是非状态非基本类型的变量，放状态里会导致无限循环
    },[param ,run ,fetchProjects])
    return result
}


// 向服务端发送编辑请求的方法
export const useEditProject = () => {
    const {run,...asyncResult} = useAsync();
    const client = useHttp();
    const mutate = (params : Partial<Project>) => {
        return run(client(`projects/${params.id}` , {
            data:params,
            method:'PATCH'
        }))
    }
    return {
        mutate,
        ...asyncResult
    }
}

export const useAddProject = () => {
    const {run,...asyncResult} = useAsync();
    const client = useHttp();
    const mutate = (params : Partial<Project>) => {
        return run(client(`projects/${params.id}` , {
            data:params,
            method:'POST'
        }))
    }
    return {
        mutate,
        ...asyncResult
    }
}