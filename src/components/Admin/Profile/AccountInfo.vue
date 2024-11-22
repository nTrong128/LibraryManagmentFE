<template>
    <Card>
        <CardHeader>
            <CardTitle>Thông tin tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="space-y-2">
                <p><strong>Email:</strong> {{ user.email }}</p>
                <p><strong>Tên đăng nhập:</strong> {{ user.username }}</p>
                <p><strong>Ngày tạo tài khoản:</strong> {{ formatDate(user.createAt) }}</p>
            </div>
        </CardContent>
        <CardFooter class="space-x-4">
            <Button @click="openChangePasswordDialog">Đổi mật khẩu</Button>
            <Button @click="$emit('edit')">Cập nhật</Button>
        </CardFooter>
    </Card>

    <ChangePasswordDialog v-model:open="isChangePasswordDialogOpen" @changePassword="handleChangePassword" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ChangePasswordDialog from '@/components/Admin/Profile/ChangePassworDialog.vue'
import type { TaiKhoan } from '@/types/models'
import { formatDate } from '@/utils/dateTime'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from '@/components/ui/toast'

const props = defineProps<{
    user: TaiKhoan
}>()

const { toast } = useToast()

const authStore = useAuthStore()
const error = ref(authStore.error)

const emit = defineEmits(['edit'])

const isChangePasswordDialogOpen = ref(false)

const openChangePasswordDialog = () => {
    isChangePasswordDialogOpen.value = true
}

const handleChangePassword = async (passwordData: { currentPassword: string; newPassword: string; rePassword: string }) => {
    if (authStore.loading) return
    error.value = ''
    try {
        console.log(passwordData)
        await authStore.changePassword(passwordData)

        if (authStore.error) {
            error.value = authStore.error
            toast({
                title: "Error",
                description: error.value as string,
                variant: "destructive",
            })
            return
        } else {
            toast({
                title: "Success",
                description: "Đổi mật khẩu thành công.",
                variant: "success",
            })
        }


        isChangePasswordDialogOpen.value = false

    } catch (err: any) {
        error.value = err.message || 'Thất bại.'
        toast({
            title: "Error",
            description: error.value as string,
            variant: "destructive",
        })
    }
}   
</script>