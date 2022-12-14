# Jira
# 1. 代码配置
1.绝对路径配置  tsconfig.json中  "baseUrl": "src",
2.配置代码格式化 prettier
    yarn add --dev --exact prettier
    echo {}> .prettierrc.json 生成配置文件
    .prettierignore   加入文件 写入忽略格式化的文件
    让 Prettier 在每次提交之前运行   npm install --save-dev husky lint-staged
                                    npx husky install
                                    npm pkg set scripts.scriptname="cmd"
                                    npx husky add .husky/pre-commit "npx lint-staged"
    npm install --save-dev eslint-config-prettier 配置eslint
                                      "eslintConfig": {
                                                            "extends": [
                                                            "react-app",
                                                            "react-app/jest",
                                                            "prettier"
                                                            ]
                                                        },
3.commitlint 代码上传规定


# 2. MOCK 方案
### 1. 代码侵入 (直接在代码中写死 Mock 数据，或者请求本地的 JSON 文件)

优点：无

缺点：

1. 和其他方案比 Mock 效果不好
2. 与真实 Server 环境的切换非常麻烦，一切需要侵入代码切换环境的行为都是不好的

### 2. 请求拦截

代表：[Mock.js](http://mockjs.com/)

示例：

```
Mock.mock(/\\/api\\/visitor\\/list/, 'get', {
  code: 2000,
  msg: 'ok',
  'data|10': [
    {
      'id|+1': 6,
      'name': '@csentence(5)',
      'tag': '@integer(6, 9)-@integer(10, 14)岁 @cword("零有", 1)基础',
      'lesson_image': "<https://images.pexels.com/3737094/pexels-photo-3737094.jpeg>",
      'lesson_package': 'L1基础指令课',
      'done': '@integer(10000, 99999)',
    }
  ]
})

```

优点：

1. 与前端代码分离
2. 可生成随机数据

缺点：

1. 数据都是动态生成的假数据，无法真实模拟增删改查的情况
2. 只支持 ajax，不支持 fetch

(想要了解 ajax 和 fetch 区别的同学来点[我](https://zhuanlan.zhihu.com/p/24594294))

### 3. 接口管理工具

代表：[rap](https://github.com/thx/RAP), [swagger](https://swagger.io/),
[moco](https://github.com/dreamhead/moco), [yapi](https://github.com/YMFE/yapi)

优点：

1. 配置功能强大，接口管理与 Mock 一体，后端修改接口 Mock 也跟着更改，可靠

缺点：

1. 配置复杂，依赖后端，可能会出现后端不愿意出手，或者等配置完了，接口也开发出来了的情况。
2. 一般会作为大团队的基础建设而存在， 没有这个条件的话慎重考虑

### 4. 本地 node 服务器

代表：[json-server](https://github.com/typicode/json-server)
   配置json-server : json-server安装 npm i -g json-server
                     全局安装的json-server引入项目中  yarn add json-server -D 
                     配置json-server 
                        1. 根目录下新建文件夹 __json_server_mock_,
                        2.这个文件夹中新建 db.json文件
                        3. package.json 下的scripts下新增  "json-server": "json-server __json_server_mock_/db.json --watch"

优点：

1. 配置简单，json-server 甚至可以 0 代码 30 秒启动一个 REST API Server
2. 自定义程度高，一切尽在掌控中
3. 增删改查真实模拟

缺点：

1. 与接口管理工具相比，无法随着后端 API 的修改而自动修改

# 3. 用jsx列表渲染工程开发页面
1.Object.assign  Object.assign()是对象的静态方法，可以用来复制对象的可枚举属性到目标对象，利用这个特性可以实现对象属性的合并。
                 setParam(Object.assign({},param,{name:env.target.value}))
2.状态提升解决数据分享问题

# 4. 自定义 consumerHook
1. useDebounce减少搜索请求频率
  const debounce = (func , delay) => {
    let timeout;
    return (...param) => {
      if(timeout) {
        cleanTimeout(timeout);
      }
      timeout = setTimeout(function() {
        func(...param);
      },delay)
    }
  }
  const log = debounce(() => console.log('call),5000);
  log()
  log()
  log()
  timeout涉及到闭包，timeout
  执行流程：三个函数同步操作
            log()#1 : timeout#1
            log()#2 : 发现timeout#1，清除掉。timeout#2
            log()#3 : 发现timeout#2，清除掉。timeout#3
                    执行完setTimeout#3  5s后打印
 2. useEffect  return函数会在上一个useEffect处理完后执行上一个useEffect处理完后执行
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


# 5. 将js代码改写为ts
    1. 当ts代码中引入js库时，要安装ts相应库的补丁 ； yarn add @type/qs -D 安装相应库的ts说明文件
        js文件 + .d.ts文件  === ts文件
    2. // @ts-ignore 忽视ts报错
    3. //delay?: number 表示这个参数可以不传，或者只能传个number
    4. unknown不能赋值给任何类型的值，也不能在unknown类型值上读取该值没有的方法
    5. 泛型：是一种未知的数据类型，当我们不知道使用什么数据类型的时候，可以使用泛型
        避免了类型转换的麻烦，存储的是什么类型，取出的就是什么类型
        把运行期异常（代码运行之后会抛出的异常），提升到了编译期（写代码的时候就会报错了）
    6. 
        // let b:object; //对象涵盖范围很广 此时b就是个空对象
        // b =  {...()=>{}}
        // let a:{[key:string]:unknown}
        // a = () => {}

# 6. TS类型继承和鸭子类型
    interface Base {
      id:number
    }
    interface Advance extends Base {
      name : string
    }
    const test = (p:Base) => {

    }
    //继承
    const a: Advance = {id:10,name:'jack'}
    //并不会报错，因为TS为鸭子类型(duck typing) : 面向接口编程，而不是面向对象编程，
    //只要{id:10,name:'jack'}该对象中拥有test所需要的类型，就可以
    const a = {id:10,name:'jack'}
    test(a)
    2. 箭头函数后面不带括号默认返回
          //user => setUser(user)  =====  setUser
      /*
          const register = (form : AuthForm) => auth.register(form).then(setUser) 
          ====
          const register = (form : AuthForm) => {
              return auth.register(form).then(setUser)
          }
          !===
          const register = (form : AuthForm) => {
              auth.register(form).then(setUser)
          }    
      */
    3. 类型别名和interface
        b. 联合类型 
        let myFavoriteNumber : string | number
        let jackFavoriteNumber : string | number

        c.类型别名
        type FavoriteNumber = string | number
        let roseFavoriteNumber : FavoriteNumber

        d.类型别名和interface在很多情况下都可以互换
        type Person  = { name : string};
        interface Person1 {
            name : string
        }
        const xiaoming : Person = { name : 'xiaoming'}
        const xiaoming1 : Person1 = { name : 'xiaoming1'}

        //区别
        /*
            1. 定义联合类型  type FavoriteNumber = string | number
            2. 定义交叉类型  type FavoriteNumber = string & number
            3. 类似这种的只有类型别名可以
        */
        a. TS Utility Types ts工具类型 Parameters
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
      4. 实现
                type Person = {
                              name: string
                              age : number
                            }
                //Partial的实现  keyof代表取出T对象中所有的键，形成一个联合类型 ， P in keyof T 遍历T对象的所有的键 ?代表可选项
                type PersonKey = keyof Person ;
                // type Partial<T> = {
                //     [P in keyof T]?: T[P];
                // };
                //Omit的实现 ： 操作键值对    
                // Pick : 把T对象中name筛选出来  K extends keyof T ：K必须在T的键值集合中  in代表遍历
                type PersonOnlyName = Pick<Person , 'name'> 
                type Pick<T, K extends keyof T> = {
                    [P in K]: T[P];
                };
                // Exclude : 把联合类型PersonKey过滤掉name  操作联合类型 
                type Age = Exclude<PersonKey , 'name'>
                type Exclude<T, U> = T extends U ? never : T;
                //keyof T 拿出T对象中所有的键形成联合类型，过滤掉其中的K键。再从T对象中筛选出过滤后的属性 
                type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
# 7. useContext全局状态管理 封装http请求
    2. 在fetch api 中服务端返回的异常状态，fetch后面的catch并不会捕获该异常，只有在断网，网络异常才会抛出异常所以想要抛出异常，尽量在if(res.ok)判断中完成

# 8. 样式改变
    1. antd
    2. css-in-js 组织css的一种方式
    4. rem em  app.css
        /* rem em */
        /*em 相对于父元素的font-size*/
        /*rem 相对于根元素html的font-size, r就是root的意思*/
        /*浏览器默认16像素  16 * 62.5% = 10px*/
        /*1rem === 10px*/
      /*视口高度（100vh代表整个视口）viewport height === vh*/
    5. grid和flex应用场景
      1. 一维布局用flex  二维布局用grid
      2. flex： 从内容出发(现有一组内容，数量不固定，希望他们均匀分布在容器中，由内容大小自己决定占据空间的大小)  
         grid：  从布局出发(先规划网格，数量一般固定。然后将元素往里填充)
    6. 以svg渲染svg格式的图片（当成组件渲染，CreateReact给的方法）
      import {ReactComponent as SoftwareLogo} from "./assets/software-logo.svg";
      <SoftwareLogo width={'18rem'} color={'rgb(38 , 132 , 255)'}/>
# 9. 错误处理
                            // https://github.com/bvaughn/react-error-boundary
    1. react-error-boundary  
    未捕获错误得新行为：任何未被错误边界捕获的错误都将导致整个React组件树被卸载
          const value: any = undefined
        return <Container>
            {value.notExist}
    
# 10. 自定义文档标题
    1.react-helmet   React页面定义头部配置
    2.解决页面无限渲染的库  wht-did-you-render
    3.// 基本类型，可以放到依赖里；组件状态，可以放到依赖里；非组件状态的对象，绝不可以放到依赖里
      // https://codesandbox.io/s/keen-wave-tlz9s?file=/src/App.js 
      import React, { useEffect, useState } from "react";
      import "./styles.css";
      export default function App() {
        // 当obj是基本类型的时候，就不会无限循环
        // const obj = 1;
        // 当 obj是对象的时候，就会无限循环
        // const obj = {name: 'Jack'}
        // 当 obj是对象的state时，不会无限循环
        const [obj, setObj] = useState({ name: "Jack" });      
        const [num, setNum] = useState(0);

        useEffect(() => {
          console.log("effect");
          setNum(num + 1);
        }, [obj]);

        return (
          <div className="App">
            {num}
            <h1>Hello CodeSandbox</h1>
            <h2>Start editing to see some magic happen!</h2>
          </div>
        );
      }

  # 11. 自定义Select组件
        Select组件自身会把所传入的value值当成string，返回string,对一些number属性的值会造成潜在风险
        2. 组件props属性透传功能
            //解决自定义IdSelect上传入Select自身属性类型的兼容问题
              type SelectOptions = React.ComponentProps< typeof Select>  //得到Select自身的类型属性

# 12. React Hook 惰性初始化
    1. 当useState传入一个函数时，react默认以为要初始化，会直接执行该函数，而不会进行保存
      initialState 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略
      const [state, setState] = useState(() => {
          const initialState = someExpensiveComputation(props);  //someExpensiveComputation(props)一些消耗性能的操作
          return initialState;
        });
      // useState直接传入函数的含义是：惰性初始化；所以，要用useState保存函数，不能直接传入函数
     
    2.利用useState保存函数
      a. 可以传入双层函数  const [state, setState] = useState(()=>{()=>{const initialState = someExpensiveComputation(props);}})
      b. useRef 来保存 （useRef保存的值变化时，因为它不是组件状态，所以并不会引起组建的重新渲染）
       // https://codesandbox.io/s/blissful-water-230u4?file=/src/App.js
       export default function App() {
          const callbackRef = React.useRef(() => alert("init"));
          const callback = callbackRef.current;
          console.log(callback);
          return (
            <div className="App">
              // 点击这个button时，该函数执行， callbackRef.current也变化了，但因为其不是组件状态值，组件不会重新渲染，所以上面的
              //callback值不边
              <button onClick={() => (callbackRef.current = () => alert("updated"))}>
                setCallback
              </button>
              //打印出来依然是init
              <button onClick={callback}>call callback</button>
              //组件没有重新渲染，callbackRef.current的值不变
              <button onClick={callbackRef.current}>call callback</button>

              //强制从callbackRef里面吧current值读出来，会造成组件重新渲染
              <button onClick={() => { callbackRef.current() }}>call callback</button>

              <h1>Hello CodeSandbox</h1>
              <h2>Start editing to see some magic happen!</h2>
            </div>
          );
        }

# 13. useCallback(fun,[])  
        // []；依赖列表   只有当以来列表被改变时run函数才会被重新定义
        该函数一般用于，自定义的hook里的函数要返回出去，然后函数要在那个组件中执行，函数值改变要引起组件重新渲染。所以useEffect中必须引  入这个函数状态，但是因为该函数不是基本类型或者组件状态，每次调用该函数返回的都不是同一个函数，会造成无限循环问题
        使用useCallback时如果需要在该函数内改变state的值，且useCallback（fun , [state]） 也会造成无限循环 
            原来代码 ： setState({...state, stat:'loading'})
            解决办法 ： setState(prevState => ({...prevState, stat:'loading'}))

       useMemo()和useCallback())都能够起到缓存的作用  
       都是因为非基本非状态类型的依赖而存在  useMemo()针对于数据，useCallback()针对于函数
 
# 14. var let const 状态提升
var的状态提升
   console.log(a) ; var a = 1  ===  var a = undefined ; console.log(a) ;  a = 1

const的状态提升：const是有状态提升的，值放在了 temporal dead zone(暂时性死区) 这里
   console.log(b) ; const b = 1  // ReferenceError: Cannot access 'b' before initialization
   console.log(b) ;              // ReferenceError: b is not defined

# 15. 状态管理
      1. 状态提升 ： 将公共属性放在最外层组件身上，一个一个的通过props给下传  
                   问题： props drilling(多层传props)
                          定义和使用离得太远了(一个改，全都得改) 
      2. 组合组件：  component compostion  https://zh-hans.reactjs.org/docs/context.html
                      直接将该部分渲染的DOM传过去 解决了状态提升造成的耦合问题，在定义组件出修改即可 ,可以减少要传递props得数量
                    问题： 代码量没有发生改变
                          多层props传值
                          这种将逻辑提升到组件树的更高层次来处理，会使得这些高层组件变得更复杂
      3. redux ： 
# 16 .控制反转（Inversion of Control，缩写为IoC）
        是面向对象编程中的一种设计原则，可以用来减低计算机代码之间的耦合度。其中最常见的方式叫做依赖注入（Dependency Injection，简称DI）
        通过控制反转，对象在被创建的时候，由一个调控系统内所有对象的外界实体将其所依赖的对象的引用传递给它。也可以说，依赖被注入到对象中。

# 17 . useReducer和useState 
        useState 适合用于定义单个状态
        useReducer适合用于定义多个可以户型影响的状态

# 18 .redux  可预测的js状态容器
      发展史   https://www.notion.so/Hook-fd25471f129b4cde9d21b052624b5366
      可预测的  给相同的输入会得到相同的输出
