<template>
    <Dialog :open="isOpen" @update:open="handleOpenChange">
        <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Cập nhật nhân viên</DialogTitle>
                <DialogDescription>
                    Cập nhật thông tin nhân viên, nhấn cập nhật để lưu thay đổi
                </DialogDescription>
            </DialogHeader>
            <form @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="name" class="text-right">Tên đọc giả</Label>
                        <Input id="name" v-model="editedDocGia.HoTen" autocomplete="name" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="tel" class="text-right">Số điện thoại</Label>
                        <Input id="tel" v-model="editedDocGia.DienThoai" autocomplete="tel" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="email" class="text-right">Email</Label>
                        <Input id="email" v-model="editedDocGia.email" autocomplete="email" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="address" class="text-right">Địa chỉ</Label>
                        <Input id="address" v-model="editedDocGia.DiaChi" autocomplete="address" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="dob" class="text-right">Ngày sinh</Label>
                        <DatePicker label="Chọn ngày" placeholder="Ngày/Tháng/Năm" class="col-span-4" v-model="editedDocGia.NgaySinh" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="account role" class="text-right">Giới tính</Label>
                        <Select name="account role" v-model="editedDocGia.Phai" required>
                            <SelectTrigger id="publisher" class="col-span-4">
                                <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem :value="Gender.MALE">
                                    Nam
                                </SelectItem>
                                <SelectItem :value="Gender.FEMALE">
                                    Nữ
                                </SelectItem>
                                <SelectItem :value="Gender.OTHER">
                                    Khác
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </div>
                <DialogFooter>
                    <Button type="submit" :disabled="loading" class="bg-green-500 mt-4 hover:bg-green-700">
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
import { useDocgiaStore } from '@/stores/docgiaStore'
import { type Docgia, Gender } from '@/types/models'
import { useToast } from '@/components/ui/toast'
import { convertToISODateTime } from '@/utils/dateTime'

import DatePicker from "@/components/ui/DatePicker.vue"


const docGiaStore = useDocgiaStore()
const selectedDocGia = computed(() => docGiaStore.selectedItem)
const { toast } = useToast()


const props = defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void
    (e: 'save', nhanvien: Docgia): void
}>()

const loading = computed(() => docGiaStore.loading)

const editedDocGia = ref({} as Docgia)
const error = ref(docGiaStore.error)




watch(() => selectedDocGia.value, (newValue) => {
    if (newValue) {
        editedDocGia.value = { ...newValue }
    }
}, { immediate: true })

const handleSubmit = async () => {
    if (docGiaStore.loading) return
    error.value = ''
    if (editedDocGia.value.NgaySinh) {
        editedDocGia.value.NgaySinh = convertToISODateTime(new Date(editedDocGia.value.NgaySinh))
    }
    try {
        const result = await docGiaStore.updateDocgia(editedDocGia.value.MaDocGia, { ...editedDocGia.value })
        if (result?.data.data) {
            toast({
                title: "Thành công",
                description: "Cập nhật nhà xuất thành công.",
            })
        }
        await refreshNhanViens()
        emit('update:isOpen', false)

    } catch (err: any) {
        error.value = err.message || 'Thất bại.'
        toast({
            title: "Error",
            description: error.value || 'Thất bại.',
            variant: "destructive",
        })
        emit('update:isOpen', false)
    }
}



const handleOpenChange = (open: boolean) => {
    emit('update:isOpen', open)
    if (!open) {
        editedDocGia.value = {} as Docgia
        error.value = ''
        docGiaStore.clearSelectedDocgia()
    }
}

const refreshNhanViens = async () => {
    await docGiaStore.fetchDocgia()
}



</script>
