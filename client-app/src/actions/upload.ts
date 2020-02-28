import apiClient from '../util/api-client';
import { IFile } from '../models/types'
import { getError } from '../utils'
import * as rest from '../api/rest'

export const UPLOAD_BATCH_STARTED  = 'UPLOAD_BATCH_STARTED'
export const UPLOAD_FILE_PROGRESS = 'UPLOAD_FILE_PROGRESS'
export const UPLOAD_FILE_SUCCESS  = 'UPLOAD_FILE_SUCCESS'
export const UPLOAD_FILE_FAILURE  = 'UPLOAD_FILE_FAILURE'
export const UPLOAD_BATCH_COMPLETE = 'UPLOAD_BATCH_COMPLETE'

export const startUpload = (container: string, files: any) => {
  return (dispatch) => {

    // Even if there are no files, this will empty the list of files in store.upload.
    // The promise chain below will be empty, resulting in dispatch of UPLOAD_BATCH_COMPLETE.
    dispatch({type: UPLOAD_BATCH_STARTED, id: container, files})

    // Testing indicates we cannot attach the files in parallel (409 conflict).
    // So we do it sequentially. Even if a file upload fails, the following ones will continue.

    let getProgressCallback = (file) => {
      return (percent) => {
        dispatch({type: UPLOAD_FILE_PROGRESS, file, percent})
      }
    }

    let upload = (file:any, fd:any) => {      
    
      var promise = rest.upload(container, file,fd, getProgressCallback(file))
        .then(r => {          
            dispatch({type: UPLOAD_FILE_SUCCESS, file})
        })
        .catch(error => {
          let errorText = getError(error)        
          console.log(`startUpload: Upload for files failed with ${errorText}`)
          dispatch({type: UPLOAD_FILE_FAILURE, file, error: errorText})
        })
      return promise
    }

    // Chain the promises. Note that a Promise begins to execute as soon as it is created,
    // so it is important not to create the next promise until the previous promise has finished.
    // The call to the upload function actually creates the Promise.

    var promise = Promise.resolve()
    for (let file of files) {   
      const fd = new FormData();
      fd.append('file', file);  
      promise = promise.then(r => upload(file, fd))
    }

    promise = promise.then(r => {
      dispatch({type: UPLOAD_BATCH_COMPLETE})
    })

    // there is no catch here because each upload can succeed or fail and the next will begin.
    // the status of each upload is represented within the store

    return promise    
  }


}
