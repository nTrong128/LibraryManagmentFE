<template>
    <Button variant="outline" size="icon" @click="toggleTheme" class="relative">
        <SunIcon class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" :class="{ 'scale-0': theme === 'dark' }" />
        <MoonIcon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" :class="{ 'scale-100 rotate-0': theme === 'dark' }" />
        <span class="sr-only">Toggle theme</span>
    </Button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { Button } from '@/components/ui/button'
import { SunIcon, MoonIcon } from 'lucide-vue-next'

const { theme, toggleTheme } = useTheme()
</script>