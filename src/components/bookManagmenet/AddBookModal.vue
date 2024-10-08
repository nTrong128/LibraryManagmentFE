<template>
    <Dialog v-model:open="open">
        <DialogTrigger asChild>
            <Button class="bg-indigo-600 hover:bg-indigo-700 text-white">Add Book</Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Thêm sách mới</DialogTitle>
                <DialogDescription>Nhập thông tin để thêm sách mới vào danh sách</DialogDescription>
            </DialogHeader>
            <form name="addNewBook" @submit.prevent="handleSubmit">
                <div class="grid gap-4 py-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="title" class="text-right">Tựa đề</Label>
                        <Input id="title" v-model="newBook.TenSach" class="col-span-3" required />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="author" class="text-right">Nguồn gốc / Tác giả</Label>
                        <Input id="author" v-model="newBook.NguonGoc" class="col-span-3" required />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="publisher" class="text-right">Nhà xuất bản</Label>
                        <Select name="selectPublisher" v-model="newBook.MaNXB" required>
                            <SelectTrigger id="publisher" class="col-span-3">
                                <SelectValue placeholder="Chọn nhà xuất bản" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="publisher in publishers" :key="publisher.MaNXB" :value="publisher.MaNXB">
                                    {{ publisher.TenNXB }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="price" class="text-right">Đơn giá</Label>
                        <Input id="price" type="number" v-model="newBook.DonGia" class="col-span-3" required min="0" step="1000" />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="quantity" class="text-right">Số lượng sách</Label>
                        <Input id="quantity" type="number" v-model="newBook.SoQuyen" class="col-span-3" required min="1" />
                    </div>
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="year" class="text-right">Năm xuất bản</Label>
                        <Input id="year" type="number" v-model="newBook.NamXuatBan" class="col-span-3" required :min="1900" :max="currentYear" />
                    </div>
                </div>

                <AlertDialog :open="!!error" @update:open="error = ''">
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Error</AlertDialogTitle>
                            <AlertDialogDescription>{{ error }}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button @click="error = ''">OK</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <DialogFooter>
                    <Button type="submit" class="bg-green-500 hover:bg-green-700 text-white" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Đang thực hiện...' : 'Thêm' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useBookStore } from '@/stores/bookStore'
import { useNhaXuatBanStore } from '@/stores/nhaXuatBanStore'
import type { Sach } from '@/types/models'


const bookStore = useBookStore()
const publisherStore = useNhaXuatBanStore()

const publishers = computed(() => publisherStore.allNhaXuatBans)
const currentYear = new Date().getFullYear()

const newBook = ref<Omit<Sach, "MaSach" | "createAt" | "deleted" | "updateAt">>({
    TenSach: '',
    DonGia: 0,
    SoQuyen: 1,
    NamXuatBan: currentYear,
    MaNXB: '',
    NguonGoc: '',
})

const error = ref('')
const isSubmitting = ref(false)
const open = ref(false)

const handleSubmit = async () => {
    if (isSubmitting.value) return

    error.value = ''
    isSubmitting.value = true

    try {
        // FIXME: remove this later
        await new Promise((resolve) => setTimeout(resolve, 0)); // Simulate loading time

        const addedBook = await bookStore.createBook({ ...newBook.value })

        open.value = false
        resetForm()
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to add book.'
    } finally {
        isSubmitting.value = false
    }
}

const resetForm = () => {
    newBook.value = {
        TenSach: '',
        DonGia: 0,
        SoQuyen: 1,
        NamXuatBan: currentYear,
        MaNXB: '',
        NguonGoc: '',
    }
}
</script>