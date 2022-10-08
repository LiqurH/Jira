// 实现card页面搜索时颜色变化

import React from 'react'

/*
    name： 项目管理的项目
    keyword ： 项目
    arr：['项目' ， 管理的 ， '项目']
*/
export const Mark = ({name , keyword} : {name:string , keyword: string}) => {
    if(!keyword) {
        return <>{name}</>
    } 
    const arr = name.split(keyword)
    return <>
        {
            arr.map((str:string , index:number) => <span key = { index}>
                {str}
                {
                    index === arr.length - 1 ? null : <span style={{color:'#257AFD'}}>
                        {keyword}
                    </span>
                }
            </span>)
        }
    </>
}