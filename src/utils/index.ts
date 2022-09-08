import {useEffect, useRef, useState} from "react"

//isFalsy函数解决当value值为0时在判断中将其当为false得情况
export const isFalsy = (value: unknown) : boolean =>  value === 0 ? false : !value

export const isVoid = (value:unknown) => value === undefined || value === null || value === ''

//解决object中得键值为空的情况
// let b:object; //对象涵盖范围很广 此时b就是个空对象
// b =  {...()=>{}}
// let a:{[key:string]:unknown}
// a = () => {}
export const cleanObject = (object:{[key:string]:unknown}) => {
    const result = {...object};
    Object.keys(result).forEach((key)=>{
        const value = result[key];
        if(isVoid(value)){
            delete result[key]
        }
    })
    return result
} 


//自定义hook中都使用到了其他hook
//提取useMount时空数组情况为单独hook  只能取名为use开头
export const useMount = (callback: () => void) => {
    useEffect(() => {
      callback()
      // TODO 依赖项里加上callback会造成无限循环 ， 这个和useCallback以及useMemo有关系
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) 
}

// delay?: number 表示这个参数可以不传，或者只能传个number
// :any 没有声明返回值时any的时候，默认返回值为unknown这叫做类型推断 
// export const useDebounce = ( value: unknown , delay?: number) :any => {
export const useDebounce = <V>( value: V , delay?: number) => {
    const [debouncedValue , setDebouncedValue] = useState(value)

    useEffect(() => {
        //每次在value和delay变化后，设置一个定时器
        const timeout = setTimeout(()=>{
            setDebouncedValue(value)
        },delay)
        //useEffect中得return在上一个useEffect处理完后执行
        return () => {
            clearTimeout(timeout)
        }
    } , [value ,delay])
    return debouncedValue
}

// 自定义头部标题
export const useDocumentTitle = ( title : string , keepOnUnmount:boolean = true) => {
    //oldTitle会变化，可以用useRef保留最初状态  其 .current 属性被初始化为传入的参数（initialValue）。返回的 ref 对象在组件的整个生命周期内持续存在
    const oldTitle = useRef(document.title).current;
    
    // const oldTitle = document.title
    // console.log('渲染',oldTitle);
    
    useEffect(()=>{
        document.title = title
    },[title])
   // 页面加载时oldTitle 会变化

    // 闭包实现
    // useEffect(()=>{
    //     // return返回的函数造成函数的闭包，所以该在页面时侯执行一次，形成闭包，作用域引用得始终是页面加载时oldTitle得值
    //     // return函数只在组件被销毁之前才会执行,作用域引用得始终是页面加载时oldTitle得值
    //     return ()=>{
    //         if(!keepOnUnmount) {
    //             document.title = oldTitle
    //             // console.log('卸载',oldTitle);
    //         }
    //     }
    // },[])

    //useRef实现
    useEffect(()=>{
        return ()=>{
            if(!keepOnUnmount) {
                document.title = oldTitle
                // console.log('卸载',oldTitle);
            }
        }
    },[keepOnUnmount,oldTitle])
}




//重置路由的方法
export const resetRoute = () => window.location.href = window.location.origin

/**
 * 传入一个对象，和键集合，返回对应的对象中的键值对
 * @param obj
 * @param keys
 */
 export const subset = <
 O extends { [key in string]: unknown },
 K extends keyof O
>(
 obj: O,
 keys: K[]
) => {
 const filteredEntries = Object.entries(obj).filter(([key]) =>
   keys.includes(key as K)
 );
 return Object.fromEntries(filteredEntries) as Pick<O, K>;
};


//解决异步操作还未完成卸载组件的报错
/**
 * 该组件返回组件挂载的状态， 如果还没挂载或已卸载，返回false； 反之返回true
 */

export const useMountedRef = () => {
    const mountedRef = useRef(false)

    useEffect(()=>{
        //页面挂载前 
        mountedRef.current = true;
        return ()=>{
            //页面卸载前
            mountedRef.current = false;
        }
    })
    return mountedRef
}