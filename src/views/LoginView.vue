<script lang="ts">
export default {
  name: 'LoginView',
  emits: ['authenticate'],
  data: function () {
    return {
      isAuthenticated: false
    }
  },
  methods: {
    submitLogin() {
      this.isAuthenticated = true;
      this.$emit('authenticate', this.isAuthenticated)
    }
  }
}
</script>

<template>
  <button v-if="!isAuthenticated" @click="submitLogin()">Login Page Placeholder Here</button>
</template>

<style lang="scss">
@use '@/assets/styles/ui.scss';
</style>
