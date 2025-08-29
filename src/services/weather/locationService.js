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

export const selectLocation = (localId) => {
  return axios.put('/location/select', { localId });
};

export const removeLocation = (localId) => {
  return axios.delete(`/location/delete/${localId}`).catch((e) => e.response);
};

export const searchApi = (keyword) => {
  return axios
    .get('/location/search-api', { params: { keyword } })
    .catch((e) => e.response);
};
