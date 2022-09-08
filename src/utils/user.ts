//封装获取用户得hook

import {User} from 'types/user'
import { useEffect } from "react"
import { cleanObject, useDebounce } from "utils"
import { useHttp } from "./http"
import { useAsync } from "./use-async"

export const useUsers = (param?: Partial<User>) => {
     //使用自定义hook封装http请求
    const client = useHttp()        
    const {run, ...result} = useAsync<User[]>()

    useEffect(()=>{
        run(client('users',{data:cleanObject(param || {})}))
    },[param]);
    return result
} 