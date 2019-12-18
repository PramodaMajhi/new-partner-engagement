import apiClient from '../util/api-client';

export const GET_STARTED = 'GET_STARTED'
export const GET_SUCCESS = 'GET_SUCCESS'
export const GET_FAILURE = 'GET_FAILURE'


export const startGet = (entityName: string, filter?: object, replace=true) => {
  return (dispatch: any) => {
    dispatch({type: GET_STARTED, entityName})
    let endpoint = `/${entityName}`    
    apiClient.get(endpoint)      
    .then(res => {
      const response = res.data;
      dispatch({ type: GET_SUCCESS, entityName, response, replace })        
    }).catch(error => {
      dispatch({type: GET_FAILURE, entityName, error})
    })
    }
  }

