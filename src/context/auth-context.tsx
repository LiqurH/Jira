import React, { ReactNode, useState } from "react";
import * as auth from "auth-provider";
import { http } from "utils/http";
import { useMount } from "utils";
import { User } from "types/user";
import { useAsync } from "utils/use-async";
import { FullPageErrorFallback, FullPageLoading } from "components/lib";
import { useQueryClient } from "react-query";

interface AuthForm {
  username: string;
  password: string;
}
//初始化user解决页内刷新跳出登录界面问题，获取user信息
const bootstrapUser = async () => {
  let user = null;
  //尝试在localstorage中尝试读取token
  const token = auth.getToken();
  if (token) {
    //有token值得话带着token值请求meAPI，其返回值包括user信息
    const data = await http("me", { token });
    user = data.user;
  }
  return user;
};

//创建一个 Context 对象。当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 Provider 中读取到当前的 context 值。
const AuthContext = React.createContext<
  | {
      user: User | null;
      register: (form: AuthForm) => Promise<void>;
      login: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
//React DevTools 使用该字符串来确定 context 要显示的内容。
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // const [user , setUser] = useState<User | null>(null);
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setData: setUser,
  } = useAsync<User | null>();
  // point free
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const queryClient = useQueryClient()
  const logout = () => auth.logout().then((user) => {
    setUser(null)
    queryClient.clear()  // 清空usequery获取的数据
  });

  // 处理异步请求bootstrapUser时得加载信息
  useMount(() => {
    //将得到得user信息赋值给全局状态user
    run(bootstrapUser());
  });

  // 主页面加载中返回Loading
  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }
  // 主页面出错返回出错页面
  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  return (
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  );
};

export const useAuth = () => {
  //useContext(MyContext) 相当于 class 组件中的 static contextType = MyContext
  //useContext(MyContext) 只是让你能够读取 context 的值以及订阅 context 的变化
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth必须在AuthProvider中使用");
  }
  return context;
};
