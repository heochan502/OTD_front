<script setup>
</script>

<template>
  <div class="app">
        <div class="container py-4">

            <header class="pb-4 mb-4 border-bottom">
                <router-link to="/" class="text-dark text-decoration-none">
                  <img src="\css\logo.png">
                </router-link>
                <div class="currentTime text-gray text-decoration-none">
                </div>
            </header>

            <main>
                <router-view />
            </main>

            <footer class="pt-4 mt-4 border-top">
                &copy; 2025. One ToDay. All rights reserved.
            </footer>

        </div>
    </div>
</template>

<style lang="scss" scoped>
.app .container {  max-width: 576px; }
</style>