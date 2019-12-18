import apiClient from '../util/api-client';

export const INSERT_STARTED = 'INSERT_STARTED'
export const INSERT_SUCCESS = 'INSERT_SUCCESS'
export const INSERT_FAILURE = 'INSERT_FAILURE'


export const startInsert = (entityName: string, entity) => {
    return (dispatch) => {
      const  promise = apiClient.post(`/${entityName}`, JSON.stringify(entity))
      .then(res => {
        const response = res.data;
        dispatch({ type: INSERT_SUCCESS, entity, response})
        return response.id
      }).catch(error => {        
          dispatch({type: INSERT_FAILURE, entityName, entity, error})          
        })   
      return promise   
    }
  }