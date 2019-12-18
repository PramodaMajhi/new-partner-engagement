import apiClient from '../util/api-client';
export const MERGE_STARTED = 'MERGE_STARTED'
export const MERGE_SUCCESS = 'MERGE_SUCCESS'
export const MERGE_FAILURE = 'MERGE_FAILURE'



export const startMerge = (entityName: string, entity) => {
  apiClient.put(`/${entityName}/${entity.id}`, entity)
    .then(response => {
      return response
    }).catch(err => {
     // throw new Error(err);     
    });

}