import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers';

// this is not stored in entities, but in values.currentUser
import * as currentUserModel from './models/currentUser'

const initialState = {};

const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware)      
    )
  );
  
  export default store;

  export interface IOption {
    value: number,
    label: string,
    disabled?: boolean
}
  export interface IValues {   
    // current user
    currentUser?: currentUserModel.CurrentUser,
   // current value in the searchBar
    searchVal?: String,
    
  }