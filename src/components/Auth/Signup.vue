<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'

import * as z from 'zod'
import { ref, reactive } from 'vue'
import { toast } from '@/components/ui/toast'
import { AutoForm } from '@/components/ui/auto-form'
import Error from '@/components/Error.vue'
import { useAuthStore } from '@/stores/authStore'

// Step 1 schema - account information
const accountSchema = z.object({
    username: z.string().min(1, { message: 'Vui lòng nhập tài khoản.' }),
    password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu.' }),
    rePassword: z.string().min(1, { message: 'Vui lòng nhập lại mật khẩu.' })
}).refine(
    data => data.password === data.rePassword,
    {
        message: 'Mật khẩu không khớp.',
        path: ['rePassword'],
    }
)

// Step 2 schema - personal information
const personalSchema = z.object({
    HoTen: z.string().min(1, { message: 'Vui lòng nhập họ và tên.' }),
    email: z.string().email({ message: 'Vui lòng nhập email.' }),
    DienThoai: z.string().min(1, { message: 'Vui lòng nhập số điện thoại.' }),
    DiaChi: z.string().min(1, { message: 'Vui lòng nhập địa chỉ.' })
})

// Field configuration for step 1
const accountFieldConfig = {
    username: {
        label: 'Tài khoản',
        description: 'Nhập tên người dùng. Không được trùng với người dùng khác.',
        inputProps: {
            type: 'text',
            placeholder: 'b2106819',
            autoComplete: 'username',
            name: 'username',
        },
    },
    password: {
        label: 'Mật khẩu',
        inputProps: {
            type: 'password',
            autoComplete: 'password',
            placeholder: '••••••••',
            name: 'password',
        }
    },
    rePassword: {
        label: 'Nhập lại mật khẩu',
        inputProps: {
            type: 'password',
            autoComplete: 're-password',
            placeholder: '••••••••',
            name: 'rePassword',
        }
    },
}

// Field configuration for step 2
const personalFieldConfig = {
    HoTen: {
        label: 'Tên',
        inputProps: {
            type: 'text',
            placeholder: 'Văn A',
            autoComplete: 'name',
            name: 'HoTen',
        }
    },
    email: {
        label: 'Email',
        inputProps: {
            type: 'email',
            placeholder: 'example@example.com',
            autoComplete: 'email',
            name: 'email',
        }
    },
    DienThoai: {
        label: 'Số điện thoại',
        inputProps: {
            type: 'tel',
            placeholder: '0939 999 999',
            autoComplete: 'tel',
            name: 'SoDienThoai',
        }
    },
    DiaChi: {
        label: 'Địa chỉ',
        inputProps: {
            type: 'text',
            placeholder: 'Ninh Kiều, Cần Thơ',
            autoComplete: 'address',
            name: 'DiaChi',
        }
    },
}

// Reactive object to store form data across steps
const formData = ref({
    username: '',
    password: '',
    rePassword: '',
    HoTen: '',
    email: '',
    DienThoai: '',
    DiaChi: '',
})

const loading = ref(false)

// Form steps
const currentStep = ref(1)

const nextStep = (values: {
    username: string
    password: string
}) => {
    Object.assign(formData.value, values) // Merge Step 1 values into formData
    currentStep.value += 1
}

const prevStep = () => {
    currentStep.value -= 1
}

const authStore = useAuthStore()

// Submit handler for final step
async function onSubmit(values: {
    HoTen: string
    email: string
    DienThoai: string
    DiaChi: string
}) {
    Object.assign(formData.value, values) // Merge Step 2 values into formData

    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    await authStore.signup(formData.value)

    toast({
        title: 'Đăng ký tài khoản thành công.',
        description: JSON.stringify(formData.value, null, 2),
    })

    console.log(formData.value)

    loading.value = false
}

</script>

<template>
    <div class="w-full mb-4 px-4">
        <!-- Step Text (e.g., "Step 1/2") -->
        <div class="flex justify-center items-center mb-2">
            <span class="text-lg font-medium  text-gray-600">
                Bước {{ currentStep }}/2
            </span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full h-2 bg-gray-200 rounded overflow-hidden">
            <div class="h-full bg-green-500 rounded transition-all duration-500" :style="{ width: currentStep === 1 ? '50%' : (currentStep === 2 ? '100%' : '0%') }"></div>
        </div>
    </div>
    <CardContent class="overflow-scroll max-h-[420px]">
        <!-- Step 1: Account Information -->
        <AutoForm v-if="currentStep === 1" :schema="accountSchema" @submit="nextStep" :field-config="accountFieldConfig">
            <Button class="w-full mt-4 bg-green-500 hover:bg-green-600" type="submit">
                Tiếp theo
            </Button>
        </AutoForm>

        <!-- Step 2: Personal Information -->
        <AutoForm v-if="currentStep === 2" :schema="personalSchema" @submit="onSubmit" :field-config="personalFieldConfig">
            <div class="flex justify-between mt-4">
                <Button :disabled="loading" class="bg-gray-500 hover:bg-gray-600" @click="prevStep">
                    Quay lại
                </Button>
                <Button :disabled="loading" class="bg-green-500 hover:bg-green-600" type="submit">
                    Đăng ký
                </Button>
            </div>
        </AutoForm>
        <Error v-if="authStore.error" :description="authStore.error || ''">
        </Error>
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