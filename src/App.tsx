import React, { useEffect, useState } from 'react';
import IndexDocument from "./document/index"
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Profile from "./Profile"
import Menu from "./Menu"
import { claim } from './auth/auth.models';
import AuthenticationContext from './auth/AuthenticationContext';
import AdminIndex from './admin';
import Authorized from './auth/Authorized';
import Register from './auth/Register';
import Login from './auth/Login';
import { getClaims } from './auth/handleJWT';
import configureInterceptor from './utils/httpInterceptors';
import IndexUsers from './admin/IndexUsers';
import Home from './landingPage/index';


configureInterceptor();

function App() {
  const [claims, setClaims] = useState<claim[]>([ ]);

  useEffect(() => {
    setClaims(getClaims())
  }, [])
 
 function isAdmin(){
  return claims.findIndex(claim => claim.name === 'role' && claim.value === 'admin') > -1;
}
  return (
    <BrowserRouter>
    <AuthenticationContext.Provider value={{ claims, update: setClaims }}>
      <Menu/>
    <Switch>
    <Route  path="/" exact><Home/></Route>
    <Route  path="/home" exact><IndexDocument/></Route>
    <Route  path="/register" exact><Register/></Route>
    <Route  path="/login" exact><Login/></Route>
    <Route  path="/profile" exact><Profile/></Route>
    {!isAdmin() ?<>u are not allowed to see this page</>:<>
    <Route  path="/users" exact><IndexUsers/></Route>
    <Route  path="/document" exact><AdminIndex/></Route>
    </>
    }
    
    
    </Switch>
    </AuthenticationContext.Provider>
    </BrowserRouter>
  );
}

export default App;
