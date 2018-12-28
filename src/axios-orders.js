import axios from 'axios';

const instance = axios.create ({
    baseURL: 'https://react-db-de6e9.firebaseio.com/'
});



export default instance;