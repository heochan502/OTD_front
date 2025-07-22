import axios from 'axios';

axios.defaults.baseURL = 'api/OTD/';

export const save = (jsonBody) => {
  console.log('json', jsonBody);
  return axios.post('reminder', jsonBody).catch((e) => e.response);
};

export const modify = (jsonBody) => {
  return axios.put('reminder', jsonBody).catch((e) => e.response);
};

export const findById = (id) => {
  return axios.get(`reminder/${id}`).catch((e) => e.response);
};

export const deleteById = (id) => {
  return axios.get(`reminder/${id}`).catch((e) => e.response);
};

export const getByMonth = (year, month) => {
  return axios
    .get('reminder', { params: { year, month } })
    .catch((e) => e.response);
};
