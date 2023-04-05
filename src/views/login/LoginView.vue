<script lang="ts">
export default {
  name: 'LoginView',
  emits: ['authenticate'],
  data: function () {
    return {
      isAuthenticated: false,
      alertType: 'success',
      errorMsg: '',
      password: '',
      username: '',
      email: '',
      dialog: false,
      isLoading: false,
      registerFormIsLoading: false,
      registerDialog: false,
      isRegisterFormValid: false,
      userNameRules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 3) || 'Min 3 characters',
      ],
      passwordRules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 10) || 'Min 10 characters',
      ],
      register: {
        email: '',
        name: '',
        password: '',
        c_password: ''
      },
      registerRules: {
        email: [
          value => !!value || 'Required.',
          value => (value && value.length >= 3) || 'Min 3 characters'
        ],
        name: [
          value => !!value || 'Required.',
          value => (value && value.length >= 3) || 'Min 3 characters'
        ],
        pasword: [
          value => !!value || 'Required.',
          value => (value && value.length >= 8) || 'Min 8 characters'
        ],
        c_password: [
          value => !!value || 'Required.',
          value => (value && value.length >= 8) || 'Min 8 characters'
        ],
      },
      isFormValid: false,
    }
  },
  methods: {
    submitLogin() {
      if (!this.isFormValid) {
        return;
      }
      const user = {
        email: this.email,
        password: this.password
      }
      this.errorMsg = '';
      this.isLoading = true;
      this.$store.dispatch("auth/login", user).then(
        () => {
          setTimeout(() => {
            window.location.reload();
          }, 2000)
        },
        (error) => {
          this.isLoading = false;
          this.errorMsg =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

        }
      );

    },
    submitRegister() {
      if (!this.isRegisterFormValid) {
        return;
      }

      const register = {
        name: this.register.name,
        email: this.register.email,
        password: this.register.password,
        c_password: this.register.c_password
      }

      this.registerFormIsLoading = true;
      this.$store.dispatch("auth/register", register).then(
        () => {
          alert('success!');
          this.registerFormIsLoading = false;
          this.registerDialog = false;
        },
        (error) => {
          this.registerFormIsLoading = false;
          alert('error!')

        }
      );

    },


  }
}
</script>
<template>
  <div class="login-page-content">
    <div class="login-box">
      <h1 class="logo-area">
        Welcome
      </h1>
      <div class="input-container">

        <v-form v-model="isFormValid">
          <div class="input-container">
            <v-text-field v-model="email" label="Username" :rules="userNameRules" hide-details="auto"></v-text-field>

            <v-text-field v-model="password" label="Password" type="password" :rules="passwordRules"
              @keyup.enter="submitLogin()" hide-details="auto" />

            <v-alert color="error" icon="$error" v-if="errorMsg !== ''" :type="alertType" @click="errorMsg = ''">{{
              errorMsg
            }}</v-alert>

          </div>


        </v-form>


        <div class="button-container">
          <v-btn class="ma-2 pa-2" v-if="!isAuthenticated" :loading="isLoading" :disabled="!isFormValid"
            @click="submitLogin()">
            Login Here
          </v-btn>
          <v-btn @click="dialog = true">
            Forgot Password
          </v-btn>
          <v-btn class="ma-2 pa-2" @click="registerDialog = true">Register</v-btn>
          <v-dialog v-model="dialog" :scrim="false" persistent>
            <v-card>
              <v-card-text>
                <v-text-field v-model="email" label="Password Reset Email" :rules="userNameRules"
                  hide-details="auto"></v-text-field>

              </v-card-text>
              <v-card-actions>
                <v-btn variant="text" @click="dialog = false">
                  Close
                </v-btn>
                <v-btn variant="text">
                  Submit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="registerDialog">
            <v-form v-model="isRegisterFormValid">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Register a User</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="Full Name*" v-model="register.name"
                          :rules="registerRules.name"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field label="Email*" v-model="register.email" :rules="registerRules.email"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field label="Password*" v-model="register.password" :rules="registerRules.password"
                          type="password"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field label="Password Confirmation*" v-model="register.c_password"
                          :rules="registerRules.c_password" type="password"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*indicates a required field</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="registerDialog = false">
                    Close
                  </v-btn>
                  <v-btn color="blue-darken-1" variant="text" :disabled="!isRegisterFormValid"
                    :loading="registerFormIsLoading" @click="submitRegister()">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </v-dialog>
        </div>
      </div>
    </div>
  </div>
</template >
<style src="./LoginView.scss"></style>