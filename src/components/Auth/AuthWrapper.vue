<script setup lang="ts">
import { Card } from '@/components/ui/card'

defineProps<{
    title: string
    description: string
}>()
</script>

<template>
    <div class="w-full min-h-screen flex lg:grid lg:grid-cols-2 bg-gradient-to-br from-green-400 to-green-700">
        <div class="flex items-center justify-center py-12 px-4 w-full">
            <Card class="w-full max-w-md mx-auto animate-fade-in-up">
                <slot name="header">
                    <div class="text-center mb-6">
                        <h1 class="text-3xl font-bold">{{ title }}</h1>
                        <p class="text-muted-foreground mt-2">{{ description }}</p>
                    </div>
                </slot>
                <slot></slot>
            </Card>
        </div>
        <div class="hidden lg:block">
            <img src="/login_banner.jpg" alt="Auth Banner" width="1920" height="1080" class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale">
        </div>
    </div>
</template>

<style>
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out;
}
</style>