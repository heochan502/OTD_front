import axios from 'axios';
axios.defaults.baseURL = '/api/OTD';

export const getLocalName = (keyword) => {
  return axios
    .get('/location/search', { params: { keyword } })
    .catch((e) => e.response);
};
