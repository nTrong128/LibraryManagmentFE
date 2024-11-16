<template>
    <Dialog v-model:open="open">
        <DialogTrigger asChild>
            <Button class="bg-indigo-600 hover:bg-indigo-700 text-white">Thêm nhân viên mới</Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Thêm nhà xuất bản mới</DialogTitle>
                <DialogDescription>Nhập thông tin để thêm nhà xuất bản mới vào danh sách</DialogDescription>
            </DialogHeader>
            <form name="addNewNhanVien" @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="username" class="text-right">Username</Label>
                        <Input id="username" v-model="newNhanVien.username" autocomplete="username" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="email" class="text-right">Email</Label>
                        <Input id="email" v-model="newNhanVien.email" type="email" autocomplete="email" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="name" class="text-right">Tên nhân viên</Label>
                        <Input id="name" v-model="newNhanVien.HoTenNV" autocomplete="name" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="address" class="text-right">Địa chỉ</Label>
                        <Input id="address" v-model="newNhanVien.DiaChi" autocomplete="address-level1" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="tel" class="text-right">Số điện thoại</Label>
                        <Input id="tel" v-model="newNhanVien.SoDienThoai" autocomplete="tel" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="work role" class="text-right">Chức vụ</Label>
                        <Input id="work role" v-model="newNhanVien.ChucVu" autocomplete="work" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="work role" class="text-right">Loại tài khoản</Label>
                        <Select name="selectPublisher" v-model="newNhanVien.role" required>
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
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="password" class="text-right">Mật khẩu</Label>
                        <Input id="password" v-model="newNhanVien.password" autocomplete="new-password" type="password" class="col-span-4" required />
                    </div>

                </div>

                <DialogFooter>
                    <Button type="submit" class="bg-green-500 hover:bg-green-700 text-white mt-4" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Đang thực hiện...' : 'Thêm' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useNhanVienStore } from '@/stores/nhanvienStore'
import { Role, type NhanVienSignUp } from '@/types/models'
import { useToast } from '@/components/ui/toast'

const nhanvienStore = useNhanVienStore()


const newNhanVien = ref<NhanVienSignUp>({
} as NhanVienSignUp)

const isSubmitting = ref(false)
const error = ref('')
const open = ref(false)


const { toast } = useToast()

const handleSubmit = async () => {
    if (nhanvienStore.loading) return
    error.value = ''

    try {
        console.log("data:", newNhanVien.value)
        await nhanvienStore.createNhanVien({ ...newNhanVien.value })

        toast({
            title: "Thành công",
            description: "Nhân viên mới đã được thêm vào hệ thống.",
        })

        await nhanvienStore.fetchNhanViens()

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
    newNhanVien.value = {} as NhanVienSignUp

}


watch(() => open.value, (newValue) => {
    if (!newValue) {
        resetForm()
    }
})
</script>