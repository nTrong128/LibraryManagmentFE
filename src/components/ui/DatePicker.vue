<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import { format } from '@/utils/dateTime'
import { computed } from 'vue';

const isDarkMode = computed(() => {
    return document.documentElement.classList.contains('dark')
})

const inputClassName = computed(() => {
    return `w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${isDarkMode.value ? 'dark' : ''
        }`
})

</script>

<template>
    <VueDatePicker label="Chọn ngày" placeholder="Ngày/Tháng/Năm" :enable-time-picker="false" :format="format" v-bind="$attrs" :dark="isDarkMode" :input-class-name="inputClassName" />
</template>


<style>
.dp__theme_dark {
    --dp-background-color: hsl(var(--background));
    --dp-text-color: hsl(var(--foreground));
    --dp-hover-color: hsl(var(--muted));
    --dp-hover-text-color: hsl(var(--muted-foreground));
    --dp-hover-icon-color: hsl(var(--muted-foreground));
    --dp-primary-color: hsl(var(--primary));
    --dp-primary-text-color: hsl(var(--primary-foreground));
    --dp-secondary-color: hsl(var(--secondary));
    --dp-border-color: hsl(var(--border));
    --dp-menu-border-color: hsl(var(--border));
}
</style>