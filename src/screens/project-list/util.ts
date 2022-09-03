import { useMemo, useState } from "react"
import { useUrlQueryParam } from "utils/url"

// 项目类表搜索的参数
export const useProjectsSearchParam = () => {
    const [keys , setKeys] = useState<('name'|'personId')[]>(['name','personId'])
    const [param ,setParam] = useUrlQueryParam(keys)  
    // param的personId是string类型的，需要一个number类型的
    return [
        useMemo(() => ({...param , personId:Number(param.personId) || undefined}) , [param]) ,
        setParam 
    ] as const
}