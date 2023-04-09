import { mapState } from 'vuex';
import { useDisplay } from 'vuetify/lib/framework.mjs';

export default {
    name: 'BooksView',
    computed: {
        ...mapState({
            books() {
                return this.$store.state.books.booksList;
            }
        })
    },
    setup() {
        // Destructure only the keys we want to use
        const { xs, mdAndUp } = useDisplay()

        return { xs, mdAndUp }
    },
    data: function () {
        return {


            //Form Data Holders
            checkedOutBook: null,
            editBook: {},
            selectedDeleteBook: null,
            newBook: {
                name: '',
                description: '',
                inventory_total_qty: 1,
                file: '',
            },

            //Messages
            editBookErrorMessage: null,
            newBookErrorMessage: null,

            //Dialogs
            createBookDialog: false,
            deleteBookDialog: false,
            editBookDialog: false,

            //Toggle Buttons
            editFileChangeDialogBtn: false,

            //Loaders
            bookIsUpdating: false,
            bookIsDeleting: false,
            bookIsCreating: false,

            //Due Date
            dueDate: '',



        }
    },
    created() {
        this.getBooks();
    },
    methods: {
        checkoutBook() {
            this.checkedOutBook.due_date = this.dueDate;
            this.$store.dispatch("books/checkoutBook", this.checkedOutBook)
                .finally(() => {
                    this.checkedOutBook = null;
                });
        },
        returnBook(book) {
            this.$store.dispatch("books/returnBook", book)
                .then(() => {
                    this.checkedOutBook = null;
                });
        },
        getBooks() {
            this.$store.dispatch("books/getBooks")
                .then((results) => {
                    console.log(results);
                });
        },
        openDeleteBookDialog(book) {
            this.selectedDeleteBook = book;
            this.deleteBookDialog = true;
        },
        openEditBookDialog(book) {
            this.editBook = book;
            this.editBookDialog = true;
        },
        openCreateDialog() {
            this.newBook = {
                name: '',
                description: '',
                inventory_total_qty: 1,
                file: ''

            };
            this.createBookDialog = true;
        },
        closeCreateDialog() {
            this.newBook = {
                name: '',
                description: '',
                inventory_total_qty: 1,
                file: '',

            };
            this.createBookDialog = false;
        },
        closeEditDialog() {
            this.editBookDialog = false;
        },
        closeDeleteDialog() {
            this.deleteBookDialog = false;
        },
        createBook() {
            this.bookIsCreating = true;
            this.newBookErrorMessage = null;
            this.$store.dispatch("books/createBook", this.newBook)
                .then(() => {
                    this.closeCreateDialog();
                    this.bookIsCreating = false;
                })
                .catch((error) => {
                    this.newBookErrorMessage = error.response.data.results;
                    this.bookIsCreating = false;
                })
        },
        onExistingBookPictureChange(e) {
            var image = e.target.files || e.dataTransfer.files;
            if (!image.length)
                return;

            this.editBook.file = image[0];
            this.bookIsUpdating = true;
            this.$store.dispatch("books/updateBookPicture", this.editBook)
                .then(() => {
                    this.bookIsUpdating = false;
                })
                .catch((error) => {
                    this.editBookErrorMessage = error.response.data.results;
                    this.bookIsUpdating = false;
                })
        },
        onNewBookFileChange(e) {

            this.newBook.file = null;
            var image = e.target.files || e.dataTransfer.files;

            if (!image.length)
                return;

            this.newBook.file = image[0];
        },

        updateBook() {
            console.log('view.ts updateBook()')
            this.bookIsUpdating = true;
            this.editBookErrorMessage = null;
            this.$store.dispatch("books/updateBook", this.editBook)
                .then(() => {
                    this.closeEditDialog();
                    this.bookIsUpdating = false;
                })
                .catch((error) => {
                    this.editBookErrorMessage = error.response.data.results;
                    this.bookIsUpdating = false;
                })

        },

        deleteBook() {
            this.bookIsDeleting = true;
            this.editBookErrorMessage = null;
            this.$store.dispatch("books/deleteBook", this.selectedDeleteBook)
                .then(() => {
                    this.closeDeleteDialog();
                    this.bookIsDeleting = false;
                })
        },

    }
} 