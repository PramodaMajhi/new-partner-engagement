import apiClient from '../util/api-client';

export const INSERT_STARTED = 'INSERT_STARTED'
export const INSERT_SUCCESS = 'INSERT_SUCCESS'
export const INSERT_FAILURE = 'INSERT_FAILURE'
export const FOLDER_CREATED = 'FOLDER_CREATED'
export const FOLDER_CREATED_ERROR = 'FOLDER_CREATED_ERROR'


export const startInsert = (entityName: string, entity) => {
  return (dispatch) => {
    const promise = apiClient.post(`/${entityName}`, JSON.stringify(entity))
      .then(res => {
        const response = res.data;
        dispatch({ type: INSERT_SUCCESS, entity, response })
        return response.id
      }).catch(error => {
        dispatch({ type: INSERT_FAILURE, entityName, entity, error })
      })
    return promise
  }
}


export const createAttachment = (entityName: string, entity) => {
  return (dispatch) => {
    const promise = apiClient.post(`/${entityName}`, JSON.stringify(entity))
      .then(res => {
        dispatch({ type: FOLDER_CREATED, entity, res })
        return res
      }).catch(error => {
        dispatch({ type: FOLDER_CREATED_ERROR, entityName, entity, error })
      })
    return promise
  }
}