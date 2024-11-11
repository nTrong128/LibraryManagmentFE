<script setup lang="ts">
import { RouterView } from 'vue-router'
import AdminSidebar from '@/components/Admin/Sidebar.vue'
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
</script>

<template>
  <div class="flex h-screen">
    <AdminSidebar />
    <ScrollArea class="flex-shrink w-full">

      <RouterView />

    </ScrollArea>
  </div>
</template>