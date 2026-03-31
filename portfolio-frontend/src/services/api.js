import axios from 'axios';

const api = axios.create({
    baseURL: 'http://claradbessa-dev.test', 
    withCredentials: true, 
    headers: {
        'Accept': 'application/json',
    }
});

export default api;