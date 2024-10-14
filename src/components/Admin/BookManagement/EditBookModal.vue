<template>
    <Dialog :open="isOpen" @update:open="handleOpenChange">
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Cập nhật sách</DialogTitle>
                <DialogDescription>
                    Cập nhật thông tin sách, nhấn cập nhật để lưu thay đổi
                </DialogDescription>
            </DialogHeader>
            <form @submit.prevent="handleSubmit">
                <div class="grid gap-4 py-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="tensach" class="text-right">Tên sách</Label>
                        <Input id="tensach" v-model="editedBook.TenSach" class="col-span-3" />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="quantity" class="text-right">Số lượng</Label>
                        <Input id="quantity" v-model="editedBook.SoQuyen" type="number" class="col-span-3" />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="price" class="text-right">Đơn giá</Label>
                        <Input id="price" v-model="editedBook.DonGia" type="number" class="col-span-3" />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="origin" class="text-right">Tác giả/ <br> Nguồn gốc</Label>
                        <Input id="origin" v-model="editedBook.NguonGoc" class="col-span-3" />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="publisher" class="text-right">Nhà xuất bản</Label>
                        <Select name="selectPublisher" v-model="editedBook.MaNXB" required>
                            <SelectTrigger id="publisher" class="col-span-3">
                                <SelectValue placeholder="Chọn nhà xuất bản" />
                            </SelectTrigger>
                            <SelectContent>
                                <Input v-model="searchTerm" placeholder="Tìm nhà xuất bản" />
                                <SelectItem v-for="publisher in filteredPublishers" :key="publisher.MaNXB" :value="publisher.MaNXB">
                                    {{ publisher.TenNXB }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="year" class="text-right">Năm xuất bản</Label>
                        <Input id="year" v-model="editedBook.NamXuatBan" type="number" class="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" :disabled="loading" class="bg-green-500 hover:bg-green-700">
                        {{ loading ? 'Đang lưu thay đổi ...' : 'Cập nhật' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBookStore } from '@/stores/bookStore'
import { useNhaXuatBanStore } from '@/stores/nhaXuatBanStore'
import type { Sach } from '@/types/models'



const publisherStore = useNhaXuatBanStore()
const publishers = computed(() => publisherStore.allNhaXuatBans)


const searchTerm = ref('');

const filteredPublishers = computed(() => {
    return publishers.value.filter(publisher =>
        publisher.TenNXB.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
});



const props = defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void
    (e: 'save', book: any): void
}>()

const bookStore = useBookStore()
const selectedBook = computed(() => bookStore.selectedItem)
const loading = computed(() => bookStore.loading)

const editedBook = ref({} as Sach)

watch(() => selectedBook.value, (newValue) => {
    if (newValue) {
        editedBook.value = { ...newValue }
    }
}, { immediate: true })

const handleSubmit = () => {
    emit('save', editedBook.value)
}

const handleOpenChange = (open: boolean) => {
    emit('update:isOpen', open)
    if (!open) {
        editedBook.value = {} as Sach
        bookStore.clearSelectedBook()
    }
}
onMounted(
    () => {
        publisherStore.fetchAllNhaXuatBans()
    }
)
</script>