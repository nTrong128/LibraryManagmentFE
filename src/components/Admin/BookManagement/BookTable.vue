<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex justify-between items-center">
        Danh sách sách
      </CardTitle>
      <div class="mt-4 flex flex-wrap justify-start space-x-2 items-center">
        <div class="flex-grow mb-2 sm:mb-0 sm:mr-2 flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" class="w-[150px]">
                Tìm theo: {{ getCurrentSearchByLabel() }}
                <ChevronDown class="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-[150px]">
              <DropdownMenuLabel>Chọn tiêu chí tìm kiếm</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup v-model="searchBy" @update:model-value="handleSearchByChange">
                <DropdownMenuRadioItem v-for="option in searchOptions" :key="option.key" :value="option.key">
                  {{ option.label }}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div class="relative flex-grow w-full items-center">
            <Input class="pl-10 w-full" type="search" :placeholder="`Tìm kiếm theo ${getCurrentSearchByLabel().toLowerCase()}...`" v-model="searchQuery" @input="handleSearchInput" />
            <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
              <Search class="size-6 text-muted-foreground" />
            </span>
          </div>

        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" class="w-[200px]">
              Sắp xếp theo: {{ getCurrentSortLabel() }}
              <ChevronDown class="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-[200px]">
            <DropdownMenuLabel>Chọn tiêu chí sắp xếp</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup v-model="sortBy" @update:model-value="handleSortChange">
              <DropdownMenuRadioItem v-for="column in sortableColumns" :key="column.key" :value="column.key">
                {{ column.label }}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" @click="toggleSortOrder">
          {{ sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần' }}
          <ArrowUpDown class="ml-2 h-4 w-4" />
        </Button>
      </div>
    </CardHeader>

    <CardContent>
      <div v-if="bookStore.loading" class="flex justify-center my-40">
        <Spinner class="h-8 w-8" />
      </div>
      <div v-else-if="totalItems === 0" class="flex justify-center my-40">
        <p class="text-lg text-gray-500 dark:text-gray-400">Không có sách nào</p>
      </div>
      <div v-else>


        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <Card v-for="book in books" :key="book.MaSach" class="flex flex-col">
            <CardHeader>
              <CardTitle class="text-lg font-semibold truncate">{{ book.TenSach }}</CardTitle>
              <CardDescription>{{ getPublisherName(book.MaNXB) }} - {{ book.NamXuatBan }}</CardDescription>
            </CardHeader>
            <CardContent class="flex-grow">
              <AspectRatio :ratio="3 / 4" class="bg-muted mb-4">
                <img v-if="book.image" :src="book.image" :alt="`Bìa sách ${book.TenSach}`" class="rounded-md object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-110"
                  loading="lazy" />
                <div v-else class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Không có ảnh
                </div>
              </AspectRatio>
              <div class="space-y-2">
                <p><strong>Số lượng:</strong> {{ book.SoQuyen }}</p>
                <p><strong>Đơn giá:</strong> {{ book.DonGia }} VNĐ</p>
                <p><strong>Nguồn gốc:</strong> {{ book.NguonGoc }}</p>
              </div>
            </CardContent>
            <CardFooter class="flex justify-end space-x-2">
              <Button variant="outline" size="sm" @click="openEditModal(book)">
                <SquarePen class="h-4 w-4 mr-2" />
                Sửa
              </Button>
              <Button variant="destructive" size="sm" @click="openDeleteModal(book)">
                <Trash2 class="h-4 w-4 mr-2" />
                Xóa
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </CardContent>
    <CardFooter class="flex justify-between">
      <div class="text-sm text-gray-700 dark:text-gray-400">
        Sách {{ startIndex }} - {{ endIndex }} trong tổng số {{ totalItems }}
      </div>
      <Pagination v-if="totalPages > 1" :total-pages="totalPages" :current-page="currentPage" @change="changePage" />
    </CardFooter>
  </Card>

  <EditBookModal v-model:isOpen="isEditModalOpen" />
  <DeleteBookModal v-model:isOpen="isDeleteModalOpen" @delete="handleDeleteBook" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu'
import { SquarePen, Trash2, ChevronDown, ArrowUpDown, Search } from 'lucide-vue-next'
import { useBookStore } from '@/stores/bookStore'
import { useNhaXuatBanStore } from '@/stores/nhaXuatBanStore'
import { Input } from '@/components/ui/input'
import Spinner from '@/components/Spinner.vue'
import EditBookModal from '@/components/Admin/BookManagement/EditBookModal.vue'
import DeleteBookModal from '@/components/Admin/BookManagement/DeleteBookModal.vue'
import Pagination from '@/components/Pagination.vue'
import type { Sach } from '@/types/models'
import { AspectRatio } from '@/components/ui/aspect-ratio'


const bookStore = useBookStore()
const publisherStore = useNhaXuatBanStore()
const { items: books, currentPage, totalItems, totalPages, pageSize } = storeToRefs(bookStore)
const publishers = computed(() => publisherStore.allNhaXuatBans)

const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, totalItems.value))

const sortableColumns = [
  { key: 'TenSach', label: 'Tên sách' },
  { key: 'SoQuyen', label: 'Số lượng' },
  { key: 'DonGia', label: 'Đơn giá' },
  { key: 'NamXuatBan', label: 'Năm xuất bản' },
]

const searchOptions = [
  { key: 'TenSach', label: 'Tên sách' },
  { key: 'NguonGoc', label: 'Nguồn gốc' },
  { key: 'NamXuatBan', label: 'Năm xuất bản' },
]

const sortBy = ref('TenSach')
const sortOrder = ref<'asc' | 'desc'>('asc')
const searchQuery = ref('')
const searchBy = ref('TenSach')


const getCurrentSearchByLabel = () => {
  const currentSearchBy = searchOptions.find(option => option.key === searchBy.value)
  return currentSearchBy ? currentSearchBy.label : 'Tên sách'
}

const getCurrentSortLabel = () => {
  const currentSort = sortableColumns.find(column => column.key === sortBy.value)
  return currentSort ? currentSort.label : 'Tên sách'
}

const handleSortChange = async (newSortBy: string) => {
  sortBy.value = newSortBy
  await refreshBooks()
}

const toggleSortOrder = async () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  await refreshBooks()
}

const openEditModal = (book: Sach) => {
  bookStore.selectBook(book)
  isEditModalOpen.value = true
}

const openDeleteModal = (book: Sach) => {
  bookStore.selectBook(book)
  isDeleteModalOpen.value = true
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
  bookStore.currentPage = page
  await refreshBooks()
}

const refreshBooks = async () => {
  bookStore.setSort(sortBy.value, sortOrder.value)
  bookStore.setSearch(searchQuery.value, searchBy.value)
  await bookStore.fetchBooks(currentPage.value)
}

const handleSearchInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  searchQuery.value = value
  if (value === '') {
    debouncedSearch()
  }
}


const handleSearchByChange = async () => {
  await debouncedSearch()
}


const debounce = (fn: Function, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Debounced search function
const debouncedSearch = debounce(async () => {
  await refreshBooks()
}, 500)

// Watch for changes in the search query or search by option
watch([searchQuery, searchBy], async () => {
  if (searchQuery.value !== '') {
    await debouncedSearch()
  }
})


onMounted(() => {
  bookStore.fetchBooks()
  publisherStore.fetchAllNhaXuatBans()
})
</script>