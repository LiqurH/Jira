//错误边界组件
import React, { ReactNode } from "react";

/*
React.ReactElement 类似下面这些就是React.ReactElement
     <FullPage>
            <DevTools/>
            <Typography.Text type={"danger"}>{error?.message}</Typography.Text>
     </FullPage>
*/
// https://github.com/bvaughn/react-error-boundary
type FallbackRender = (props : {error : Error | null}) => React.ReactElement

// export class ErrorBoundary extends React.Component<{children:ReactNode , fallbackRender :FailbackRender},any>{}
// type PropsWithChildren<P> = P & { children?: ReactNode | undefined };
// ===
export class ErrorBoundary extends React.Component<React.PropsWithChildren<{fallbackRender :FallbackRender}>,{error:Error | null}>{
    state = { error : null}
    //当子组件发生异常。这里会接收到并且调用该函数，使得state中得error值为这里返回的的error
    static getDeriveStateFormError(error:Error) {
        return {error}
    }
    render(){
        const {error} = this.state
        const  {fallbackRender,children} = this.props
        if(error){
            return fallbackRender({error})
        }
        return children
        
    }
}