import { useCallback, useReducer } from "react";
const UNDO = "UNDO"
const REDO = "REDO"
const SET = "SET"
const RESET = "RESET"

type State<T> = {
    past : T[],
    present : T,
    future : T[]
}
type Action<T> = {
    newPresent? : T
    type: typeof UNDO | typeof REDO | typeof SET | typeof RESET  
}

// 利用useReducer进行状态管理  通过接受action不同的状态返回不同的值
const undoReducer = <T>(state : State<T> , action : Action<T> ) => {
    const { past , present , future } = state;
    const { type , newPresent} = action;

    switch( type ){
        case UNDO :{
                if(past.length ===  0) return state
                const previous = past[past.length-1]
                const newPast = past.slice(0 , past.length -1);

                return {
                    past : newPast,
                    present: previous,
                    future: [present, ...future],
            }
        }

        case REDO : {
            if( future.length === 0 ) return state
            const next = future[0]
            const newFuture = future.slice(1)
            return {
                past : [...past , present],
                present: next ,
                future : newFuture
            }  
        }

        case SET : {
            if( present === newPresent) {
                return state
            }
            return {
                past: [...past , present],
                present:newPresent , 
                future : []
            }
        }

        case RESET : {
            return {
                past: [],
                present:newPresent , 
                future : []
            }
        } 
    }
    return state
}

export const UseUndo = <T>( initialPresent: T ) => {

    const [state , dispatch] = useReducer( undoReducer , {
        past:[],
        present : initialPresent ,
        future: []
    } as State<T>)

    const undo = useCallback(()=>{
        dispatch({type : UNDO})
    } , [] )
    const redo = useCallback(()=>{
        dispatch({type : REDO})
    } , [] )
    const set = useCallback(( newPresent : T)=>{
        dispatch({type : SET , newPresent})
    } , [] )
    const reset = useCallback((newPresent : T)=>{
        dispatch({type : RESET, newPresent})
    } , [] )

    //  这中写法，将函数中所用到的所有依赖，通过currentState传入，使其不用借助外来依赖，callback中也不需写入依赖项
    // // 时间倒退一格
    // // 任务数组，存放所有历史的任务序列
    // const [past ,setPast] = useState<T[]>([]);
    // // 当前显示对象
    // const [present , setPresent] = useState(initialPresent);
    // // 倒退后，存入到退前任务
    // const [future ,setFuture] = useState<T[]>([])
    // const [state , setState] = useState<{
    //     past:T[],
    //     present:T,
    //     future:T[]
    // }>({
    //     past:[],
    //     present:initialPresent,
    //     future:[]
    // })

    // const canUndo = state.past.length !== 0;
    // const canRedo = state.future.length !== 0;

    // const undo = useCallback(()=>{
        // setState(currentState =>{
        //     const {past , present , future} = currentState
        //     if(past.length ===  0) return currentState
        //     const previous = past[past.length-1]
        //     const newPast = past.slice(0 , past.length -1);

        //     return {
        //         past : newPast,
        //         present: previous,
        //         future: [present , ...future]
        //     }
        // })     
    // } , []) // useCallback里面不用写 ， 因为函数中没有用到外面的任何依赖， 都来自currentState

    // const redo = useCallback(()=>{
    //     setState(currentState => {
    //         const {past , present , future} = currentState
    //         if( future.length === 0 ) return currentState
    //         const next = future[0]
    //         const newFuture = future.slice(1)
    //         return {
    //             past : [...past , present],
    //             present: next ,
    //             future : newFuture
    //         }  
    //     })
    // } , [])

    // const set = useCallback((newPresent:T)=> {
    //     setState(currentState => {
    //         const {past , present , future} = currentState
    //         if( present === newPresent) {
    //             return currentState
    //         }
    //         return {
    //             past: [...past , present],
    //             present:newPresent , 
    //             future : []
    //         }
    //     })
    // } , [])

    // const reset = useCallback((newPresent : T)=> {
    //     setState(() => {
    //         return {
    //             past: [],
    //             present:newPresent , 
    //             future : []
    //         }
    //     })
    // } , [])

    // return [
    //     state, 
    //     {set , reset , undo , redo , canUndo , canRedo}
    // ] as const ;

    // 最初版本写法，因为每个函数都用到了外面的依赖，后又要暴露出去，所以得用usecallback，且写入很多依赖
    // // 时间倒退一格
    // // 任务数组，存放所有历史的任务序列
    // const [past ,setPast] = useState<T[]>([]);
    // // 当前显示对象
    // const [present , setPresent] = useState(initialPresent);
    // // 倒退后，存入到退前任务
    // const [future ,setFuture] = useState<T[]>([])

    // const undo = useCallback(() => {
    //     if(!canUndo) return 
    //     // [2]  任务倒退一格，且提取原本最新任务
    //     const previous = past[past.length-1]
    //     // [0 , 1 , 2]  => [0 , 1]  
    //     const newPast = past.slice(0 , past.length -1);

    //     setPast(newPast)  // 将新的任务序列跟新入past任务序列中
    //     setPresent(previous)  // 将历史任务序列中最新值放入当前显示对象中
    //     setFuture([present , ...future])  // 将真实值放入未来任务序列中
    // },['canUndo', 'future', 'past','present'])  // 依赖太多，繁琐

    // //时间前进一格
    // const redo = () => {
    //     if(!canRedo) return 

    //     const next = future[0]
    //     // ['present' , f1 , f2 , f3]
    //     const newFuture = future.slice(1)

    //     setPast([...past , present])
    //     setPresent(next);
    //     setFuture(newFuture)

    // } 
    
    // //控制状态起始变化
    // const set = (newPresent : T) => {
    //     if( present === newPresent) {
    //         return 
    //     }
    //     setPast([...past , present])
    //     setPresent(newPresent)
    //     setFuture([])
    // }

    // // 重置操作
    // const reset = (newPresent : T ) => {
    //     setPast([])
    //     setPresent(newPresent)
    //     setFuture([])
    // }
    
    // return [
    //     {past , present , future} , 
    //     {set , reset , undo , redo , canUndo , canRedo}
    // ] as const
}