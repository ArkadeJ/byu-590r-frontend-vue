<script  lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import LoginView from './views/login/LoginView.vue'
import { mapState } from 'vuex'
import { ref } from 'vue'

export default {
  setup() {
    const theme = ref('dark');
    function changeTheme() {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    }
    return { theme, changeTheme };
  },
  name: 'App',
  components: {
    LoginView,
    RouterLink,
    RouterView
  },
  data: function () {
    return {
      profileDialog: false,
      profileIsUploading: false,
      verificationEmailLoading: false,
      showEmailNotVerifiedDialog: false,
      showChangeEmailTextField: false,
      changeEmail: false,
      successVerificationMessage: '',
      avatarDialog: false,
      changeEmailRules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 3) || 'Min 3 characters',
      ],
      profile:
      {
        avatar: '',
        name: '',
        title: '',
        icon: 'mdi-account-circle',
        color: 'info'
      },
      profilePictureImage: '',
      emailOfVerification: ''
    }
  },

  computed: {
    ...mapState({
      user() {
        return this.$store.state.user.user;
      },
      auth() {
        return this.$store.state.auth;
      },
      authUser() {
        return this.auth.user;
      },
      isAuthenticated() {
        return this.auth.status.loggedIn && (this.authUser.token !== undefined);
      },
      title() {
        return 'Welcome ' + this.authUser.name + '!'
      },
      avatarURL() {
        return this.auth.user.avatar;
      }
    }),
  },
  updated() {

    if (this.isAuthenticated) {
      this.$router.push({ name: 'home' });
    }
  },
  created() {
    if (this.authUser) {
      this.getCurrentUser();
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
    },
    checkAuth(auth) {
      console.log('Authenticated!', auth)
    },
    onAvatarChange(e) {
      var image = e.target.files || e.dataTransfer.files;

      if (!image.length)
        return;
      this.profileIsUploading = true;
      this.$store.dispatch("user/uploadAvatar", image[0], { root: true }).then(
        (response) => {
          this.$store.commit("auth/uploadAvatarSuccess", response.avatar);
          this.profileIsUploading = false;
        },

      ).catch((error) => {
        console.log(error);
        alert('Error. Try again');
        this.profileIsUploading = false;
      });
    },
    removeAvatar() {
      this.profileIsUploading = true;
      this.$store.dispatch("user/removeAvatar").then(
        (response) => {
          this.$store.commit("auth/uploadAvatarSuccess", response.avatar);
          this.profileIsUploading = false;
        },

      ).catch((error) => {
        console.log(error);
        alert('Error. Try again');
        this.profileIsUploading = false;
      });
    },
    getCurrentUser() {
      this.profile.name = this.authUser.name;

      this.profile.title = this.title;
      this.$store.dispatch("user/getUser").then(
        (response) => {
          if (response.avatar) {
            this.$store.commit("auth/uploadAvatarSuccess", response.avatar);

          }
          if (!response.email_verified_at) {
            this.showEmailNotVerifiedDialog = true;
          }
        }
      )
    },
  }
}
</script>
<template>
  <v-app :theme="theme">
    <v-app-bar :title="(authUser.name === undefined) ? '' : title" v-if="isAuthenticated">
      <v-spacer></v-spacer>
      <v-btn to="/" default>Home</v-btn>
      <v-btn to="about">Fish</v-btn>
      <v-btn to="books">Books</v-btn>
      <v-btn @click="logout();">Logout</v-btn>
      <v-btn @click="avatarDialog = true">
        <v-avatar>
          <v-img v-if="avatarURL" :src="avatarURL"></v-img>
          <v-icon v-else icon="mdi-account-circle"></v-icon>
        </v-avatar>
      </v-btn>
      <v-dialog v-model="avatarDialog" :scrim="false" transition="dialog-bottom-transition" persistent>
        <v-container fill-height>
          <v-row justify="center">
            <v-card width="600" height="auto" justify='center'>
              <v-col>
                <v-row justify="start">
                  <v-card-title>
                    Profile
                  </v-card-title>
                </v-row>
                <v-row justify="start">
                  <v-card-text>
                    Edit profile here
                  </v-card-text>
                </v-row>
              </v-col>
              <v-col align-self="center" justify="space-around">
                <v-row justify="center">
                  <v-img v-if="avatarURL" :src="avatarURL" width="300" height="400"></v-img>

                  <v-icon v-else icon="mdi-account-circle"></v-icon>

                </v-row>
                <v-row justify="center">
                  <v-col>
                    <v-file-input v-if="avatarURL" label="File input" variant="underlined" disabled></v-file-input>
                    <v-file-input v-else label="File input" variant="underlined" @change="onAvatarChange"></v-file-input>
                  </v-col>
                </v-row>
              </v-col>
              <v-card-actions>
                <v-btn v-if="avatarURL" @click="removeAvatar();">
                  Remove Avatar
                </v-btn>
                <v-btn v-else disabled>
                  Remove Avatar
                </v-btn>
                <v-btn variant="text" @click="avatarDialog = false">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-container>
      </v-dialog>
    </v-app-bar>

    <v-main>
      <v-container>
        <div v-if="isAuthenticated">
          <RouterView />
        </div>
        <LoginView v-else :is-authenticated="isAuthenticated" @authenticate="checkAuth($event)" />
      </v-container>
    </v-main>
  </v-app>
</template>
