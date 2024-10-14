<template>
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-6">Library Book Browser</h1>

        <div class="flex justify-between mb-4">
            <Input v-model="searchQuery" placeholder="Search books..." class="w-64" />
            <Select v-model="sortBy">
                <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="title">Sort by Title</SelectItem>
                    <SelectItem value="author">Sort by Author</SelectItem>
                    <SelectItem value="year">Sort by Year</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div class="grid grid-cols-5 gap-4 mb-6">
            <Card v-for="book in paginatedBooks" :key="book.id" class="flex flex-col">
                <CardHeader>
                    <CardTitle class="text-lg">{{ book.title }}</CardTitle>
                    <CardDescription>{{ book.author }}</CardDescription>
                </CardHeader>
                <CardContent class="flex-grow">
                    <p class="text-sm">Year: {{ book.year }}</p>
                </CardContent>
                <CardFooter>
                    <Button class="w-full">View Details</Button>
                </CardFooter>
            </Card>
        </div>

        <div class="flex justify-center">
            <!-- PAGINATIOn -->
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'


// Mock data for books
const books = ref(Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `Book ${i + 1}`,
    author: `Author ${Math.floor(i / 10) + 1}`,
    year: 2000 + Math.floor(Math.random() * 23)
})))

const searchQuery = ref('')
const sortBy = ref('title')
const currentPage = ref(1)
const booksPerPage = 25

const filteredAndSortedBooks = computed(() => {
    let result = books.value

    // Apply search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)
        )
    }

    // Apply sorting
    result.sort((a, b) => {
        if (a[sortBy.value] < b[sortBy.value]) return -1
        if (a[sortBy.value] > b[sortBy.value]) return 1
        return 0
    })

    return result
})

const totalPages = computed(() =>
    Math.ceil(filteredAndSortedBooks.value.length / booksPerPage)
)

const paginatedBooks = computed(() => {
    const startIndex = (currentPage.value - 1) * booksPerPage
    return filteredAndSortedBooks.value.slice(startIndex, startIndex + booksPerPage)
})
</script>