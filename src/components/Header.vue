<template>
    <header class="border-b">
      <div class="container flex justify-between items-center py-6">
        <h1 class="text-3xl font-bold">Library Dashboard</h1>
        <nav>
          
          <RouterLink to="/"><Button variant="ghost" class="mx-2">Dashboard</Button></RouterLink>
          <RouterLink to="/about"><Button variant="ghost" class="mx-2">About</Button></RouterLink>
          <RouterLink to="/application"><Button variant="ghost" class="mx-2">Borrow application</Button></RouterLink>
        </nav>
      </div>
    </header>
  </template>
  
  <script setup>
  import { Button } from '@/components/ui/button'
  </script>