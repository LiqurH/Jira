//自定义Select组件，解决返回值string问题
import React from "react";
import {Select} from 'antd'
import { Raw } from "types";

//解决自定义IdSelect上传入Select自身属性类型的兼容问题
type SelectOptions = React.ComponentProps< typeof Select>  //得到Select自身的类型属性

interface IdSelectProps extends Omit<SelectOptions , 'value' | 'onChange' | 'options'>{
    value? : Raw | null | undefined, 
    onChange?: (value? : number) => void,
    defaultOptionName? : string,
    options? : { name: string , id : number}[]
}
/**
 * value 可以传入多种类型的值
 * onChange只会回调 number | undefined 类型
 * 当 isNaN(Number(value)) 为true 的时候，代表选择默认类型
 * 当选择默认类型的时候。onChange会回调undefined 
 */

export const IdSelect = (props: IdSelectProps) => {
    const {value , onChange , defaultOptionName , options , ...restProps} = props
    return <Select 
    value = {options?.length ?  toNumber(value) : 0}
    onChange = {value => onChange?.(toNumber(value) || undefined)}
    {...restProps}
    >
        {
            defaultOptionName ? <Select.Option value={0}>{defaultOptionName}</Select.Option> : null 
        }
        {
            options?.map( option => <Select.Option key={option.id} value={option.id}>{option.name}</Select.Option>)
        }
    </Select>
}

const toNumber = (value :unknown) => isNaN(Number(value)) ? 0 : Number(value)