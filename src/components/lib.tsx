import React from "react"
import {Spin, Typography ,Button} from 'antd'
import styled from "@emotion/styled"
import { DevTools } from "jira-dev-tool"

// 用css-in-js自定义组件 Row （实现flex横向均匀布局的分布，通过传入gap值大小可以动态改变间距）
export const Row = styled.div<{
    gap?:number | boolean,
    between?: boolean,
    marginBottom?:number
     }>`
    display: flex;
    align-items: center;
    justify-content: ${props => props.between ? 'space-between': undefined};
    margin-bottom: ${props => props.marginBottom + 'rem'};
    > * {
        margin-top: 0 !important;
        margin-bottom: 0 !important; 
        margin-right: ${props => typeof props.gap === 'number' ? props.gap + 'rem' : props.gap ? '2rem' : undefined};
    }
`
const FullPage = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const FullPageLoading =() =>{
    return (
        <FullPage>
            <Spin size={"large"}/>
        </FullPage>
    )
}

export const FullPageErrorFallback = ({error}:{error:Error | null}) => {
    return (
        <FullPage>
            <DevTools/>
            <Typography.Text type={"danger"}>{error?.message}</Typography.Text>
        </FullPage>
    )
}


// button padding为0的组件

export const ButtonNoPadding = styled(Button)`
    padding: 0;
`