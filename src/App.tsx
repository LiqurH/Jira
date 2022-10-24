import React from "react";
import { useAuth } from 'context/auth-context';
import './App.css';
import {ErrorBoundary}from "components/error-boundary";
import { FullPageErrorFallback, FullPageLoading } from "components/lib";

// import { AuthenticatedApp } from 'authenticated-app';
// import { UnauthenticatedApp } from 'unauthenticated-app';
// 需要该组件默认暴露
const AuthenticatedApp = React.lazy(() => import("authenticated-app"))
const UnauthenticatedApp = React.lazy(() => import("unauthenticated-app"))

function App() { 
  const { user } = useAuth()
  return (
    <div className="App">
      <ErrorBoundary fallbackRender={FullPageErrorFallback}>
          <React.Suspense fallback={<FullPageLoading/>}>
            {/* user有值得话就会加载AuthenticatedApp页面 */}
            { user ? <AuthenticatedApp/> : <UnauthenticatedApp/>}
          </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;