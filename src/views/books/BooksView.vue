<template>
    <v-row>
        <v-col cols="12">
            <v-btn block color="green" @click="openCreateDialog" prepend-icon="mdi-plus">Create</v-btn>
        </v-col>
    </v-row>

    <v-row>
        <v-col v-for="book in books" :key="book" class="d-flex child-flex" cols="12" sm="6" md="5" lg="4" xl="3" xxl="2">
            <v-card>
                <v-card-item>
                    <v-card-title>
                        <v-row>
                            <v-col cols="8">
                                {{ book.name }}
                            </v-col>
                            <v-col cols="4">
                                <div class="d-flex justify-space-between">
                                    <v-btn round @click="openEditBookDialog(book)" icon="mdi-pencil" color="warning"
                                        size="small"></v-btn>
                                    <v-btn round @click="openDeleteBookDialog(book)" icon="mdi-delete" color="error"
                                        size="small"></v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-title>

                    <v-card-subtitle>{{ book.description }}</v-card-subtitle>

                    <v-card-item>
                        <v-img :class="{ 'pa-4 text-center rounded-0': true, 'checked-out-image': book.available_qty <= 0 }"
                            width="300" height="400" :src="book.file"></v-img>
                    </v-card-item>


                    <v-card-text>
                        <h3 v-if="book.available_qty <= 0" class="checked-out-label">
                            All Checked Out - Out of Inventory
                        </h3>
                        <h3 v-else>
                            Stock: {{ book.available_qty }} / {{ book.inventory_total_qty }} Available
                        </h3>
                    </v-card-text>

                    <v-card-actions>
                        <v-row>
                            <v-col cols="12">
                                <div class="d-flex justify-space-between">

                                    <v-btn color="success" :disabled="books.checked_qty >= book.inventory_total_qty"
                                        @click="checkedOutBook = book">Checkout</v-btn>
                                    <v-btn rounded color="primary" v-if="book.checked_qty > 0"
                                        :disabled="book.checked_qty <= 0" @click="returnBook(book)">Return</v-btn>
                                </div>
                            </v-col>
                        </v-row>

                    </v-card-actions>


                </v-card-item>
            </v-card>
        </v-col>
    </v-row>

    <v-dialog v-model="checkedOutBook" width="auto">
        <v-card>
            <v-card-text>
                Are you sure you wish to check out this book?
            </v-card-text>
            <v-card-text>
                <input type="date" v-model="dueDate" />
            </v-card-text>
            <v-card-actions>
                <v-btn color="red" @click="checkedOutBook = null">No</v-btn>
                <v-btn color="green" @click="checkoutBook()" :disabled="!dueDate">Yes</v-btn>
            </v-card-actions>
        </v-card> 
    </v-dialog>

    <v-dialog v-model="deleteBookDialog" width="auto">
        <v-card>
            <v-card-text>
                Are you sure you wish to delete this book? This cannot be undone! All quantities and images will also be
                removed.
            </v-card-text>
            <v-card-actions>
                <v-btn color="red" @click="deleteBookDialog = null">No</v-btn>
                <v-btn color="green" @click="deleteBook()" :loading="bookIsDeleting" :disabled="bookIsDeleting">Yes</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="createBookDialog" width="1024">
        <v-card>
            <v-card-title>
                <span class="text-h5">Create a New Book</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="newBook.name" label="Book Name" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="newBook.description" label="Book description" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="newBook.inventory_total_qty" label="Book Total Start Qty in Inventory"
                                required></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-file-input accept="image/*" @change="onNewBookFileChange" label="File"></v-file-input>
                        </v-col>
                    </v-row>
                </v-container>
                <small>Indicates a required field</small>
                <v-alert v-if="newBookErrorMessage" type="error">{{ newBookErrorMessage }}</v-alert>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" :disabled="newBookErrorMessage" variant="text" @click="closeCreateDialog()">
                    Close
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="createBook()" :loading="bookIsCreating"
                    :disabled="bookIsCreating">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="editBookDialog" persistent width="1024">
        <v-card>
            <v-card-title>
                <span class="text-h5">Edit {{ editBook.name }}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editBook.name" label="Book Name*" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editBook.description" label="Book description*" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editBook.inventory_total_qty" label="Book Total Qty in Inventory*"
                                required></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <div v-if="editFileChangeDialogBtn">
                                <v-file-input accept="image/*" @change="onExistingBookPictureChange"
                                    label="File Change"></v-file-input>
                                <v-btn @click="editFileChangeDialogBtn = false">Cancel Change</v-btn>
                            </div>
                            <div v-else>
                                <v-btn @click="editFileChangeDialogBtn = true">Change File</v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>
                <small>*Indicates required field</small>
                <v-alert v-if="editBookErrorMessage" type="error"> {{ editBookErrorMessage }}</v-alert>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" :disabled="editBookErrorMessage" variant="text"
                    @click="editBookDialog = false">
                    Close
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="updateBook()" :loading="bookIsUpdating"
                    :disabled="bookIsUpdating">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src="./BooksView.ts"></script>