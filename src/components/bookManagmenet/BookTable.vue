<template>

  <Card>
    <CardHeader>
      <CardTitle class="flex justify-between items-center">
        Danh sách sách
      </CardTitle>
    </CardHeader>
    <div v-if="loading" class="flex justify-center my-40">
      <Spinner class="h-8 w-8" />
    </div>
    <CardContent v-else>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Tên sách</TableHead>
            <TableHead>Số lượng</TableHead>
            <TableHead>Đơn giá</TableHead>
            <TableHead>Nguồn gốc</TableHead>
            <TableHead>Nhà xuất bản</TableHead>
            <TableHead>Năm xuất bản</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody v-auto-animate="{ duration: 200 }">
          <TableRow v-for="(book, index) in books" :key="book.MaSach">
            <TableCell>{{ (currentPage - 1) * 5 + index + 1 }}</TableCell>
            <TableCell>{{ book.TenSach }}</TableCell>
            <TableCell>{{ book.SoQuyen }}</TableCell>
            <TableCell>{{ book.DonGia }} VNĐ</TableCell>
            <TableCell>{{ book.NguonGoc }}</TableCell>
            <TableCell>{{ getPublisherName(book.MaNXB) }}</TableCell>
            <TableCell>{{ book.NamXuatBan }}</TableCell>
            <TableCell class="flex gap-x-4">
              <Button class="rounded-full px-2 bg-indigo-400 hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-800" @click="openEditModal(book)">
                <SquarePen class="dark:text-slate-200" />
              </Button>
              <Button class="rounded-full px-2 bg-rose-500 hover:bg-rose-600 dark:bg-rose-500 dark:hover:bg-rose-800" @click="openDeleteModal(book)">
                <Trash2 class="dark:text-slate-200" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>


    </CardContent>
    <CardFooter class="flex justify-end">
      <!-- Pagination controls -->
      <div class="flex items-center justify-between mt-4">
        <div class="text-sm text-gray-700 dark:text-gray-400">
          Showing {{ startIndex }} to {{ endIndex }} of {{ totalItems }} entries
        </div>
        <Pagination :total-pages="totalPages" :current-page="currentPage" @change="changePage" />
      </div>
    </CardFooter>
  </Card>

  <EditBookModal v-model:isOpen="isEditModalOpen" @save="handleEditBook" />

  <DeleteBookModal v-model:isOpen="isDeleteModalOpen" @delete="handleDeleteBook" />

  <AlertDialog :open="!!error" @update:open="clearError">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Error</AlertDialogTitle>
        <AlertDialogDescription>
          {{ error }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button @click="clearError">OK</Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { SquarePen, Trash2 } from 'lucide-vue-next'
import { useBookStore } from '@/stores/bookStore'
import { useNhaXuatBanStore } from '@/stores/nhaXuatBanStore'
import Spinner from '@/components/Spinner.vue'
import EditBookModal from '@/components/bookManagmenet/EditBookModal.vue'
import DeleteBookModal from '@/components/bookManagmenet/DeleteBookModal.vue'
import Pagination from '@/components/Pagination.vue'
import type { Sach } from '@/types/models'




const bookStore = useBookStore()
const publisherStore = useNhaXuatBanStore()
const publishers = computed(() => publisherStore.allNhaXuatBans)

const books = computed(() => bookStore.allBooks)
const loading = computed(() => bookStore.loading)
const error = computed(() => bookStore.error)
const currentPage = computed(() => bookStore.currentPage)
const totalItems = computed(() => bookStore.totalItems)
const totalPages = computed(() => bookStore.totalPages)

const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

const startIndex = computed(() => (currentPage.value - 1) * 5 + 1)
const endIndex = computed(() => Math.min(currentPage.value * 5, totalItems.value))

const emit = defineEmits(['pageChange'])

const props = defineProps<{
  page: number
}>()


const openEditModal = (book: Sach) => {
  bookStore.selectBook(book)
  isEditModalOpen.value = true
}

const openDeleteModal = (book: Sach) => {
  bookStore.selectBook(book)
  isDeleteModalOpen.value = true
}

const handleEditBook = async (editedBook: Sach) => {
  await bookStore.updateBook(editedBook.MaSach, editedBook)
  isEditModalOpen.value = false
}

const handleDeleteBook = async (bookId: string) => {
  await bookStore.deleteBook(bookId)
  isDeleteModalOpen.value = false
}

const clearError = () => {
  bookStore.error = null
}

const getPublisherName = (MaNXB: string) => {
  const publisher = publishers.value.find(p => p.MaNXB === MaNXB)
  return publisher ? publisher.TenNXB : 'Không rõ'
}

const changePage = (page: number) => {
  emit('pageChange', page)
}

watch(() => props.page, (newPage) => {
  bookStore.fetchBooks(newPage)
}, { immediate: true })


onMounted(() => {
  publisherStore.fetchAllNhaXuatBans()
})
</script>