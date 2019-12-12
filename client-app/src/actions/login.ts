import apiClient from '../util/api-client';
import { ACCESS_TOKEN, LOGIN_FAILURE, LOGIN_SUCCESS } from './types';
export const login = (user: any) => {
  
  // Add time-to-live (in seconds) for accesstoken - 30 minutes
  user['ttl'] = 60*30 ; // process.env.REACT_APP_TTL_ACCESS_TOKEN ? parseInt(process.env.REACT_APP_TTL_ACCESS_TOKEN): 60*30;
  user.email = user.email.toLowerCase();  // email address case insensitive

  return (dispatch: any) => {
    const promise = apiClient.post('/appusers/login', JSON.stringify(user))   
    .then(token => {
      const data = token.data;
      if (data.error) {
        dispatch({ type: LOGIN_FAILURE, error: data.error});
        return;
      }
      const accessToken = data.id;
      const userId = data.userId;
      dispatch({ type: ACCESS_TOKEN, payload: accessToken});
      apiClient.get(`/appusers/${userId}`)     
        .then(sdmuser => {
          dispatch({ type: LOGIN_SUCCESS, payload: sdmuser.data});
        })
    }).catch(error => {
      dispatch({ type: LOGIN_FAILURE, error: error});
    })
  return promise
  }
}

/*
 * Steps:
 * 1. Finds the user by email
 * 2. Creates a token for found user account
 * 3. Returns the token and userId to the caller.
 */
export const getTokenByEmail = (email: string, tokenCBFn) => {
  const userByEmailUser = `/api/appusers?filter[where][email]=${email}`;
  const getAccessTokenUrl = (userId) => {
    return `/api/appusers/${userId}/accessTokens`;
  }

  const tokenInfo = {};

  apiClient.request({
    method: 'GET',
    url: userByEmailUser
  })
  .then(userResp => {
      if(userResp.status === 200 && userResp.data && userResp.data.length){
        const user = userResp.data[0];
        tokenInfo['userId'] = user.id;

        // create new access token
        apiClient.request({
          method: 'POST',
          url: getAccessTokenUrl(user.id)
        }).then(tokenResp => {
          if(tokenResp.status === 200 && tokenResp.data){
            const token = tokenResp.data;
            tokenInfo['token'] = token.id;
            tokenInfo['status'] = true;
          }else{
            throw new Error("Failed to invoke get token API for " + email)
          }

          if(tokenCBFn){
            tokenCBFn(tokenInfo)
          }

        }).catch(err => { 
            if(tokenCBFn){
              tokenCBFn(tokenInfo)
            }
          });
      }else{
        if(tokenCBFn){
          tokenCBFn(tokenInfo)
        }
      }
  }).catch(err => { 
    if(tokenCBFn){
      tokenCBFn(tokenInfo)
    }
  });

  return tokenInfo;
}

export const getUserByIdWithToken = (userInfo, userCBFn) => {
  const userByIdUrl = `/api/appusers/${userInfo.id}?access_token=${userInfo.accessToken}`;
  let userAcct = {};

  apiClient.request({
    method: 'GET',
    url: userByIdUrl
  }).then(userResp => {
    if(userResp.status === 200 && userResp.data){
      const user = userResp.data;
      userAcct = user;
      if(userCBFn){
        userCBFn(userAcct);
      }
    }else{
      if(userCBFn){
        userCBFn(userAcct)
      }
    }
  }).catch(err => { 
    if(userCBFn){
      userCBFn(userAcct)
    }
  });

  return userAcct;
}

export const getUserByToken = (userInfo, userCBFn) => {
  const userTokenByTokenUrl = `/api/appusers/${userInfo.id}/accessTokens?access_token=${userInfo.accessToken}`;
  const userByIdUrl = `/api/appusers/${userInfo.id}?access_token=${userInfo.accessToken}`;
  let userAcct = {};

  apiClient.request({
    method: 'GET',
    url: userTokenByTokenUrl
  })
  .then(userTokenResp => {
      if(userTokenResp.status === 200 && userTokenResp.data && userTokenResp.data.length){
        const userToken = userTokenResp.data[0];
        userAcct['userId'] = userToken.userId;
        apiClient.request({
          method: 'GET',
          url: userByIdUrl
        }).then(userResp => {
          if(userResp.status === 200 && userResp.data && userResp.data.length){
            const user = userResp.data[0];
            userAcct = user;
            if(userCBFn){
              userCBFn(userAcct);
            }
          }else{
            if(userCBFn){
              userCBFn(userAcct)
            }
          }
        })
      }else{
        if(userCBFn){
          userCBFn(userAcct)
        }
      }
  }).catch(err => { 
    if(userCBFn){
      userCBFn(userAcct)
    }
  });

  return userAcct;
}