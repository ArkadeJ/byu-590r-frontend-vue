import booksService from "../services/books.service";

const initialState = { booksList: [] };

export const books = {
    namespaced: true,
    state: initialState,
    actions: {
        getBooks({ commit }) {
            return booksService.getBooks().then(
                books => {
                    commit('setBooks', books);
                    return Promise.resolve(books);
                }
            );
        },
        returnBook({ commit, getters }, book) {
            return booksService.returnBook(book).then(
                response => {
                    response.book.index = getters.getBookStateIndexByBookID(response.book.id);
                    commit('setBookCheckedQty', response.book);
                    return Promise.resolve(response.book);
                }
            )
        },
        checkoutBook({ commit, getters }, book) {
            return booksService.checkoutBook(book).then(
                response => {
                    response.book.index = getters.getBookStateIndexByBookID(response.book.id);
                    commit('setBookCheckedQty', response.book);
                    return Promise.resolve(response.book);
                }
            );
        },
        createBook({ commit }, book) {
            return booksService.createBook(book).then(
                response => {
                    commit('addBook', response.book);
                    return Promise.resolve(response.book);
                }
            );
        },
        updateBook({ commit, getters }, book) {
            console.log('books module updateBook()')
            return booksService.updateBook(book).then(
                response => {
                    response.book.index = getters.getBookStateIndexByBookID(response.book.id);
                    commit('setBook', response.book);
                    return Promise.resolve(response.book);
                }
            );
        },
        deleteBook({ commit, getters }, book) {
            return booksService.deleteBook(book).then(
                response => {
                    response.book.index = getters.getBookStateIndexByBookID(response.book.id);
                    commit('removeBook', response.book);
                    return Promise.resolve(response.data);
                }
            );
        },
        updateBookPicture({ commit, getters }, book) {
            return booksService.updateBookPicture(book).then(
                response => {
                    response.book.index = getters.getBookStateIndexByBookID(response.book.id);
                    commit('updateBookPicture', response.book);
                    return Promise.resolve(response.data);
                }
            );
        }
    },
    mutations: {
        setBooks(state, books) {
            state.booksList = books.map(book => {
                book.available_qty = book.inventory_total_qty - book.checked_qty;
                return book;
            });
        },
        setBookCheckedQty(state, book) {
            state.booksList[book.index].checked_qty = book.checked_qty;
            state.booksList[book.index].available_qty = book.inventory_total_qty - book.checked_qty;
        },
        addBook(state, book) {
            book.available_qty = book.inventory_total_qty - book.checked_qty;
            state.booksList.push(book);
        },
        setBook(state, book) {
            state.booksList[book.index] = book;
        },
        removeBook(state, book) {
            state.booksList.splice(book.index + 1, 1);
        },
        updateBookPicture(state, book) {
            state.booksList[book.index].file = book.file;
        }
    },
    getters: {
        getBookStateIndexByBookID: state => (bookID) => {
            return state.booksList.findIndex(book => {
                return book.id === bookID;
            })
        }
    }
} 