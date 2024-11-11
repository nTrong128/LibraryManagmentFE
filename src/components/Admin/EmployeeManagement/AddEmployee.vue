<template>
    <Dialog v-model:open="open">
        <DialogTrigger asChild>
            <Button class="bg-indigo-600 hover:bg-indigo-700 text-white">Thêm sách mới</Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Thêm nhà xuất bản mới</DialogTitle>
                <DialogDescription>Nhập thông tin để thêm nhà xuất bản mới vào danh sách</DialogDescription>
            </DialogHeader>
            <form name="addNewNhaXuatBan" @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="title" class="text-right">Tên nhà xuất bản</Label>
                        <Input id="title" v-model="newNhaXuatBan.TenNXB" class="col-span-4" required />
                    </div>
                    <div class="grid grid-cols-5 items-center gap-4">
                        <Label for="address" class="text-right">Địa chỉ</Label>
                        <Input id="address" v-model="newNhaXuatBan.DiaChi" class="col-span-4" required />
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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useNhaXuatBanStore } from '@/stores/nhaXuatBanStore'
import type { NhaXuatBan } from '@/types/models'
import { useToast } from '@/components/ui/toast'

const nhaXuatBanStore = useNhaXuatBanStore()


const newNhaXuatBan = ref<Omit<NhaXuatBan, "MaNXB" | "createAt" | "deleted" | "updateAt">>({
    TenNXB: '',
    DiaChi: '',
})

const isSubmitting = ref(false)
const error = ref('')
const open = ref(false)


const { toast } = useToast()

const handleSubmit = async () => {
    if (nhaXuatBanStore.loading) return
    error.value = ''

    try {
        await nhaXuatBanStore.createNhaXuatBan({ ...newNhaXuatBan.value })

        toast({
            title: "Thành công",
            description: "Nhà xuất bản đã được thêm vào hệ thống.",
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
    newNhaXuatBan.value = {
        TenNXB: '',
        DiaChi: '',
    }

}


watch(() => open.value, (newValue) => {
    if (!newValue) {
        resetForm()
    }
})
</script>