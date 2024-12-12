import axios from 'axios';

const apiClient = axios.create({
  headers: {
    'Authorization': 'Bearer C4D5C577E9914C4B9C9BF46DF9914A28'
  }
});

export default apiClient;
