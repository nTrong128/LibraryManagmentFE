<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-vue-next'
import { useRouter } from 'vue-router';
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useAuthStore } from '@/stores/authStore'
import { Separator } from '@/components/ui/separator'

const isMenuOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}
const authStore = useAuthStore()

const isDocGia = authStore.isDocGia


const router = useRouter()


// Mock navigation items (unchanged)
const navItems = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Sách', href: '/books' },
    { name: 'Mượn sách', href: 'borrow' },
]


</script>

<template>
    <Card class="sticky top-0 z-50">
        <CardContent class="p-0">
            <nav class="container mx-auto px-4 sm:px-6 py-3">
                <div class="flex justify-between items-center">
                    <div class="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                        Thư viện Online - HEHE
                    </div>
                    <div class="flex h-5 items-center space-x-4 text-sm">
                        <RouterLink to="/">
                            <Button variant="ghost">Trang chủ</Button>
                        </RouterLink>
                        <Separator orientation="vertical" />
                        <RouterLink to="/books">
                            <Button variant="ghost">Sách</Button>
                        </RouterLink>
                        <Separator v-if="isDocGia" orientation="vertical" />
                        <RouterLink v-if="isDocGia" to="/borrow">
                            <Button variant="ghost">Trang chủ</Button>
                        </RouterLink>
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
                        <ThemeToggle :showText="true" />

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
                    <ThemeToggle :showText="true" />

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