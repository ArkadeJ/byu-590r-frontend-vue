import axios from 'axios';
import authHeader from './auth-headers';
import API_URL from './env';

class FishesService {
    getFishes() {
        return axios.get(API_URL + 'fishes', { headers: authHeader() })
            .then(response => {
                return response.data.results;
            })
    }

    getRods() {
        return axios.get(API_URL + 'rods', { headers: authHeader() })
            .then(response => {
                return response.data.results;
            })
    }

    getFlies() {
        return axios.get(API_URL + 'flies', { headers: authHeader() })
            .then(response => {
                return response.data.results;
            })
    }


 
    createFish(fish) {
        let formData = new FormData();
        formData.append('file', fish.file);
        formData.append('species', fish.species);
        formData.append('location', fish.location);
        formData.append('rod_id', fish.rod_id);
        formData.append('flies[]', fish.flies);
        return axios.post(API_URL + 'fishes', formData, { headers: authHeader('multipart') })
            .then(response => {
                return response.data.results;
            })
    }
 
    updateFish(fish) {
        return axios.put(API_URL + 'fishes/' + fish.id, fish, { headers: authHeader() })
            .then(response => {
                return response.data.results;
            })
    }

    deleteFish(fish) {
        return axios.delete(API_URL + 'fishes/' + fish.id, { headers: authHeader() })
            .then(response => {
                return response.data.results;
            });
    }

    updateFishPicture(fish) {
        let formData = new FormData();
        formData.append('file', fish.file);
        return axios.post(API_URL + 'fishes/' + fish.id + '/update_fish_picture', formData, { headers: authHeader() })
            .then(response => {
                return response.data.results;
            })
    }

}

export default new FishesService();