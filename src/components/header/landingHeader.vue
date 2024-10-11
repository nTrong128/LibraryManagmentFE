<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-vue-next'

const isMenuOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
    <Card class="sticky top-0 z-50">
        <CardContent class="p-0">
            <nav class="container mx-auto px-4 sm:px-6 py-3">
                <div class="flex justify-between items-center">
                    <div class="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                        Thư viện Online - HEHE
                    </div>

                    <!-- Mobile menu button -->
                    <div class="sm:hidden">
                        <Button variant="ghost" size="icon" @click="toggleMenu">
                            <Menu v-if="!isMenuOpen" class="h-6 w-6"></Menu>
                            <X v-else class="h-6 w-6" />
                        </Button>
                    </div>

                    <!-- Desktop menu -->
                    <div class="hidden sm:flex space-x-2">
                        <Button class="font-bold rounded-lg hover:shadow-green-500 hover:scale-105 transition-all duration-300">
                            <router-link to="/signup">Đăng ký</router-link>
                        </Button>
                        <Button class="bg-green-600 text-white font-bold rounded-lg hover:shadow-green-500 hover:scale-105 transition-all duration-300">
                            <router-link to="/login">Đăng nhập</router-link>
                        </Button>
                    </div>
                </div>

                <!-- Mobile menu items -->
                <div v-if="isMenuOpen" class="sm:hidden mt-4 space-y-2">
                    <Button class="w-full font-bold rounded-lg hover:shadow-green-500 hover:scale-105 transition-all duration-300">
                        <router-link to="/signup" class="block">Đăng ký</router-link>
                    </Button>
                    <Button class="w-full bg-green-600 text-white font-bold rounded-lg hover:shadow-green-500 hover:scale-105 transition-all duration-300">
                        <router-link to="/login" class="block">Đăng nhập</router-link>
                    </Button>
                </div>
            </nav>
        </CardContent>
    </Card>
</template>