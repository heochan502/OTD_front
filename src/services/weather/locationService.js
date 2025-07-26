import axios from 'axios';
axios.defaults.baseURL = '/api/OTD';

export const saveLocation = (localId) => {
  return axios.post('/location/save', { localId }).catch((e) => e.response);
};

export const getLocalName = (keyword) => {
  return axios
    .get('/location/search', { params: { keyword } })
    .catch((e) => e.response);
};

export const getLocalList = () => {
  return axios.get('/location').catch((e) => e.response);
};
