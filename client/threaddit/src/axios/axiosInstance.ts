import axios from 'axios'

 export const axiosInstance = axios.create({
    baseURL: 'http://localhost:9000/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
})