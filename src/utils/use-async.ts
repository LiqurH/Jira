//管理了获取项目列表异步操作的状态
import { useCallback, useState , useReducer} from "react";
import { useMountedRef } from "utils";

interface State<D> {
    error : Error | null;
    data : D | null;
    stat : 'idle' | 'loading' | 'error' | 'success'
}  

const defaultInitialState: State<null> = {
    stat :'idle',
    error: null,
    data:null
}

const defaultConfig ={
    throwOnError : false
}

const useSafeDispatch = <T>( dispatch : (...args:T[]) => void) => {
    const mountedRef = useMountedRef()

    return useCallback(( ...args : T[]) => (mountedRef.current ? dispatch(...args) : void 0) , [dispatch ,mountedRef])
}

// 用useReducer改写useAsync 
export const useAsync = <D>(initialState?: State<D> , initialConfig?:typeof defaultConfig) =>{
    const config = { ...defaultConfig, ...initialConfig };
    const [state , dispatch] = useReducer((state: State<D> , action : Partial<State<D>>)=> ({...state , ...action}) , {
        ...defaultInitialState,
        ...initialState
    })
    const safeDispatch = useSafeDispatch(dispatch)
    // 使用useState懒加载方法实现存入函数
    const [retry , setRetry] = useState(()=>{ return () => {
        return 
    }})

    const setData = useCallback(( data : D) => safeDispatch({
        data,
        stat:'success',
        error:null
    }),[safeDispatch])

    const setError = useCallback(( error : Error) => safeDispatch({
        data:null,
        stat:'error',
        error
    }),[safeDispatch])

    // run 函数用来触发异步请求
    const run = useCallback(( promise : Promise<D> , runConfig?:{retry:()=>Promise<D>}) => {
        if(!promise || !promise.then){
            //throw Error 会打断一切进程
            throw new Error('请传入 Promise 类型数据')
        }
        setRetry(() => () => {
            if(runConfig?.retry){
                run(runConfig?.retry() , runConfig)
            }
        })
        safeDispatch({stat:'loading'})
        // 异步操作的等待时间都在这
        return promise.then( data => {
            setData(data)           
            return data
        }).catch(err => {
            //catch会消化异常，如果不主动抛出，外面是接收不到异常的
            setError(err)
            // return err          
            if(config.throwOnError){
                return Promise.reject(err)
            }else{
                return err
            }          
        })
        //[]；依赖列表   只有当以来列表被改变时run函数才会被重新定义
    },[config.throwOnError, setData ,setError,safeDispatch])
    //retry被调用时重新跑一次run , 让state刷新一遍
    return {
        isIdle:state.stat === 'idle',
        isLoading:state.stat === 'loading',
        isError: state.stat === 'error',
        isSuccess: state.stat === 'success',
        run,
        setData,
        setError,
        retry,
        ...state
    }
}

// export const useAsync = <D>(initialState?: State<D> , initialConfig?:typeof defaultConfig) =>{
//     const config = { ...defaultConfig, ...initialConfig };
//     const [state , setState] = useState<State<D>>({
//         ...defaultInitialState,
//         ...initialState
//     })
//     const mountedRef = useMountedRef()
//     // 使用useState懒加载方法实现存入函数
//     const [retry , setRetry] = useState(()=>{ return () => {
//         return 
//     }})

//     const setData = useCallback(( data : D) => setState({
//         data,
//         stat:'success',
//         error:null
//     }),[])

//     const setError = useCallback(( error : Error) => setState({
//         data:null,
//         stat:'error',
//         error
//     }),[])

//     // run 函数用来触发异步请求
//     const run = useCallback(( promise : Promise<D> , runConfig?:{retry:()=>Promise<D>}) => {
//         if(!promise || !promise.then){
//             //throw Error 会打断一切进程
//             throw new Error('请传入 Promise 类型数据')
//         }
//         setRetry(() => () => {
//             if(runConfig?.retry){
//                 run(runConfig?.retry() , runConfig)
//             }
//         })
//         setState(prevState => ({...prevState, stat:'loading'}))
//         // 异步操作的等待时间都在这
//         return promise.then( data => {
//             if(mountedRef.current){
//                 setData(data)
//             }            
//             return data
//         }).catch(err => {
//             //catch会消化异常，如果不主动抛出，外面是接收不到异常的
//             setError(err)
//             // return err          
//             if(config.throwOnError){
//                 return Promise.reject(err)
//             }else{
//                 return err
//             }          
//         })
//         //[]；依赖列表   只有当以来列表被改变时run函数才会被重新定义
//     },[config.throwOnError, mountedRef, setData ,setError])
//     //retry被调用时重新跑一次run , 让state刷新一遍
//     return {
//         isIdle:state.stat === 'idle',
//         isLoading:state.stat === 'loading',
//         isError: state.stat === 'error',
//         isSuccess: state.stat === 'success',
//         run,
//         setData,
//         setError,
//         retry,
//         ...state
//     }
// }