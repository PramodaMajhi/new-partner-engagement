import { ACCESS_TOKEN, LOGIN_FAILURE, LOGIN_SUCCESS, LOGOUT} from '../actions/types';

const initialState = {
    currentUser: {},
    accessToken: ''
}

export const userReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ACCESS_TOKEN:
      return {
        ...state, accessToken: action.payload
      }
    case LOGIN_FAILURE:
      return {
        ...state, currentUser: { error: action.error }
      }
      case LOGIN_SUCCESS:
      return {
        ...state, currentUser: action.payload
      }    
      case LOGOUT:
      return {
        ...state, currentUser: { }
      }
    default:
      return state;
  }
}

