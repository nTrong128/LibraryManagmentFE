<template>
    <Card>
        <CardHeader>
            <CardTitle class="flex justify-between items-center">
                Danh sách nhân viên
            </CardTitle>
            <div class="mt-4 flex flex-wrap justify-start space-x-2 items-center">
                <div class="flex-grow mb-2 sm:mb-0 sm:mr-2 flex space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" class="w-[200px]">
                                Tìm theo: {{ getCurrentSearchByLabel() }}
                                <ChevronDown class="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent class="w-[200px]">
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
                        <Button variant="outline" class="w-[220px]">
                            Sắp xếp theo: {{ getCurrentSortLabel() }}
                            <ChevronDown class="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-[220px]">
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

            <div v-if="nhanvienStore.loading" class="flex justify-center my-40">
                <Spinner class="h-8 w-8" />
            </div>
            <Table v-else>
                <div v-if="totalItems === 0" class="flex justify-center my-40">
                    <p class="text-lg text-gray-500 dark:text-gray-400">Không có nhân viên nào</p>
                </div>
                <TableHeader v-else>
                    <TableRow>
                        <TableHead v-for="column in columns" :key="column.key">
                            {{ column.label }}
                        </TableHead>
                    </TableRow>
                </TableHeader>


                <TableBody>
                    <TableRow class="" v-for="(nhanvien, index) in nhanviens" :key="nhanvien.MSNV">
                        <TableCell>{{ (currentPage - 1) * pageSize + index + 1 }}</TableCell>
                        <TableCell>{{ nhanvien.MSNV }}</TableCell>
                        <TableCell>{{ nhanvien.username }}</TableCell>
                        <TableCell>{{ nhanvien.email }}</TableCell>
                        <TableCell class="text-clip overflow-hidden ...">{{ nhanvien.HoTenNV }}</TableCell>
                        <TableCell>{{ nhanvien.DiaChi }}</TableCell>
                        <TableCell>{{ nhanvien.SoDienThoai }}</TableCell>
                        <TableCell>{{ nhanvien.ChucVu }}</TableCell>
                        <TableCell>{{ nhanvien.role }}</TableCell>
                        <TableCell>{{ formatTimestamp(nhanvien.updateAt) }}</TableCell>
                        <TableCell>
                            <div class="flex justify-center align-middle space-x-2">
                                <Button class="rounded-full px-2 bg-indigo-400 hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-800" @click="openEditModal(nhanvien)">
                                    <SquarePen class="dark:text-slate-200" />
                                </Button>
                                <Button class="rounded-full px-2 bg-rose-500 hover:bg-rose-600 dark:bg-rose-500 dark:hover:bg-rose-800" @click="openDeleteModal(nhanvien)">
                                    <Trash2 class="dark:text-slate-200" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
        <CardFooter class="flex justify-between">
            <!-- Pagination controls -->
            <div class="text-sm text-gray-700 dark:text-gray-400">
                Sách {{ startIndex }} - {{ endIndex }} trong tổng số {{ totalItems }}
            </div>
            <Pagination v-if="totalPages > 1" :total-pages="totalPages" :current-page="currentPage" @change="changePage" />

        </CardFooter>
    </Card>

    <EditEmployee v-model:isOpen="isEditModalOpen" />
    <DeleteEmployee v-model:isOpen="isDeleteModalOpen" @delete="handleDeleteNhanVien" />

</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SquarePen, Trash2, ArrowUpDown, ChevronDown, Search } from 'lucide-vue-next'
import { useNhanVienStore } from '@/stores/nhanvienStore'
import DeleteEmployee from "@/components/Admin/EmployeeManagement/DeleteEmployee.vue"
import EditEmployee from "@/components/Admin/EmployeeManagement/EditEmployee.vue"
import Spinner from '@/components/Spinner.vue'
import { formatTimestamp } from '@/utils/dateTime'
import Pagination from '@/components/Pagination.vue'
import type { NhanVien } from '@/types/models'


const nhanvienStore = useNhanVienStore()
const { items: nhanviens, currentPage, totalItems, totalPages, pageSize } = storeToRefs(nhanvienStore)



const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, totalItems.value))

const columns = [
    { key: '', label: 'STT' },
    { key: 'MSNV', label: 'Mã số nhân viên' },
    { key: 'username', label: 'Tên tài khoản' },
    { key: 'email', label: 'Email' },
    { key: 'HoTenNV', label: 'Tên nhân viên' },
    { key: 'DiaChi', label: 'Địa chỉ' },
    { key: 'SoDienThoai', label: 'Số điện thoại' },
    { key: 'ChucVu', label: 'Chức vụ' },
    { key: 'role', label: 'Mức tài khoản' },
    { key: 'updateAt', label: 'Cập nhật cuối' },
]

const searchOptions = [
    { key: 'HoTenNV', label: 'Tên nhân viên' },
    { key: 'MSNV', label: 'Mã số nhân viên' },
    { key: 'username', label: 'Tên tài khoản' },
    { key: 'email', label: 'Email' },
    { key: 'DiaChi', label: 'Địa chỉ' },
    { key: 'ChucVu', label: 'Chức vụ' },
    { key: 'updateAt', label: 'Cập nhật cuối' },
]

const sortableColumns = [
    { key: 'HoTenNV', label: 'Tên nhân viên' },
    { key: 'MSNV', label: 'Mã số nhân viên' },
    { key: 'username', label: 'Tên tài khoản' },
    { key: 'email', label: 'Email' },
    { key: 'DiaChi', label: 'Địa chỉ' },
    { key: 'ChucVu', label: 'Chức vụ' },
    { key: 'updateAt', label: 'Cập nhật cuối' },
    { key: 'deleted', label: 'Đã xóa' },
]

const sortBy = ref('HoTenNV')
const sortOrder = ref<'asc' | 'desc'>('asc')
const searchQuery = ref('')
const searchBy = ref('HoTenNV')


const getCurrentSearchByLabel = () => {
    const currentSearchBy = searchOptions.find(option => option.key === searchBy.value)
    return currentSearchBy ? currentSearchBy.label : 'Tên nhân viên'
}

const getCurrentSortLabel = () => {
    const currentSort = sortableColumns.find(column => column.key === sortBy.value)
    return currentSort ? currentSort.label : 'Tên nhân viên'
}


const handleSortChange = async (newSortBy: string) => {
    sortBy.value = newSortBy
    await refreshNhanViens()
}

const toggleSortOrder = async () => {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    await refreshNhanViens()
}

const openEditModal = (nhanvien: NhanVien) => {
    nhanvienStore.selectNhanVien(nhanvien)
    isEditModalOpen.value = true
}

const openDeleteModal = (nhanvien: NhanVien) => {
    nhanvienStore.selectNhanVien(nhanvien)
    isDeleteModalOpen.value = true
}


const handleDeleteNhanVien = async (id: string) => {
    await nhanvienStore.deleteNhanVien(id)
    isDeleteModalOpen.value = false
    await refreshNhanViens()
}

const changePage = async (page: number) => {
    nhanvienStore.currentPage = page
    await refreshNhanViens()

}

const refreshNhanViens = async () => {
    nhanvienStore.setSort(sortBy.value, sortOrder.value)
    nhanvienStore.setSearch(searchQuery.value, searchBy.value)
    await nhanvienStore.fetchNhanViens(currentPage.value)
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
    await refreshNhanViens()
}, 500)

// Watch for changes in the search query or search by option
watch([searchQuery, searchBy], async () => {
    if (searchQuery.value !== '') {
        await debouncedSearch()
    }
})


onMounted(async () => {
    await nhanvienStore.fetchNhanViens()
})
</script>