import { combineReducers } from 'redux'
import { values } from './values'
import { entitiesData } from './entitiesReducer'
import { userReducer } from  './userReducer';
import { upload } from './upload'

export default combineReducers({
    entitiesData,     
    upload, 
    values,      
    user: userReducer,
    
  })
