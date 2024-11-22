<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useBorrowStore } from '@/stores/borrowBookStore'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/dateTime'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@/components/ui/dropdown-menu'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import Spinner from '@/components/Spinner.vue'
import Pagination from '@/components/Pagination.vue'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import BorrowDetails from './BorrowDetails.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ChevronDown, Search } from 'lucide-vue-next'
import { mappingBorrowStatus } from '@/utils/mapping'
import { BorrowStatus, type MuonSach } from '@/types/models'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()

const borrowStore = useBorrowStore()

const { items: borrows, currentPage, totalItems, totalPages, pageSize } = storeToRefs(borrowStore)

const columns = [
    { key: '', label: 'STT' },
    { key: 'Sach.TenSach', label: 'Tên sách' },
    { key: 'Docgia.HoTen', label: 'Tên đọc giả' },
    { key: 'NgayYeuCau', label: 'Ngày yêu cầu' },
    { key: 'NgayMuon', label: 'Ngày mượn' },
    { key: 'NgayTra', label: 'Ngày trả dự kiến' },
    { key: 'status', label: 'Trạng thái' },
]

const searchOptions = [
    { key: "TenSach", label: "Tên sách" },
    { key: 'status', label: 'Trạng thái' },
]

const sortableColumns = [
    { key: "TenSach", label: "Tên sách" },
    { key: "NgayYeuCau", label: "Ngày yêu cầu" },
    { key: 'NgayMuon', label: 'Ngày mượn' },
    { key: 'NgayTra', label: 'Ngày trả' },
    { key: 'status', label: 'Trạng thái' },
    { key: 'updateAt', label: 'Cập nhật cuối' },
]

const sortBy = ref('NgayYeuCau')
const sortOrder = ref<'asc' | 'desc'>('desc')
const searchQuery = ref<string>('')
const searchBy = ref('TenSach')

const selectedBorrow = ref(borrowStore.selectedBorrow)

const isDialogOpen = ref(false)
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, totalItems.value))

const getCurrentSearchByLabel = computed(() => {
    const currentSearchBy = searchOptions.find(option => option.key === searchBy.value)
    return currentSearchBy ? currentSearchBy.label : 'Tên sách'
})

const getCurrentSortLabel = computed(() => {
    const currentSort = sortableColumns.find(column => column.key === sortBy.value)
    return currentSort ? currentSort.label : 'Ngày đăng ký'
})

const openDialog = (borrow: MuonSach) => {
    selectedBorrow.value = borrow
    isDialogOpen.value = true
}

const handleSortChange = async (newSortBy: string) => {
    sortBy.value = newSortBy
    await refreshBorrows()
}

const toggleSortOrder = async () => {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    await refreshBorrows()
}

const refreshBorrows = async () => {
    borrowStore.setSort(sortBy.value, sortOrder.value)
    borrowStore.setSearch(searchQuery.value, searchBy.value)
    await borrowStore.fetchBorrows(currentPage.value)
}

const handleSearchInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    searchQuery.value = value
    if (value === '') {
        debouncedSearch()
    }
}

const handleSearchByChange = async () => {
    searchQuery.value = ''
    await debouncedSearch()
}
const handleStatusChange = (value: string) => {
    searchQuery.value = value
    debouncedSearch()
}

const changePage = async (page: number) => {
    borrowStore.currentPage = page
    await refreshBorrows()
}


const debounce = (fn: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>
    return (...args: any[]) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn(...args), delay)
    }
}

const debouncedSearch = debounce(async () => {
    await refreshBorrows()
}, 500)

watch([searchQuery, searchBy], async () => {
    if (searchQuery.value !== '') {
        await debouncedSearch()
    }
})

const acceptBorrow = async (id: string) => {
    await borrowStore.acceptBorrow(id)
    await refreshBorrows()
    isDialogOpen.value = false
}

const rejectBorrow = async (id: string) => {
    await borrowStore.rejectBorrow(id)
    await refreshBorrows()
    isDialogOpen.value = false

}



const collectedBook = async (id: string) => {
    await borrowStore.collectedBook(id)
    await refreshBorrows()
    isDialogOpen.value = false
}


const returnedBook = async (id: string) => {
    await borrowStore.returnedBook(id)
    await refreshBorrows()
    isDialogOpen.value = false
}

const sendRequestReturnBook = async (id: string) => {
    await borrowStore.sendRequestReturnBook(id)
    toast({
        title: 'Thành công',
        description: 'Gửi yêu cầu trả sách thành công',
    })
    isDialogOpen.value = false
}



onMounted(async () => {
    await borrowStore.fetchBorrows()
})
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle class="flex justify-between items-center">
                Yêu cầu mượn sách
            </CardTitle>
            <div class="mt-4 flex flex-wrap justify-start space-x-2 items-center">
                <div class="flex-grow mb-2 sm:mb-0 sm:mr-2 flex space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button variant="outline" class="w-[200px]">
                                Tìm theo: {{ getCurrentSearchByLabel }}
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
                        <Input v-if="searchBy === 'TenSach'" class="pl-10 w-full" type="search" :placeholder="`Tìm kiếm theo ${getCurrentSearchByLabel.toLowerCase()}...`"
                            v-model="searchQuery as string" @input="handleSearchInput" />
                        <Select v-else v-model="searchQuery as string" @update:model-value="handleStatusChange">
                            <SelectTrigger class="w-full">
                                <SelectValue :placeholder="`Chọn ${getCurrentSearchByLabel.toLowerCase()}...`" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="status in Object.values(BorrowStatus)" :key="status" :value="status">
                                    {{ mappingBorrowStatus(status) }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <span v-if="searchBy === 'TenSach'" class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                            <Search class="size-6 text-muted-foreground" />
                        </span>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button variant="outline" class="w-[220px]">
                            Sắp xếp theo: {{ getCurrentSortLabel }}
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
            <div v-if="borrowStore.loading" class="flex justify-center my-40">
                <Spinner class="h-8 w-8" />
            </div>
            <div v-else-if="totalItems === 0" class="my-40 flex justify-center">
                <p class="text-lg text-gray-500">Không có</p>
            </div>
            <Table v-else>
                <TableHeader>
                    <TableRow>
                        <TableHead v-for="column in columns" :key="column.key">
                            {{ column.label }}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="(borrow, index) in borrows" :key="borrow.MaMuon">
                        <TableCell class="font-medium">{{ index + 1 }}</TableCell>
                        <TableCell>{{ borrow.Sach.TenSach }}</TableCell>
                        <TableCell>{{ borrow.Docgia.HoTen }}</TableCell>
                        <TableCell>{{ formatDate(borrow.NgayYeuCau) }}</TableCell>
                        <TableCell>{{ formatDate(borrow.NgayMuon) }}</TableCell>
                        <TableCell>{{ formatDate(borrow.NgayTra) }}</TableCell>
                        <TableCell class="min-w-36">
                            <span :class="{
                                'px-2 py-1 rounded-full text-xs font-semibold': true,
                                'bg-yellow-100 text-yellow-800': borrow.status === 'PENDING',
                                'bg-green-100 text-green-800': borrow.status === 'ACCEPTED',
                                'bg-blue-100 text-blue-800': borrow.status === 'BORROWED',
                                'bg-red-100 text-red-800': borrow.status === 'REJECTED',
                                'bg-green-100 text-green-600': borrow.status === 'RETURNED',
                                'bg-red-100 text-red-600': borrow.status === 'OVERDUE'

                            }">
                                {{ mappingBorrowStatus(borrow.status) }}
                            </span>
                        </TableCell>
                        <TableCell>
                            <Button @click="openDialog(borrow)" variant="outline" class="bg-blue-500 text-white" size="sm">Xem chi tiết</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
        <CardFooter class="flex justify-between">
            <div class="text-sm text-gray-700 dark:text-gray-400">
                Sách {{ startIndex }} - {{ endIndex }} trong tổng số {{ totalItems }}
            </div>
            <Pagination v-if="totalPages > 1" :total-pages="totalPages" :current-page="currentPage" @change="changePage" />
        </CardFooter>
    </Card>
    <BorrowDetails v-if="selectedBorrow" :isOpen="isDialogOpen" :book="selectedBorrow" @update:isOpen="isDialogOpen = $event" @rejectBorrow="rejectBorrow" @acceptBorrow="acceptBorrow"
        @collectedBook="collectedBook" @returnedBook="returnedBook" @sendRequestReturnBook="sendRequestReturnBook" />
</template>