<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Search, Clock, Users } from 'lucide-vue-next'
import landingHeader from '@/components/header/landingHeader.vue'

const router = useRouter()
const searchQuery = ref('')

const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchQuery.value)
    // router.push({ name: 'SearchResults', query: { q: searchQuery.value } })
}

const navigateToLogin = () => {
    router.push('/login')
}

const navigateToSignup = () => {
    router.push('/signup')
}

const featuredBooks = [
    { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', cover: 'https://m.media-amazon.com/images/I/81aY1lxk+9L._AC_UF1000,1000_QL80_.jpg' },
    { id: 2, title: '1984', author: 'George Orwell', cover: 'https://m.media-amazon.com/images/I/71rpa1-kyvL._AC_UF1000,1000_QL80_.jpg' },
    { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen', cover: 'https://m.media-amazon.com/images/I/81Scutrtj4L._UF1000,1000_QL80_.jpg' },
    { id: 4, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover: 'https://m.media-amazon.com/images/I/51jPo0RDFUL._SL500_.jpg' },
]
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
        <landingHeader />

        <main class="container mx-auto px-6 py-8">
            <section class="text-center mb-16">
                <h1 class="text-4xl font-bold mb-4">Welcome to MyLibrary</h1>
                <p class="text-xl mb-8">Discover, borrow, and enjoy a world of books at your fingertips.</p>
                <div class="flex justify-center">
                    <div class="relative w-full max-w-xl">
                        <Input v-model="searchQuery" type="text" placeholder="Search for books..." class="pr-10" @keyup.enter="handleSearch" />
                        <Button class="absolute right-0 top-0 bottom-0" @click="handleSearch">
                            <Search class="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </section>

            <section class="mb-16">
                <h2 class="text-2xl font-semibold mb-6">Featured Books</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <Card v-for="book in featuredBooks" :key="book.id" class="overflow-hidden">
                        <img :src="book.cover" :alt="book.title" class="w-full h-48 object-cover" />
                        <CardContent>
                            <h3 class="font-semibold">{{ book.title }}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">{{ book.author }}</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section class="mb-16">
                <h2 class="text-2xl font-semibold mb-6">Why Choose MyLibrary?</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card>
                        <CardContent class="flex flex-col items-center text-center p-6">
                            <BookOpen class="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                            <h3 class="text-xl font-semibold mb-2">Vast Collection</h3>
                            <p>Access thousands of books across various genres and topics.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent class="flex flex-col items-center text-center p-6">
                            <Clock class="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                            <h3 class="text-xl font-semibold mb-2">24/7 Access</h3>
                            <p>Borrow and return books anytime, from anywhere.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent class="flex flex-col items-center text-center p-6">
                            <Users class="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                            <h3 class="text-xl font-semibold mb-2">Community</h3>
                            <p>Join book clubs, discussions, and literary events.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section class="text-center">
                <h2 class="text-2xl font-semibold mb-4">Ready to Start Reading?</h2>
                <p class="mb-6">Join MyLibrary today and unlock a world of knowledge and imagination.</p>
                <Button size="lg" @click="navigateToSignup">Sign Up Now</Button>
            </section>
        </main>

        <footer class="bg-white dark:bg-gray-800 shadow mt-16">
            <div class="container mx-auto px-6 py-4">
                <p class="text-center text-gray-600 dark:text-gray-400">
                    © 2024 MyLibrary. All rights reserved.
                </p>
            </div>
        </footer>
    </div>
</template>