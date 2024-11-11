<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useAuthStore } from '@/stores/authStore';
import { onMounted } from 'vue';



const authStore = useAuthStore();

onMounted(async () => {
  await authStore.checkingAuth();
});

</script>

<template>
  <RouterView />
  <Toaster duration="2000" />

</template>
