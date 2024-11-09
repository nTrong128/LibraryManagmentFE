<template>
    <span class="ml-2 inline-flex align-middle">
        <ArrowUpZA strokeWidth={1.5} v-if="active && ascending" />
        <ArrowDownZA strokeWidth={1.5} v-else-if="active && !ascending" />
        <span v-else></span>
    </span>
</template>

<script setup lang="ts">
import { ArrowUpZA, ArrowDownZA } from 'lucide-vue-next'

defineProps<{
    active: boolean
    ascending: boolean
}>()
</script>