// MAKE SURE TO CHANGE ENDPOINT
let API_URL = 'https://git.heroku.com/ktj-byu-590r-backend-php.git/api';
if (import.meta.env.MODE === 'development') {
    API_URL = 'http://127.0.0.1:8000/api/';
}
export default API_URL;