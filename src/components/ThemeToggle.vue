<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { Button } from '@/components/ui/button'
import { SunIcon, MoonIcon } from 'lucide-vue-next'

const props = defineProps<{
    showText?: boolean
}>()

const { theme, toggleTheme } = useTheme()

const buttonClass = computed(() => {
    return props.showText ? 'px-3 py-2' : 'w-10 h-10'
})
</script>

<template>
    <Button variant="outline" @click="toggleTheme" :class="buttonClass">

        <div class="flex">
            <SunIcon :v-if="theme === 'dark'" class="transition-all duration-300" :class="theme === 'dark' ? 'hidden ' : ''" />
            <MoonIcon class="transition-all duration-300" :class="theme === 'dark' ? ' ' : ' hidden'" />
            <span v-if="props.showText" class="ml-2">{{ theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối' }}</span>
        </div>
    </Button>
</template>