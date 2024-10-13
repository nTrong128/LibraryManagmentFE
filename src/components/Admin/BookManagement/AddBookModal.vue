<template>
    <Dialog v-model:open="open">
        <DialogTrigger asChild>
            <Button class="bg-indigo-600 hover:bg-indigo-700 text-white">Add Book</Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[800px]">
            <DialogHeader>
                <DialogTitle>Thêm sách mới</DialogTitle>
                <DialogDescription>Nhập thông tin để thêm sách mới vào danh sách</DialogDescription>
            </DialogHeader>
            <form name="addNewBook" @submit.prevent="handleSubmit">
                <div class="grid grid-cols-2 gap-6 py-4">
                    <div class="space-y-4">
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
                    <div class="space-y-4">
                        <Label>Ảnh bìa sách</Label>
                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer" @dragover.prevent @drop.prevent="handleDrop" @click="$refs.fileInput.click()">
                            <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" accept="image/*" />
                            <div v-if="!imagePreview">
                                <UploadCloudIcon class="mx-auto h-12 w-12 text-gray-400" />
                                <p class="mt-2 text-sm text-gray-600">Kéo và thả ảnh vào đây hoặc click để chọn file</p>
                            </div>
                            <img v-else :src="imagePreview" alt="Book cover preview" class="max-w-full h-auto mx-auto" />
                        </div>
                        <div v-if="error" class="text-red-950 font-medium p-2 rounded-sm bg-red-200 flex justify-between">
                            <p>{{ error }}</p>
                            <CircleX />
                        </div>
                    </div>
                </div>


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
import { ref, computed, watch } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UploadCloudIcon } from 'lucide-vue-next'
import { useBookStore } from '@/stores/bookStore'
import { useNhaXuatBanStore } from '@/stores/nhaXuatBanStore'
import type { Sach } from '@/types/models'
import { useToast } from '@/components/ui/toast'
import { CircleX } from 'lucide-vue-next'

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
    image: '', // New field for book cover image URL
})

const isSubmitting = ref(false)
const error = ref('')
const open = ref(false)
const imagePreview = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const imageFile = ref<File | null>(null)

const { toast } = useToast()

const handleSubmit = async () => {
    if (bookStore.loading) return
    if (!fileInput.value || !fileInput.value.files || fileInput.value.files.length === 0) {
        error.value = 'Vui lòng thêm ảnh bìa.'
        return
    }
    error.value = ''
    console.log(imageFile.value)
    try {
        const addedBook = await bookStore.createBook({ ...newBook.value }, imageFile.value || undefined)

        toast({
            title: "Thành công",
            description: "Sách đã được thêm vào hệ thống.",
        })

        open.value = false
        resetForm()
    } catch (err: any) {
        error.value = err.message || 'Thất bại.'
        toast({
            title: "Error",
            description: error.value,
            variant: "destructive",
        })
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
        image: '',
    }
    imagePreview.value = ''
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const handleDrop = (e: DragEvent) => {
    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
        handleFile(files[0])
    }
}

const handleFileChange = (e: Event) => {
    error.value = ''
    const files = (e.target as HTMLInputElement).files
    if (files && files.length > 0) {
        handleFile(files[0])
    }
}

const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
        imageFile.value = file // Set the imageFile ref
        const reader = new FileReader()
        reader.onload = (e) => {
            imagePreview.value = e.target?.result as string
        }
        reader.readAsDataURL(file)
    } else {
        error.value = 'Please select an image file.'
    }
}


watch(() => open.value, (newValue) => {
    if (!newValue) {
        resetForm()
    }
})
</script>