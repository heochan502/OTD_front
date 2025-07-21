import axios from 'axios';
axios.defaults.baseURL = '/api/OTD/';

export const join = (params) => {
  return axios.post('/user/signup', params).catch((e) => e.response);
};

export const login = (params) => {
  return axios.post('/user/login', params).catch((e) => e.response);
};

export const check = (params) => {
  return axios.get('/user/check', params).catch((e) => e.response);
};
export const logout = () => {
  return axios.post('/user/logout').catch((e) => e.response);
};
