<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Đổi mật khẩu</DialogTitle>
            </DialogHeader>
            <form @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <div>
                        <Label for="currentPassword">Mật khẩu hiện tại</Label>
                        <Input id="currentPassword" type="password" v-model="form.currentPassword" />
                    </div>
                    <div>
                        <Label for="newPassword">Mật khẩu mới</Label>
                        <Input id="newPassword" type="password" v-model="form.newPassword" />
                    </div>
                    <div>
                        <Label for="rePassword">Xác nhận mật khẩu mới</Label>
                        <Input id="rePassword" type="password" v-model="form.rePassword" />
                    </div>
                </div>
                <DialogFooter class="mt-6">
                    <Button type="submit">Lưu thay đổi</Button>
                    <Error :description="authStore.error" />
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Error from "@/components/Error.vue";
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const emit = defineEmits(['update:open', 'changePassword'])

const form = ref({
    currentPassword: '',
    newPassword: '',
    rePassword: ''
})

const handleSubmit = () => {
    if (form.value.newPassword !== form.value.rePassword) {
        alert('Mật khẩu mới và xác nhận mật khẩu không khớp')
        return
    }
    emit('changePassword', {
        currentPassword: form.value.currentPassword,
        newPassword: form.value.newPassword,
        rePassword: form.value.rePassword
    })
    emit('update:open', false)
    form.value = { currentPassword: '', newPassword: '', rePassword: '' }
    authStore.error = ''
}
</script>