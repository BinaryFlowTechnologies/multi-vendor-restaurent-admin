<template>
  <LayoutAuthenticated>
    <RouterView />
  </LayoutAuthenticated>
</template>

<script setup>
import LayoutAuthenticated from './components/LayoutAuthenticated.vue'
import store from "@core/store"

const fetchUser = async () => {
  store.dispatch("auth/fetchAuthenticatedUser").then(response => {})
}

onMounted(fetchUser)
</script>

<style lang="scss">
@use "@layouts/styles/default-layout";
</style>
