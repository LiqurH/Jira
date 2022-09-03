//封装http请求
import qs from 'qs'
import * as auth from 'auth-provider'
import { useAuth } from 'context/auth-context'
import { useCallback } from "react";
const apiUrl = process.env.REACT_APP_API_URL




interface Config extends RequestInit{
    token? : string,
    data? : object,  
}
// 自定义hook来解决请求的封装,未携带JWT token携带进去
export const http = async ( endpoint : string , { data , token , headers , ...customConfig} : Config = {}) => {
    // ...customConfig 中的method会覆盖默认的method 'GET'
    const config = {
        method: 'GET',
        headers:{
            Authorization : token ? `Bearer ${token}` : '',
            'Content-Type' : data ? 'application/json' : '',
        },
        ...customConfig
    }
    //get请求要将参数放入请求字符串中
    if(config.method.toUpperCase() === 'GET'){
        endpoint += `?${qs.stringify(data)}`
    }else{
        config.body = JSON.stringify(data || {})
    }
    
//在fetch api 中服务端返回的异常状态，fetch后面的catch并不会捕获该异常，只有在断网，网络异常才会抛出异常
//所以想要抛出异常，尽量在if(res.ok)判断中完成
    return window.fetch(`${apiUrl}/${endpoint}`,config) 
        .then( async res => {
            if(res.status === 401){
                await auth.logout()
                window.location.reload()
                return Promise.reject({message:'请重新登陆'})
            }
            const data = await res.json()
            if(res.ok){
                return data
            }else{
                return Promise.reject(data)
            }
        })
}
// 自定义hook来解决请求的封装,将JWT token携带进去  函数里要使用其他hook，函数本身就得是个hook
//[endpoint , config] : [string ,Config] 该处参数类型和http函数参数类型一样 可以这样写 [endpoint , config] : Parameters<typeof http>
export const useHttp = () => {
    const {user} = useAuth();
    // return ([endpoint , config] : [string ,Config]) => http(endpoint , {...config , token:user?.token})
    return useCallback(
        (...[endpoint, config]: Parameters<typeof http>) =>
          http(endpoint, { ...config, token: user?.token }),
        [user?.token]
      );
}

/*
    JS中的typeof实在runtime（运行态）时运行的
    TS中的typeof实在静态环境中运行的
*/

// intterface不能实现 utility type  而 类型别名可以
// utility type 的用法: 用泛型给他传入一个其他类型，然后utility type 会对这个类型进行某种操作
/*
    type Person = {
        name: string
        age : number
    }
    常用utility type：
     1. Parameters 会以传入函数的参数类型来规定state的参数类型
        const state =([endpoint , config] : Parameters<typeof http>)
     2. Partial 会让Person里面的属性变为可选参数
        const xiaoMing : Partial<Person> = {}
     3. Omit  会接受两个参数，第一个为类型定义，第二个为要删除该类型定义中的那个类型
        const shenMiRen : Omit<Person,'name'> = { age : 8}
        const shenMiRen1 : Omit<Person,'name' | 'age'> = {}
*/
