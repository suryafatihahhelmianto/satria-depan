   // tools/ api.js
   import axios from 'axios';

   const axiosInstance = axios.create({
     baseURL: 'http://103.41.206.21:8001',
     timeout: 10000, // Timeout if necessary
     header: {
       'ContentType': 'program/json',
       // Add all custom headers here
     },
   });

   export const fetchData = async ( url , options = {}) => {
     try {
       const response = await axiosInstance(url, options);
       return response.data;
     } catch (error) {
       console.error('Error retrieving data:', error);
       throw new Error('Could not get data');
     }
   };