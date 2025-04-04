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
                        <Label for="work role" class="text-right">Chức vụ</Label>
                        <Input id="work role" v-model="editedNhanVien.ChucVu" autocomplete="work" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="name" class="text-right">Họ và tên</Label>
                        <Input id="name" v-model="editedNhanVien.HoTenNV" autocomplete="name" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="email" class="text-right">Email</Label>
                        <Input id="email" v-model="editedNhanVien.email" autocomplete="email" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="tel" class="text-right">Số điện thoại</Label>
                        <Input id="tel" v-model="editedNhanVien.SoDienThoai" autocomplete="tel" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="address" class="text-right">Địa chỉ</Label>
                        <Input id="address" v-model="editedNhanVien.DiaChi" autocomplete="address" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="account role" class="text-right">Loại tài khoản</Label>
                        <Select name="account role" v-model="editedNhanVien.role" required>
                            <SelectTrigger id="publisher" class="col-span-4">
                                <SelectValue placeholder="Chọn loại tài khoản" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="role in Role" :key="role" :value="role">
                                    {{ role }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
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
import { useNhanVienStore } from '@/stores/nhanvienStore'
import { Role, type NhanVien } from '@/types/models'
import { useToast } from '@/components/ui/toast'

const nhanvienStore = useNhanVienStore()
const selectedNhanVien = computed(() => nhanvienStore.selectedItem)
const { toast } = useToast()


const props = defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void
    (e: 'save', nhanvien: NhanVien): void
}>()

const loading = computed(() => nhanvienStore.loading)

const editedNhanVien = ref({} as NhanVien)
const error = ref(nhanvienStore.error)


watch(() => selectedNhanVien.value, (newValue) => {
    if (newValue) {
        editedNhanVien.value = { ...newValue }
    }
}, { immediate: true })

const handleSubmit = async () => {
    if (nhanvienStore.loading) return
    error.value = ''

    try {
        const result = await nhanvienStore.updateNhanVien(editedNhanVien.value.MSNV, { ...editedNhanVien.value })
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
        editedNhanVien.value = {} as NhanVien
        error.value = ''
        nhanvienStore.clearSelectedNhanVien()
    }
}

const refreshNhanViens = async () => {
    await nhanvienStore.fetchNhanViens()
}
</script>