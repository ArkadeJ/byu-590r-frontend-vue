// MAKE SURE TO CHANGE ENDPOINT
let API_URL = 'https://ktj-590r-backend.herokuapp.com/api/';
if (import.meta.env.MODE === 'development') {
    API_URL = 'http://127.0.0.1:8000/api/';
}
export default API_URL;