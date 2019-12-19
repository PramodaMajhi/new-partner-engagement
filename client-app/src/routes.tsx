import { Route, Switch } from 'react-router'
import * as React from 'react'
import { NotFound } from './components/NotFound'
import { Login } from './components/login/Login';
import {SearchBarDisp} from './components/search/SearchBarDisp'
import {VendorDetails} from './components/search/VendorDetails'




export const Routes = () =>
  (
    <div>
      {/* <Navigation/> */}
      <Switch>
        <Route exact path="/" component={SearchBarDisp} />
        <Route exact path="/login" component={Login} />   
        <Route exact path="/vendor-details/:vid" component={VendorDetails} />        
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  )
