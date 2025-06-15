<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
<template>
  <header></header>
  <div id="app" class="bg-main-background">
    <main class="flex justify-center">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
</style>
