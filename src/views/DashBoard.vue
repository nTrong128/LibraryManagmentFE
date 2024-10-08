<template>
  <div class="min-h-screen bg-background">
    <main class="container py-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatisticsCard title="Total Books" :value="totalBooks" icon="BookOpen" bg_color="bg-indigo-500" />
        <StatisticsCard title="Total Members" :value="totalMembers" icon="Users" bg_color="bg-green-500" />
        <StatisticsCard title="Books Borrowed" :value="borrowedBooks" icon="Bookmark" bg_color="bg-yellow-500" />
      </div>
      <BookTable :books="books" @add-book="showAddBookModal = true" />
    </main>
    <AddBookModal v-if="showAddBookModal" @close="showAddBookModal = false" @add-book="addBook" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatisticsCard from '@/components/StatisticsCard.vue'
import BookTable from '@/components/bookManagmenet/BookTable.vue'
import AddBookModal from '@/components/bookManagmenet/AddBookModal.vue'

const totalBooks = ref(1250)
const totalMembers = ref(500)
const borrowedBooks = ref(320)

const books = ref([
  { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780446310789', status: 'Available' },
  { id: 2, title: '1984', author: 'George Orwell', isbn: '9780451524935', status: 'Borrowed' },
  { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518', status: 'Available' },
  { id: 4, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', status: 'Borrowed' },
  { id: 5, title: 'Moby-Dick', author: 'Herman Melville', isbn: '9780142437247', status: 'Available' },
])

const showAddBookModal = ref(false)

const addBook = (newBook) => {
  books.value.push({
    id: books.value.length + 1,
    ...newBook,
    status: 'Available'
  })
  totalBooks.value++
  showAddBookModal.value = false
}
</script>