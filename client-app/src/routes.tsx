import { Route, Switch } from 'react-router'
import * as React from 'react'
import { NotFound } from './components/NotFound'
import { Login } from './components/login/Login';
import {SearchBarDisp} from './components/search/SearchBarDisp'
import {VendorDetails} from './components/search/VendorDetails'
import  {NavBar}  from './components/shared/NavBar'



export const Routes = () =>
  (
    <div>
       {<NavBar/>}
      <Switch>
        <Route exact path="/" component={Login} />       
        <Route exact path="/login" component={Login} />   
         <Route exact path="/search" component={SearchBarDisp} />
        <Route exact path="/vendor-details/:vid" component={VendorDetails} />        
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  )
