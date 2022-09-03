// 封装收藏功能点亮星星的组件
import React from "react";
import {Rate} from 'antd'


interface PinProps extends React.ComponentProps< typeof Rate> {
    checked:boolean;
    onCheckedChange?: (checked:boolean) => void
}
// !!num === Boolean(num)
// ?. onCheckedChange为undefined时候啥也不干
export const Pin = (props: PinProps) =>{
    const {checked ,onCheckedChange , ...restProps} = props
    return <Rate
    count={1}
    value={checked ? 1 : 0}
    onChange = { num => onCheckedChange?.(!!num)}
    {...restProps}
    />
}