<template>
    <span class="ml-2 inline-flex align-middle">
        <ChevronsUp v-if="active && ascending" />
        <ChevronsDown v-else-if="active && !ascending" />
        <span v-else></span>
    </span>
</template>

<script setup lang="ts">
import { ChevronsUp, ChevronsDown } from 'lucide-vue-next'

defineProps<{
    active: boolean
    ascending: boolean
}>()
</script>