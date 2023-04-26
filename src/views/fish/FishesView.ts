import { mapState } from 'vuex';
import { useDisplay } from 'vuetify/lib/framework.mjs';

export default {
    name: 'FishesView',
    computed: {
        ...mapState({
            fishes() {
                return this.$store.state.fishes.fishesList;
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
            selectedDeleteFish: null,
            newFish: {
                species: '',
                location: '', 
                file: '',
            },

            //Messages
            editFishErrorMessage: null,
            newFishErrorMessage: null,

            //Dialogs
            createFishDialog: false,
            deleteFishDialog: false,
            editFishDialog: false,

            //Toggle Buttons
            editFileChangeDialogBtn: false,

            //Loaders
            fishIsUpdating: false,
            fishIsDeleting: false,
            fishIsCreating: false,


        } 
    },
    created() {
        this.getFishes();
    },
    methods: {
        getFishes() {
            this.$store.dispatch("fishes/getFishes")
        },
        openDeleteFishDialog(fish) {
            this.selectedDeleteFish = fish;
            this.deleteFishDialog = true;
        },
        openEditFishDialog(fish) {
            this.editFish = fish;
            this.editFishDialog = true;
        },
        openCreateDialog() {
            this.newFish = {
                species: '',
                location: '',
                file: ''

            };
            this.createFishDialog = true;
        },
        closeCreateDialog() {
            this.newFish = {
                species: '',
                location: '',
                file: '',

            };
            this.createFishDialog = false;
        },
        closeEditDialog() {
            this.editFishDialog = false;
        },
        closeDeleteDialog() {
            this.deleteFishDialog = false;
        },
        createFish() {
            this.fishIsCreating = true;
            this.newFishErrorMessage = null;
            this.$store.dispatch("fishes/createFish", this.newFish)
                .then(() => {
                    this.closeCreateDialog();
                    this.fishIsCreating = false;
                })
                .catch((error) => {
                    this.newFishErrorMessage = error.response.data.results;
                    this.fishIsCreating = false;
                })
        },
        onExistingFishPictureChange(e) {
            var image = e.target.files || e.dataTransfer.files;
            if (!image.length)
                return;

            this.editFish.file = image[0];
            this.fishIsUpdating = true;
            this.$store.dispatch("fishes/updateFishPicture", this.editFish)
                .then(() => {
                    this.fishIsUpdating = false;
                })
                .catch((error) => {
                    this.editFishErrorMessage = error.response.data.results;
                    this.fishIsUpdating = false;
                })
        },
        onNewFishFileChange(e) {

            this.newFish.file = null;
            var image = e.target.files || e.dataTransfer.files;

            if (!image.length)
                return;

            this.newFish.file = image[0];
        },

        updateFish() {
            console.log('view.ts updateFish()')
            this.fishIsUpdating = true;
            this.editFishErrorMessage = null;
            this.$store.dispatch("fishes/updateFish", this.editFish)
                .then(() => {
                    this.closeEditDialog();
                    this.fishIsUpdating = false;
                })
                .catch((error) => {
                    this.editFishErrorMessage = error.response.data.results;
                    this.fishIsUpdating = false;
                })

        },

        deleteFish() {
            this.fishIsDeleting = true;
            this.editFishErrorMessage = null;
            this.$store.dispatch("fishes/deleteFish", this.selectedDeleteFish)
                .then(() => {
                    this.closeDeleteDialog();
                    this.fishIsDeleting = false;
                })
        },

    }
} 