<script setup lang="ts">
import AuthWrapper from '@/components/Auth/AuthWrapper.vue'
import ForgotPassword from '@/components/Auth/ForgotPassword.vue'
</script>

<template>
    <AuthWrapper title="Quên mật khẩu" description="Vui lòng nhập địa chỉ email của bạn">
        <ForgotPassword />
    </AuthWrapper>
</template>