import apiClient from '../util/api-client';
import { LOGOUT, ACCESS_TOKEN } from './types';
export const logout = (accessToken, cb:any = null) => {
  return (dispatch) => {
    const promise = apiClient.post('/appusers/logout')
    .then(response => {
      dispatch({ type: LOGOUT, payload: null });
      if (response.data.error) {
        return;
      }

      if(cb){
        cb();
      }
    }).catch(error => {
      throw new Error(error);
    })
    return promise
  }
}

export const updateTTL = () => {
  const accessToken = JSON.parse(localStorage.getItem("accessToken") || '{}')
  const userInfo = JSON.parse(localStorage.getItem("loggedinUser") || '{}');
  const data = {
      ttl: 1800,
      userId: userInfo.id,
      created: new Date()
  };

  const accessTokenUrl = `/appusers/${userInfo.id}/accessTokens/${accessToken}`;
  apiClient.request({
      method: 'PUT',
      url: accessTokenUrl,
      data: data
  }).then(res => {
      return;
  })
}