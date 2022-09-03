import React from "react";
import { useAuth } from "context/auth-context"
// import { FormEvent } from "react"
import {Form, Input } from 'antd'
import { LongButton } from "unauthenticated-app";
import { useAsync } from "utils/use-async";
// const apiUrl = process.env.REACT_APP_APT_URL
export const RegisterScreen = ({onError}:{onError : (error:Error) => void}) => {
    // interface P {
    //     username:string 
    //     password: number
    // }
    // const login = (param:P) => {}
    //相当于
    // const login = (param:{username:string , password: string}) => {
    //     fetch(`${apiUrl}/register`, {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(param),
    //       }).then(async (res) => {
    //         if (res.ok) {
    //           let data = await res.json();
    //           console.log(data);
    //         }
    //       });
    // }
    const { register , user } = useAuth()
    //handleSubmit本身的类型是FormEventHandler，而event的类型是FormEvent
    // const handleSubmit = (event : FormEvent<HTMLFormElement>) => {
            // //阻止表单提交的默认行为
            // event.preventDefault()
            // //as HTMLInputElement强制让该值为HTMLInputElement类型，默认为Element类型（HTMLInputElement继承自Element）Element类型上没有value方法
            // const username = (event.currentTarget.elements[0] as HTMLInputElement).value
            // const password = (event.currentTarget.elements[1] as HTMLInputElement).value
            // register({username,password})
    // }
    //此处定义event需要一个Element类型的参数，传入了一个更加强大的HTMLFormElement类型（HTMLFormElement类型中包含Element类型的所有定义，因为HTMLFormElement继承自Element）所以并不报错
    // const handleSubmit = (event : FormEvent<Element>) => {}
    
    
    //根据<Form.Item name={'username'} name属性判断此处values的值
    const {run , isLoading} = useAsync(undefined,{throwOnError:true})
    const handleSubmit = async ( {cpassword , ...values} :{username:string , password : string , cpassword:string}) => {
        if(cpassword !== values.password){
            onError(new Error('请确认两次输入的密码相同'))
            return
        }
        try{
            await run(register(values))
        }catch(e:any){
            onError(e)
        }
      
    }
  

    return (
        // 执行onSubmit时候，form会给handleSubmit传入一个HTMLFormElement类型的参数
        <Form onFinish={handleSubmit}>

            <Form.Item name={'username'} rules={[{required:true , message:'请输入用户名'}]}>
                <Input placeholder="用户名" type="text" id={'username'}/>
            </Form.Item>
            <Form.Item name={'password'} rules={[{required:true , message:'请输入密码'}]}>
                <Input placeholder="密码" type="password" id={'password'}/>
            </Form.Item>
            <Form.Item name={'cpassword'} rules={[{required:true , message:'请确认密码'}]}>
                <Input placeholder="确认密码" type="password" id={'cpassword'}/>
            </Form.Item>
            <Form.Item>
                 <LongButton loading={isLoading} htmlType={'submit'} type={'primary'}>注册</LongButton>
            </Form.Item>
        </Form>
    )
}