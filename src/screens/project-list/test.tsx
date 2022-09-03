import React, { useEffect, useState } from "react";
//闭包问题
export const Test = ( ) => {
     const [num ,setNum] = useState(0);
     const add = () => setNum(num + 1)
// useEffect函数中得setInterval和return函数 只有在页面加载时侯执行一次，形成闭包，作用域引用得始终是页面加载时num得值
     useEffect(()=>{
        const clear= setInterval(()=>{
            console.log('num in setInter: ' , num);  // num in setInter:  0
        },1000)
        return ()=>{clearInterval(clear)}
     },[])
// return函数只在组件被销毁之前才会执行
     useEffect(()=>{
        return ()=>{
            console.log(num);  // 0   
        }
     },[])

     return <div>
        <button onClick={add}>add</button>
        <p>
            number: {num}
        </p>
     </div>
}