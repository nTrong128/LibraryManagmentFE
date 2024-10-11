<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'

import * as z from 'zod'
import { ref } from 'vue'
import { toast } from '@/components/ui/toast'
import { AutoForm } from '@/components/ui/auto-form'
import { errorMessages } from 'vue/compiler-sfc'

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
    ho: z.string().min(1, { message: 'Vui lòng nhập họ.' }),
    ten: z.string().min(1, { message: 'Vui lòng nhập tên.' }),
    email: z.string().email({ message: 'Vui lòng nhập email.' }),
    sdt: z.string().min(1, { message: 'Vui lòng nhập số điện thoại.' }),
    diachi: z.string().min(1, { message: 'Vui lòng nhập địa chỉ.' })
})

// Field configuration for step 1
const accountFieldConfig = {
    username: {
        label: 'Tài khoản',
        description: 'Nhập tên người dùng. Không được trùng với người dùng khác.',
        inputProps: {
            type: 'text',
            placeholder: 'b2106819',
        },
        errorMessage: {
            required: 'Vui lòng nhập tài khoản.',
        }
    },
    password: {
        label: 'Mật khẩu',
        inputProps: {
            type: 'password',
            placeholder: '••••••••',
        }
    },
    rePassword: {
        label: 'Nhập lại mật khẩu',
        inputProps: {
            type: 'password',
            placeholder: '••••••••',
        }
    },
}

// Field configuration for step 2
const personalFieldConfig = {
    ho: {
        label: 'Họ',
        inputProps: {
            type: 'text',
            placeholder: 'Nguyễn',
        }
    },
    ten: {
        label: 'Tên',
        inputProps: {
            type: 'text',
            placeholder: 'Văn A',
        }
    },
    email: {
        label: 'Email',
        inputProps: {
            type: 'email',
            placeholder: 'example@example.com',
        }
    },
    sdt: {
        label: 'Số điện thoại',
        inputProps: {
            type: 'tel',
            placeholder: '0939 999 999',
        }
    },
    diachi: {
        label: 'Địa chỉ',
        inputProps: {
            type: 'text',
            placeholder: 'Ninh Kiều, Cần Thơ',
        }
    },
}

// Form steps
const currentStep = ref(1)

const nextStep = () => {
    currentStep.value += 1
}

const prevStep = () => {
    currentStep.value -= 1
}

// Submit handler for final step
function onSubmit(values: Record<string, any>) {
    toast({
        title: 'You submitted the following values:',
        description: JSON.stringify(values, null, 2),
    })
    console.log(values)
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
    <CardContent>
        <!-- Step 1: Account Information -->
        <AutoForm v-if="currentStep === 1" :schema="accountSchema" @submit="nextStep" :field-config="accountFieldConfig">
            <Button class="w-full mt-4 bg-green-500 hover:bg-green-600" type="submit">
                Tiếp theo
            </Button>
        </AutoForm>

        <!-- Step 2: Personal Information -->
        <AutoForm v-if="currentStep === 2" :schema="personalSchema" @submit="onSubmit" :field-config="personalFieldConfig">
            <div class="flex justify-between mt-4">
                <Button class="bg-gray-500 hover:bg-gray-600" @click="prevStep">
                    Quay lại
                </Button>
                <Button class="bg-green-500 hover:bg-green-600" type="submit">
                    Đăng ký
                </Button>
            </div>
        </AutoForm>
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