<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toRefs } from 'vue';
import { AlertCircle } from 'lucide-vue-next'

const props = defineProps({

    description: {
        type: String,
        required: true
    }
})

const { description } = toRefs(props)


</script>

<template>
    <Alert v-if="description" class="mt-4" variant="destructive">
        <AlertCircle class="w-4 h-4" />
        <AlertTitle>{{ description }}</AlertTitle>
    </Alert>
</template>