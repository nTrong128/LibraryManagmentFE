<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardFooter } from '@/components/ui/card'

const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = () => {
    console.log('Login attempted with:', email.value, password.value)
    // Implement your login logic here
    // After successful login, you might want to redirect to a dashboard or home page
    // router.push('/dashboard')
}

const handleGoogleLogin = () => {
    console.log('Google login attempted')
    // Implement Google login logic here
}

const navigateToForgotPassword = () => {
    router.push('/forgot-password')
}

const navigateToSignUp = () => {
    router.push('/signup')
}
</script>

<template>
    <CardContent>
        <form @submit.prevent="handleLogin" class="grid gap-4">
            <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
            </div>
            <div class="grid gap-2">
                <div class="flex items-center">
                    <Label for="password">Password</Label>
                    <!-- <button type="button" @click="navigateToForgotPassword" class="ml-auto inline-block text-sm underline">
                        Forgot your password?
                    </button> -->
                    <router-link to="/forgot-password" class="ml-auto inline-block text-sm underline text-green-500 hover:text-green-700 ">
                        Quên mật khẩu?
                    </router-link>
                </div>
                <Input id="password" v-model="password" type="password" required />
            </div>
            <Button type="submit" class="w-full bg-green-500 hover:bg-green-700">
                Login
            </Button>

            <!-- TODO: Add Google login button -->
            <!-- <Button type="button" variant="outline" class="w-full " @click="handleGoogleLogin">
                Login with Google
            </Button> -->
        </form>
    </CardContent>
    <CardFooter>
        <div class="w-full text-center text-sm">
            Chưa có tài khoản?
            <router-link to="/signup" class="underline text-green-500 hover:text-green-700 ">
                Đăng ký
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