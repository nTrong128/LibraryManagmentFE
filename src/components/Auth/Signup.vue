<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardFooter } from '@/components/ui/card'

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const errors = ref<Record<'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword', string>>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const handleSignup = () => {
    // Reset errors
    Object.keys(errors.value).forEach(key => errors.value[key as keyof typeof errors.value] = '')

    // Validate form
    let isValid = true

    if (!firstName.value.trim()) {
        errors.value.firstName = 'First name is required'
        isValid = false
    }

    if (!lastName.value.trim()) {
        errors.value.lastName = 'Last name is required'
        isValid = false
    }

    if (!email.value.trim()) {
        errors.value.email = 'Email is required'
        isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
        errors.value.email = 'Email is invalid'
        isValid = false
    }

    if (password.value.length < 8) {
        errors.value.password = 'Password must be at least 8 characters long'
        isValid = false
    }

    if (password.value !== confirmPassword.value) {
        errors.value.confirmPassword = 'Passwords do not match'
        isValid = false
    }

    if (isValid) {
        console.log('Signup attempted with:', {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value
        })
        // Implement your signup logic here
        // After successful signup, you might want to redirect to a login page or dashboard
        // router.push('/login')
    }
}

const navigateToLogin = () => {
    router.push('/login')
}
</script>

<template>
    <CardContent>
        <form @submit.prevent="handleSignup" class="grid gap-4">
            <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                    <Label for="firstName">First Name</Label>
                    <Input id="firstName" v-model="firstName" type="text" required />
                    <p v-if="errors.firstName" class="text-sm text-red-500">{{ errors.firstName }}</p>
                </div>
                <div class="grid gap-2">
                    <Label for="lastName">Last Name</Label>
                    <Input id="lastName" v-model="lastName" type="text" required />
                    <p v-if="errors.lastName" class="text-sm text-red-500">{{ errors.lastName }}</p>
                </div>
            </div>
            <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
                <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
            </div>
            <div class="grid gap-2">
                <Label for="password">Password</Label>
                <Input id="password" v-model="password" type="password" required />
                <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
            </div>
            <div class="grid gap-2">
                <Label for="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" v-model="confirmPassword" type="password" required />
                <p v-if="errors.confirmPassword" class="text-sm text-red-500">{{ errors.confirmPassword }}</p>
            </div>
            <Button type="submit" class="w-full bg-green-500 hover:bg-green-700">
                Đăng ký
            </Button>
        </form>
    </CardContent>
    <CardFooter>
        <div class="w-full text-center text-sm">
            Đã có tài khoản?
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