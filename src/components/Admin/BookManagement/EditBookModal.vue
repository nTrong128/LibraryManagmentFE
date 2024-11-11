<template>
    <Dialog :open="isOpen" @update:open="handleOpenChange">
        <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Cập nhật sách</DialogTitle>
                <DialogDescription>
                    Cập nhật thông tin sách, nhấn cập nhật để lưu thay đổi
                </DialogDescription>
            </DialogHeader>
            <form @submit.prevent="handleSubmit">
                <div class="grid gap-4 py-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-4">
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
                        <div class="space-y-4">
                            <Label>Ảnh bìa sách</Label>
                            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer" @dragover.prevent @drop.prevent="handleDrop" @click="$refs.fileInput.click()">
                                <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" accept="image/*" />
                                <div v-if="!imagePreview && !editedBook.image">
                                    <UploadCloudIcon class="mx-auto h-12 w-12 text-gray-400" />
                                    <p class="mt-2 text-sm text-gray-600">Kéo và thả ảnh vào đây hoặc click để chọn file</p>
                                </div>
                                <img v-else :src="imagePreview || editedBook.image" alt="Book cover preview" class="max-w-full h-auto mx-auto" />
                            </div>
                            <div v-if="error" class="text-red-950 font-medium p-2 rounded-sm bg-red-200 flex justify-between">
                                <p>{{ error }}</p>
                                <Button variant="ghost" size="icon" @click="error = ''">
                                    <CircleX class="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
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
import { UploadCloudIcon, CircleX } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast'

const publisherStore = useNhaXuatBanStore()
const publishers = computed(() => publisherStore.allNhaXuatBans)
const { toast } = useToast()


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
    (e: 'save', book: Sach, imageFile?: File): void
}>()

const bookStore = useBookStore()
const selectedBook = computed(() => bookStore.selectedItem)
const loading = computed(() => bookStore.loading)

const editedBook = ref({} as Sach)
const imagePreview = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const imageFile = ref<File | null>(null)
const error = ref('')

watch(() => selectedBook.value, (newValue) => {
    if (newValue) {
        editedBook.value = { ...newValue }
        imagePreview.value = ''
    }
}, { immediate: true })

const handleSubmit = async () => {
    if (bookStore.loading) return

    error.value = ''
    console.log(imageFile.value)
    try {
        console.log(editedBook.value)
        await bookStore.updateBook(editedBook.value.MaSach, { ...editedBook.value }, imageFile.value || undefined)

        toast({
            title: "Thành công",
            description: "Cập nhật sách thành công.",
        })
        emit('update:isOpen', false)

    } catch (err: any) {
        error.value = err.message || 'Thất bại.'
        toast({
            title: "Error",
            description: error.value,
            variant: "destructive",
        })
        emit('update:isOpen', false)
    }
}



const handleOpenChange = (open: boolean) => {
    emit('update:isOpen', open)
    if (!open) {
        editedBook.value = {} as Sach
        imagePreview.value = ''
        imageFile.value = null
        error.value = ''
        bookStore.clearSelectedBook()
    }
}

const handleDrop = (e: DragEvent) => {
    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
        handleFile(files[0])
    }
}

const handleFileChange = (e: Event) => {
    const files = (e.target as HTMLInputElement).files
    if (files && files.length > 0) {
        handleFile(files[0])
    }
}

const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
        imageFile.value = file
        const reader = new FileReader()
        reader.onload = (e) => {
            imagePreview.value = e.target?.result as string
        }
        reader.readAsDataURL(file)
        error.value = ''
    } else {
        error.value = 'Vui lòng chọn một file ảnh.'
    }
}

onMounted(() => {
    publisherStore.fetchAllNhaXuatBans()
})
</script>