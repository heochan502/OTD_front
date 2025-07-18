import axios from 'axios';
axios.defaults.baseURL = '/api/OTD/user';


export const join = params => {
    return axios.post('/signup', params).catch(e => e.response);
}

export const login = params => {
    return axios.post('/login', params).catch(e => e.response);
}

export const check = params => {
    return axios.get('/check', params).catch(e => e.response);
}