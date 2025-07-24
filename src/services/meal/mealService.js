import axios from 'axios';

axios.defaults.baseURL = 'api/OTD/';



export const getItems = (item) => {
    return axios.post('/meal', item).catch((e) => e.response);
  };