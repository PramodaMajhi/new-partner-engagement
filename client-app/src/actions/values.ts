import * as storeModel from '../store'

export const SET_VALUES = 'SET_VALUES'

export const setValues = (values: storeModel.IValues) => ({
  type: SET_VALUES,
  values
})