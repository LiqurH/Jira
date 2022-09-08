import { useMemo ,useState} from "react";
import { useSearchParams ,URLSearchParamsInit} from "react-router-dom";
import { cleanObject ,subset } from "utils";
// searchParams获取param参数  https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
// 根据url得param参数返回相应的页面
// export const useUrlQueryParam = <K extends string>(keys: K[]) => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   return [
//     // 把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值
//     useMemo(
//       () =>
//         keys.reduce((prev, key) => {
//           // console.log('key',key);
//           // console.log('prev',prev);
//           // console.log('searchParams.get(key)',searchParams.get(key));  
//           return { ...prev, [key]: searchParams.get(key) || "" };
//         }, {} as { [key in K]: string }),
//         //state 的值，不会造成无限循环   
//       [searchParams, keys]
//     ),
//     (params:Partial<{[key in K ] : unknown}>) => {
//       // console.log('searchParams', searchParams); //searchParams URLSearchParams {}[[Prototype]]: URLSearchParams
//       // console.log('fromEntries-searchParams', Object.fromEntries(searchParams)); //fromEntries-searchParams {name: "kaui'di"}
//       const o = cleanObject({...Object.fromEntries(searchParams) , ...params}) as URLSearchParamsInit
//       return setSearchParams(o)
//     }
//   ] as const;
//   //  as const
// };

// as const Ts解析数组时希望其中的类型都一致
/* 
    const a = [ 'jack' , 12 , {gender : 'male'}]           //const a: (string | number | {gender: string;})[]
    const a = [ 'jack' , 12 , {gender : 'male'}] as const  // const a: readonly ["jack", 12, {readonly gender: "male";}]
*/


// iterator 遍历器  [],{},map 都可以用 for...of 进行遍历
// iterator属性存在在 [Symbol.iterator]
// iterator: https://codesandbox.io/s/upbeat-wood-bum3j?file=/src/index.js
/*  iterator实现
  const obj = {
  data: ["hello", "world"],
    [Symbol.iterator]() {
      const self = this;
      let index = 0;
      return {
        next() {
          if (index < self.data.length) {
            return {
              value: self.data[index++] + "!",
              done: false
            };
          } else {
            return { value: undefined, done: true };
          }
        }
      };
    }
  };

  for (let o of obj) {
    console.log(o);
  }

*/

// Object.fromEntries(iterator)   ==> 把键值对列表转换为一个对象

export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlSearchParam();
  const [stateKeys] = useState(keys);
  return [
    useMemo(
      () =>
        subset(Object.fromEntries(searchParams), stateKeys) as {
          [key in K]: string;
        },
      [searchParams, stateKeys]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      return setSearchParams(params);
      // iterator
      // iterator: https://codesandbox.io/s/upbeat-wood-bum3j?file=/src/index.js
    },
  ] as const;
};

export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  // console.log(searchParams);
  // console.log(Object.fromEntries(searchParams));
  
  return (params: { [key in string]: unknown }) => {
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;
    // console.log(o);
    return setSearchParam(o);
  };
};