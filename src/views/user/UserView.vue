<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { RouterView } from 'vue-router'
import landingHeader from '@/components/header/landingHeader.vue'
import loggedInHeader from '@/components/header/loggedInHeader.vue'
const authStore = useAuthStore()

</script>

<template>
    <loggedInHeader v-if="authStore.isAuthenticated" />
    <landingHeader v-else />
    <RouterView></RouterView>
</template>
