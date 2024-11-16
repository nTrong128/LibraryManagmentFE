<template>
    <Dialog v-model:open="open">
        <DialogTrigger asChild>
            <Button class="bg-indigo-600 hover:bg-indigo-700 text-white">Thêm đọc giả mới</Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Thêm đọc giả mới</DialogTitle>
                <DialogDescription>Nhập thông tin để thêm đọc giả mới vào hệ thống</DialogDescription>
            </DialogHeader>
            <form name="addnewDocGia" @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="username" class="text-right">Username</Label>
                        <Input id="username" v-model="newDocGia.username" autocomplete="username" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="email" class="text-right">Email</Label>
                        <Input id="email" v-model="newDocGia.email" type="email" autocomplete="email" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="name" class="text-right">Tên đọc giả</Label>
                        <Input id="name" v-model="newDocGia.HoTen" autocomplete="name" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="address" class="text-right">Địa chỉ</Label>
                        <Input id="address" v-model="newDocGia.DiaChi" autocomplete="address-level1" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="tel" class="text-right">Số điện thoại</Label>
                        <Input id="tel" v-model="newDocGia.DienThoai" autocomplete="tel" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="password" class="text-right">Mật khẩu</Label>
                        <Input id="password" v-model="newDocGia.password" autocomplete="new-password" type="password" class="col-span-4" required />
                    </div>
                </div>

                <DialogFooter>
                    <Button type="submit" class="bg-green-500 hover:bg-green-700 text-white mt-4" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Đang thực hiện...' : 'Thêm' }}
                    </Button>
                    <Error v-if="docGiaStore.error" :description="docGiaStore.error || ''">
                    </Error>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDocgiaStore } from '@/stores/docgiaStore'
import { type DocGiaSignUp } from '@/types/models'
import { useToast } from '@/components/ui/toast'
import Error from '@/components/Error.vue'

const docGiaStore = useDocgiaStore()
const newDocGia = ref<DocGiaSignUp>({} as DocGiaSignUp)
const isSubmitting = ref(false)
const error = ref('')
const open = ref(false)


const { toast } = useToast()

const handleSubmit = async () => {
    if (docGiaStore.loading) return
    error.value = ''

    try {
        console.log("data:", newDocGia.value)
        await docGiaStore.createDocgia({ ...newDocGia.value })

        toast({
            title: "Thành công",
            description: "Nhân viên mới đã được thêm vào hệ thống.",
        })

        await docGiaStore.fetchDocgia()

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
    newDocGia.value = {} as DocGiaSignUp
}


watch(() => open.value, (newValue) => {
    if (!newValue) {
        resetForm()
    }
})
</script>