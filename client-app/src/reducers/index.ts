import { combineReducers } from 'redux'
import { values } from './values'
import { entitiesData } from './entitiesReducer'
import { userReducer } from  './userReducer';

export default combineReducers({
    entitiesData,      
    values,      
    user: userReducer,
    
  })
