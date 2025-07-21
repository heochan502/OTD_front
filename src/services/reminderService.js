import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080/api/OTD/';

export const postReminder = (jsonBody) => {
  return axios.post('reminder/add', jsonBody).catch((e) => e.response);
};
