import axios from 'axios';

axios.defaults.withCredentials = true;

axios.defaults.baseURL = '/api/otd';

export const join = (params) => {
  return axios.post('/user/signup', params).catch((e) => e.response);
};

export const login = (params) => {
  return axios.post('/user/login', params).catch((e) => e.response);
};

export const check = () => {
    return axios.get('/user/check').catch(e => e.response);
}
export const logout = () => {
    return axios.post('/user/logout').catch(e => e.response);
}

export const getProfile = () => {
  return axios.get('/user/profile').catch((e) => e.response);
};
