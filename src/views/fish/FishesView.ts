import { mapState } from 'vuex';
import { useDisplay } from 'vuetify/lib/framework.mjs';

export default {
    name: 'FishesView',
    computed: {
        ...mapState({
            fishes() {
                return this.$store.state.fishes.fishesList;
            },
            rods() {
                return this.$store.state.fishes.rodsList;
            },
            flies() {
                return this.$store.state.fishes.fliesList;
            },
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
                rod_id: 0,
                flies: [],
            },

            //Messages
            editFishErrorMessage: null,
            newFishErrorMessage: null,
            editFlyErrorMessage: null,

            //Dialogs
            createFishDialog: false,
            deleteFishDialog: false,
            editFishDialog: false,
            editFlyDialog: false,

            //Toggle Buttons
            editFileChangeDialogBtn: false,

            //Loaders
            fishIsUpdating: false,
            fishIsDeleting: false,
            fishIsCreating: false,
            flyIsUpdating: false,
            flyIsDeleting: false,

        } 
    },
    created() {
        this.getFishes();
        this.getRods();
        this.getFlies();
    },
    methods: {
        getFishes() {
            this.$store.dispatch("fishes/getFishes")
        },
        getRods() {
            this.$store.dispatch("fishes/getRods")
        },
        getFlies() {
            this.$store.dispatch("fishes/getFlies")
        },
        openDeleteFishDialog(fish) {
            this.selectedDeleteFish = fish;
            this.deleteFishDialog = true;
        },
        openEditFishDialog(fish) {
            this.editFish = fish;
            this.editFishDialog = true;
        },
        openEditFlyDialog(fish) {
            this.editFish = fish;
            this.editFlyDialog = true
        },
        openCreateDialog() {
            this.newFish = {
                species: '',
                location: '',
                file: '',
                rod_id: 0,
                flies: [],
            };
            this.createFishDialog = true;
        },
        closeCreateDialog() {
            this.newFish = {
                species: '',
                location: '',
                file: '',
                rod_id: 0,
                flies: [],

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