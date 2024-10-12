<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'

import * as z from 'zod'
import { toast } from '@/components/ui/toast'
import { AutoForm } from '@/components/ui/auto-form'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { onMounted } from 'vue'


const schema = z.object({
    username: z.string().min(1, { message: 'Vui lòng nhập tài khoản.' }),
    password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu.' }),
})

const authStore = useAuthStore()

async function onSubmit(values: { username: string; password: string }) {
    toast({
        title: 'You submitted the following values:',
        description: JSON.stringify(values, null, 2),
    })
    console.log(values)
    await authStore.login(values)

}



</script>

<template>
    <CardContent>
        <AutoForm :schema="schema" @submit="onSubmit" :field-config="{
            username: {
                label: 'Tài khoản',
                description: 'Nhập tên người dùng. Không được trùng với người dùng khác. ',
                inputProps: {
                    type: 'text',
                    placeholder: 'b2106819',
                    name: 'username',
                },
            },
            password: {
                label: 'Mật khẩu',
                inputProps: {
                    type: 'password',
                    placeholder: '********',
                    name: 'password',
                }
            }
        }">
            <div class="flex justify-end">

                <router-link to="/forgot-password" class="underline text-green-500 hover:text-green-700 ">
                    Quên mật khẩu?
                </router-link>
            </div>
            <Button class="w-full mt-4 bg-green-500 hover:bg-green-600" type="submit">
                Đăng nhập
            </Button>
        </AutoForm>
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