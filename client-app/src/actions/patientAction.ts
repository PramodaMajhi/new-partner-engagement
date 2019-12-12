import apiClient from '../util/api-client';
import { FETCH_PATIENTS, POST_PATIENTS, FETCH_PATIENT_BYID, PUT_PATIENT_PROFILE, FETCH_PATIENT_BY_PRVID } from './types';

export const fetchPatients = () =>
  (dispatch: any) => {
    apiClient.get('/patients?filter[order]=patientLastName ASC')
      .then(patients =>
        dispatch({ type: FETCH_PATIENTS, payload: patients.data })
      )

  }

export const fetchPatientbyID = (patientId) =>
  (dispatch: any) => {
    apiClient.get('/patients/' + patientId)
      .then(patientresponse =>
        dispatch({ type: FETCH_PATIENT_BYID, payload: patientresponse.data })
      )
  }

export const savePatientProfile = (pateintObj) => {
  return (dispatch) => {
    const promise = apiClient.patch(`/patients/${pateintObj.id}`, pateintObj)
      .then(post => {
        dispatch({ type: PUT_PATIENT_PROFILE, payload: post.data })
        return post.data.id
      })
    return promise
  }
}

