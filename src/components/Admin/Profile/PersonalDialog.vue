<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Cập nhật tài khoản</DialogTitle>
            </DialogHeader>
            <form @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <div>
                        <Label for="HoTenNV">Họ và Tên</Label>
                        <Input id="HoTenNV" v-model="form.HoTenNV" />
                    </div>
                    <div>
                        <Label for="SoDienThoai">Số điện thoại</Label>
                        <Input id="SoDienThoai" v-model="form.SoDienThoai" />
                    </div>
                    <div>
                        <Label for="NgaySinh">Ngày sinh</Label>
                        <Input id="NgaySinh" type="date" v-model="form.NgaySinh" />
                    </div>
                    <div>
                        <Label for="DiaChi">Địa chỉ</Label>
                        <Textarea id="DiaChi" v-model="form.DiaChi" />
                    </div>
                </div>
                <DialogFooter class="mt-6">
                    <Button type="submit">Cập nhật</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const props = defineProps<{
    open: boolean
    user: {
        HoTenNV: string
        SoDienThoai: string
        NgaySinh: string
        DiaChi: string
    }
}>()

const emit = defineEmits(['update:open', 'update'])

const form = ref({
    HoTenNV: props.user.HoTenNV,
    SoDienThoai: props.user.SoDienThoai,
    NgaySinh: props.user.NgaySinh,
    DiaChi: props.user.DiaChi,
})

watch(() => props.open, (newValue) => {
    if (newValue) {
        form.value = {
            HoTenNV: props.user.HoTenNV,
            SoDienThoai: props.user.SoDienThoai,
            NgaySinh: props.user.NgaySinh,
            DiaChi: props.user.DiaChi,
        }
    }
})

const handleSubmit = () => {
    emit('update', form.value)
    emit('update:open', false)
}
</script>