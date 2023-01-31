<script  lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import LoginView from './views/LoginView.vue'
export default {
  name: 'App',
  components: {
    LoginView,
    RouterLink,
    RouterView
  },
  data: function () {
    return {
      isAuthenticated: false
    }
  },
  methods: {
    checkAuth(isAuthenticated: boolean) {
      this.isAuthenticated = isAuthenticated
    },
    logout() {
      this.isAuthenticated = false;
    }
  }
}
</script>

<template>
  <div v-if="isAuthenticated">
    <header>
      <div class="header-navigation">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </div>
      <button @click="logout();">Logout</button>
    </header>

    <RouterView />
  </div>
  <LoginView v-else :is-authenticated="isAuthenticated" @authenticate="checkAuth($event)" />
</template>
