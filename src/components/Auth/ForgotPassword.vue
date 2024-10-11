<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardFooter } from '@/components/ui/card'

const router = useRouter()

const email = ref('')
const error = ref('')
const successMessage = ref('')

const handleResetPassword = () => {
    // Reset error and success message
    error.value = ''
    successMessage.value = ''

    // Validate email
    if (!email.value.trim()) {
        error.value = 'Email is required'
        return
    }

    if (!/\S+@\S+\.\S+/.test(email.value)) {
        error.value = 'Email is invalid'
        return
    }

    // Implement password reset logic here
    console.log('Password reset requested for:', email.value)
    // Simulating a successful password reset request
    successMessage.value = 'Password reset instructions have been sent to your email.'
    // In a real application, you would make an API call here
}

const navigateToLogin = () => {
    router.push('/login')
}
</script>

<template>
    <CardContent>
        <form @submit.prevent="handleResetPassword" class="grid gap-4">
            <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
                <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
                <p v-if="successMessage" class="text-sm text-green-500">{{ successMessage }}</p>
            </div>
            <Button type="submit" class="w-full bg-green-500 hover:bg-green-700">
                Reset Password
            </Button>
        </form>
    </CardContent>
    <CardFooter>
        <div class="w-full text-center text-sm">
            Nhớ mật khẩu rồi à?
            <router-link to="/login" class="underline text-green-500 hover:text-green-700 ">
                Đăng nhập
            </router-link>
            <div class="w-full text-center text-sm">
                Về
                <router-link to="/" class="underline text-green-500 hover:text-green-700 ">
                    Trang chủ
                </router-link>
            </div>
        </div>
    </CardFooter>
</template>