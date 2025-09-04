import axios from 'axios';
axios.defaults.baseURL = '/api/OTD';

export const searchApi = (keyword) => {
  return axios
    .get('/location/search', { params: { keyword } })
    .catch((e) => e.response);
};

export const postAddress = (address) => {
  return axios.post('/location/post', address).catch((e) => e.response);
};

export const getList = () => {
  return axios.get('/location/list').catch((e) => e.response);
};

export const removeListItem = (id) => {
  return axios.delete(`/location/delete/${id}`).catch((e) => e.response);
};

export const selectLocation = (id) => {
  return axios.put(`location/select/${id}`).catch((e) => e.response);
};

export const modifyTitle = (json) => {
  return axios.put('location/edit', json).catch((e) => e.response);
};
