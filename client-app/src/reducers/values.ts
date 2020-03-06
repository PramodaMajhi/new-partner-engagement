import { SET_VALUES } from '../actions/values'
import {IValues, IOption} from '../store'

const init : IValues = {   
  searchVal: "",
    
}

export const values = (state : IValues = init, action) => {
  if (action.type === SET_VALUES) {
      const newState = {...state, ...action.values}
      return newState
  }
  return state
}