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
        <!-- <TableHeader>
          <TableRow>
            <TableHead @click="sort('MaSach')">
              STT
              <SortIcon :active="sortBy === 'MaSach'" :ascending="sortOrder === 'asc'" />
            </TableHead>
            <TableHead @click="sort('TenSach')">
              Tên sách
              <SortIcon :active="sortBy === 'TenSach'" :ascending="sortOrder === 'asc'" />
            </TableHead>
            <TableHead @click="sort('SoQuyen')">
              Số lượng
              <SortIcon :active="sortBy === 'SoQuyen'" :ascending="sortOrder === 'asc'" />
            </TableHead>
            <TableHead @click="sort('DonGia')">
              Đơn giá
              <SortIcon :active="sortBy === 'DonGia'" :ascending="sortOrder === 'asc'" />
            </TableHead>
            <TableHead @click="sort('NguonGoc')">
              Nguồn gốc
              <SortIcon :active="sortBy === 'NguonGoc'" :ascending="sortOrder === 'asc'" />
            </TableHead>
            <TableHead>Ảnh bìa</TableHead>
            <TableHead @click="sort('MaNXB')">
              Nhà xuất bản
              <SortIcon :active="sortBy === 'MaNXB'" :ascending="sortOrder === 'asc'" />
            </TableHead>
            <TableHead @click="sort('NamXuatBan')">
              Năm xuất bản
              <SortIcon :active="sortBy === 'NamXuatBan'" :ascending="sortOrder === 'asc'" />
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>

        </TableHeader> -->
        <TableHead v-for="column in columns" :key="column.key">
          <TableCell @click="column.sortable && sort(column.key)" class="cursor-pointer">
            {{ column.label }}
            <SortIcon v-if="column.sortable" :active="sortBy === column.key" :ascending="sortOrder === 'asc'" />
          </TableCell>
        </TableHead>

        <TableBody>
          <TableRow class="" v-for="(book, index) in books" :key="book.MaSach">
            <TableCell>{{ (currentPage - 1) * pageSize + index + 1 }}</TableCell>
            <TableCell>{{ book.TenSach }}</TableCell>
            <TableCell>{{ book.SoQuyen }}</TableCell>
            <TableCell>{{ book.DonGia }} VNĐ</TableCell>
            <TableCell>{{ book.NguonGoc }}</TableCell>
            <TableCell>
              <img v-if="book.image" :src="book.image" alt="Book cover" class="h-36 w-36 object-cover rounded-lg" />
              <p v-else>trống</p>
            </TableCell>
            <TableCell>{{ getPublisherName(book.MaNXB) }}</TableCell>
            <TableCell>{{ book.NamXuatBan }}</TableCell>
            <TableCell>
              <div class="flex justify-center align-middle space-x-2">
                <Button class="rounded-full px-2 bg-indigo-400 hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-800" @click="openEditModal(book)">
                  <SquarePen class="dark:text-slate-200" />
                </Button>
                <Button class="rounded-full px-2 bg-rose-500 hover:bg-rose-600 dark:bg-rose-500 dark:hover:bg-rose-800" @click="openDeleteModal(book)">
                  <Trash2 class="dark:text-slate-200" />
                </Button>
              </div>
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


</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { SquarePen, Trash2 } from 'lucide-vue-next'
import { useBookStore } from '@/stores/bookStore'
import { useNhaXuatBanStore } from '@/stores/nhaXuatBanStore'
import Spinner from '@/components/Spinner.vue'
import EditBookModal from '@/components/Admin/BookManagement/EditBookModal.vue'
import DeleteBookModal from '@/components/Admin/BookManagement/DeleteBookModal.vue'
import Pagination from '@/components/Pagination.vue'
import SortIcon from '@/components/SortIcon.vue'
import type { Sach } from '@/types/models'


const bookStore = useBookStore()
const publisherStore = useNhaXuatBanStore()
const { items: books, loading, error, currentPage, totalItems, totalPages, pageSize } = storeToRefs(bookStore)
const publishers = computed(() => publisherStore.allNhaXuatBans)

const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, totalItems.value))

const props = defineProps<{
  page: number
}>()

// Sorting state
const sortBy = ref('MaSach')
const sortOrder = ref<'asc' | 'desc'>('asc')

const columns = [
  { key: 'MaSach', label: 'STT', sortable: true },
  { key: 'TenSach', label: 'Tên sách', sortable: true },
  { key: 'SoQuyen', label: 'Số lượng', sortable: true },
  { key: 'DonGia', label: 'Đơn giá', sortable: true },
  { key: 'NguonGoc', label: 'Nguồn gốc', sortable: true },
  { key: 'image', label: 'Ảnh bìa', sortable: false },
  { key: 'MaNXB', label: 'Nhà xuất bản', sortable: true },
  { key: 'NamXuatBan', label: 'Năm xuất bản', sortable: true },
  { key: 'actions', label: '', sortable: false },
]



// Sorting function
const sort = (column: string) => {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortOrder.value = 'asc'
  }
  bookStore.fetchBooks(currentPage.value, pageSize.value,
    '',
    sortBy.value,
    sortOrder.value,
  )
}

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
  await refreshBooks()
}

const handleDeleteBook = async (bookId: string) => {
  await bookStore.deleteBook(bookId)
  isDeleteModalOpen.value = false
  await refreshBooks()
}


const getPublisherName = (MaNXB: string) => {
  const publisher = publishers.value.find(p => p.MaNXB === MaNXB)
  return publisher ? publisher.TenNXB : 'Không rõ'
}

const changePage = async (page: number) => {
  await bookStore.fetchBooks(page, pageSize.value,
    "",
    sortBy.value,
    sortOrder.value,
  )
}

const refreshBooks = async () => {
  await bookStore.fetchBooks(currentPage.value, pageSize.value,
    "",
    sortBy.value,
    sortOrder.value,
  )
}

watch(() => props.page, (newPage) => {
  refreshBooks()


}, { immediate: true })

onMounted(() => {
  publisherStore.fetchAllNhaXuatBans()
  refreshBooks()
})
</script>