<template>
  <header class="border-b">
    <div class="container flex justify-between items-center py-6">
      <h1 class="text-3xl font-bold">Library Dashboard</h1>
      <nav class="flex">
        <RouterLink v-for="(item, index) in navItems" :key="index" :to="item.path">
          <Button variant="ghost" class="mx-2">{{ item.label }}</Button>
        </RouterLink>
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ThemeToggle.vue'

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/dashboard/books', label: 'Book Management' },
  { path: '/dashboard/applications', label: 'Borrow application' }
]
</script>
