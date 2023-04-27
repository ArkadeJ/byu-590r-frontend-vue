<template>
    <v-row>
        <h1>This page is for logging the fish they catch of each species along with what rod and fly they used to catch them.</h1>
        <br><br>
    </v-row>    

    <v-row>
        <h4>-Notes: <br>When editing the flies, you must clear the field values before changing them.<br>
                    Must reload the page after creating a new entity before it appears.</h4>
    </v-row>
  <v-row>
        <v-col cols="6">
            <v-btn block color="green" @click="openCreateDialog" prepend-icon="mdi-plus">Create</v-btn>
        </v-col>
        <v-col cols="6">
            <v-btn block color="blue" @click="openEmailDialog" prepend-icon="mdi-vuetify" >Email Data</v-btn>
        </v-col>
    </v-row>

    <v-row>
        <v-col v-for="fish in fishes" :key="fish" class="d-flex child-flex" cols="12" sm="6" md="5" lg="4" xl="3" xxl="2">
            <v-card>
                <v-card-item>
                    <v-card-title>
                        <v-row>
                            <v-col cols="8">
                                {{ fish.species }}
                            </v-col>
                            <v-col cols="4">
                                <div class="d-flex justify-space-between">
                                    <v-btn round @click="openEditFishDialog(fish)" icon="mdi-pencil" color="warning"
                                        size="small"></v-btn>
                                    <v-btn round @click="openDeleteFishDialog(fish)" icon="mdi-delete" color="error"
                                        size="small"></v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-title>

                    <v-card-subtitle>{{ fish.location }}</v-card-subtitle>

                    <v-card-item>
                        <v-img :class="{ 'pa-4 text-center rounded-0': true, }"
                            width="300" height="400" :src="fish.file"></v-img>
                    </v-card-item>

                    <v-card-text>
                        <v-row>
                            <v-col >
                                <v-card-subtitle>
                                    Rod weight: {{ fish?.rod?.weight }}
                                </v-card-subtitle> 
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-card-subtitle v-for="fly in fish.flies">
                                    {{ fly.type }}
                                </v-card-subtitle>
                            </v-col>   
                        </v-row>
                    </v-card-text>
                </v-card-item>
            </v-card>
        </v-col>
    </v-row>


    <v-dialog v-model="deleteFishDialog" width="auto">
        <v-card>
            <v-card-text>
                Are you sure you wish to delete this fish? This cannot be undone! All information and images will also be
                removed.
            </v-card-text>
            <v-card-actions>
                <v-btn color="red" @click="deleteFishDialog = null">No</v-btn>
                <v-btn color="green" @click="deleteFish()" :loading="fishIsDeleting" :disabled="fishIsDeleting">Yes</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="createFishDialog" width="1024">
        <v-card>
            <v-card-title>
                <span class="text-h5">Share a new Fish</span>
            </v-card-title>
            <v-card-text>
                <v-container> 
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="newFish.species" label="Fish Species" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="newFish.location" label="Fish Location" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-select label="Select" :items="rods" v-model="newFish.rod_id"></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-select multiple chips clearable label="Select" :items="flies" v-model="newFish.flies"></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-file-input accept="image/*" @change="onNewFishFileChange" label="File"></v-file-input>
                        </v-col>
                    </v-row>
                </v-container>
                <small>Indicates a required field</small>
                <v-alert v-if="newFishErrorMessage" type="error">{{ newFishErrorMessage }}</v-alert>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" :disabled="newFishErrorMessage" variant="text" @click="closeCreateDialog()">
                    Close
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="createFish()" :loading="fishIsCreating"
                    :disabled="fishIsCreating">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="editFishDialog" persistent width="1024">
        <v-card>
            <v-card-title>
                <span class="text-h5">Edit {{ editFish.species }}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editFish.species" label="Fish species*" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editFish.location" label="Fish location*" required></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-select label="Select" :items="rods" v-model="editFish.rod_id"></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-select multiple chips clearable label="Select" :items="flies" v-model="editFish.flies"></v-select>
                        </v-col>
                    </v-row>
                    <v-row> 
                        <v-col cols="12">
                            <div v-if="editFileChangeDialogBtn">
                                <v-file-input accept="image/*" @change="onExistingFishPictureChange"
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
                <v-alert v-if="editFishErrorMessage" type="error"> {{ editFishErrorMessage }}</v-alert>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" :disabled="editFishErrorMessage" variant="text"
                    @click="editFishDialog = false">
                    Close
                </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="updateFish()" :loading="fishIsUpdating"
                    :disabled="fishIsUpdating">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="emailDialog" width="1024">
        <v-card>
            <v-card-title>
                <span class="text-h5">Email data</span>
            </v-card-title>
            <v-card-text>
                <v-container> 
                    <v-row>
                        <v-col cols="12">
                            <v-card-subtitle>Enter the email you would like the data sent to:</v-card-subtitle>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="email" label="Email" required></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
                <v-alert v-if="newFishErrorMessage" type="error">{{ newFishErrorMessage }}</v-alert>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" :disabled="newFishErrorMessage" variant="text" @click="closeEmailDialog()">
                    Close
                </v-btn>
                <v-btn color="green" variant="text" v-model="email" @click="sendEmail()" :loading="emailIsSending"
                    :disabled="fishIsCreating">
                    Send
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script src="./FishesView.ts"></script>