<template>
  <header class="border-b ">
    <div class="container  flex justify-between items-center py-6">
      <h1 class="text-3xl font-bold">Library Dashboard</h1>
      <nav class="flex">

        <RouterLink to="/dashboard"><Button variant="ghost" class="mx-2">Dashboard</Button></RouterLink>
        <RouterLink to="/dashboard/books"><Button variant="ghost" class="mx-2">Book Management</Button></RouterLink>
        <RouterLink to="/dashboard/applications"><Button variant="ghost" class="mx-2">Borrow application</Button></RouterLink>
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>