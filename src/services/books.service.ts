import axios from 'axios';
import authHeader from './auth-headers';
import API_URL from './env';

class BooksService {
    getBooks() {
        return axios.get(API_URL + 'books', { headers: authHeader() })
            .then(response => {
                return response.data.results;
            })
    }

    returnBook(book) {
        return axios.patch(API_URL + 'books/' + book.id + '/return', {}, { headers: authHeader() })
            .then(response => {
                return response.data.results;
            })
    }

    checkoutBook(book) {

        let formData = new FormData();
        formData.append('due_date', book.due_date);
        return axios.post(API_URL + 'books/' + book.id + '/checkout', formData, { headers: authHeader() })
            .then(response => {
                return response.data.results;
            })
    }

    createBook(book) {
        let formData = new FormData();
        formData.append('file', book.file);
        formData.append('name', book.name);
        formData.append('description', book.description);
        console.log(book.name); //delete after debug
        formData.append('inventory_total_qty', book.inventory_total_qty);
        return axios.post(API_URL + 'books', formData, { headers: authHeader('multipart') })
            .then(response => {
                return response.data.results;
            })
    }

    updateBook(book) {
        return axios.put(API_URL + 'books/' + book.id, book, { headers: authHeader() })
            .then(response => {
                return response.data.results;
            })
    }

    deleteBook(book) {
        return axios.delete(API_URL + 'books/' + book.id, { headers: authHeader() })
            .then(response => {
                return response.data.results;
            });
    }

    updateBookPicture(book) {
        let formData = new FormData();
        formData.append('file', book.file);
        return axios.post(API_URL + 'books/' + book.id + '/update_book_picture', formData, { headers: authHeader() })
            .then(response => {
                return response.data.results;
            })
    }

}

export default new BooksService();