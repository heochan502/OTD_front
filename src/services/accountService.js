import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080/api/OTD/user';


export const join = params => {
    return axios.post('/api/OTD/user/signup', params).catch(e => e.response);
}
