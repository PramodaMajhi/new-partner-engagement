import axios from 'axios';
import { CONF } from '../conf'

const apiClient = () => {
  const defaultOptions = {
    baseURL: CONF.APP_API_URL.API_URL,
    headers: {
        'Content-Type': 'application/json',
      }  
  };

  // Create instance
  let instance = axios.create(defaultOptions);

  // Set the AUTH token for any request
  instance.interceptors.request.use(function (config) {
    const accessToken = JSON.parse(localStorage.getItem("accessToken"))
    config.headers.Authorization =  accessToken ? `${accessToken}` : '';
    return config;
  });

  return instance;
};

export default apiClient();