import {
  UPLOAD_BATCH_STARTED,
  UPLOAD_FILE_PROGRESS,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_FAILURE,
  UPLOAD_BATCH_COMPLETE
} from "../actions/upload"

import { IFile } from '../models/types'


const init = { id: 0, files: new Map(), complete: false }

export const upload = (state = init, action) => {

  switch (action.type) {

    case UPLOAD_BATCH_STARTED:
      {
        let { id } = action
        // this clears all previous upload data, and enables us to track progress by file
        let files = new Map()
        for (let file of action.files) {
          // each file has a complete boolean, so we can ignore FILE_PROGRESS after complete is set
          files.set(file.name, { name: file.name, percent: 0, complete: false, error: null })
        }
        return ({ id, files, complete: false })
      }
    case UPLOAD_FILE_PROGRESS:
      // represents progress for a single file. Ignore if complete is true, or progress is somehow lower than existing progress
      {
        let file: IFile = action.file
        let files = state.files
        let f = files.get(file.name)
        if (f.complete || (action.percent < f.percent)) {
          return state
        }
        files.set(file.name, { name: file.name, })
        let newState = { ...state, ...{ files } }
        return newState
      }
    case UPLOAD_FILE_SUCCESS:
      // represents success for a single file
      {
        let file: IFile = action.file
        let files = state.files

        let f = files.get(file.name)
        files.set(file.name, { name: file.name, percent: 100, complete: true, error: null })
        let newState = { ...state, ...{ files } }
        return newState
      }
    case UPLOAD_FILE_FAILURE:
      // represents failure for a single file
      {
        let file: IFile = action.file
        let error: string = action.error
        let files = state.files
        files.set(file.name, { name: file.name, percent: 0, complete: false, error })
        let newState = { ...state, ...{ files } }
        return newState
      }
    case UPLOAD_BATCH_COMPLETE:
      // all files are complete, regardless of success or failure
      {
        let newState = { ...state, ...{ complete: true } }
        return newState
      }
  }
  return state
}