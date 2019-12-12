import axios from 'axios';

const apiClient = () => {
  const defaultOptions = {
    baseURL: process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:3001/api',
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