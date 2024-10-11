<script setup lang="ts">
import AuthWrapper from '@/components/Auth/AuthWrapper.vue'
import SignupForm from '@/components/Auth/Signup.vue'
</script>

<template>
    <AuthWrapper title="Đăng ký" description="Vui lòng đăng ký để truy cập vào hệ thống">
        <SignupForm />
    </AuthWrapper>
</template>