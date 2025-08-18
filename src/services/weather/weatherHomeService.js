import axios from 'axios';
axios.defaults.baseURL = '/api/OTD';

export const getWeather = () => {
  return axios.get('/weather').catch((e) => e.response);
};

export const getNickName = () => {
  return axios.get('/weather/info').catch((e) => e.response);
};

export const getSrtFcst = () => {
  return axios.get('/weather/fcst').catch((e) => e.response);
};
