<template>
    <div class="container mx-auto p-6">
        <h1 class="text-3xl font-bold mb-6">Trang thông tin cá nhân</h1>

        <div class="grid grid-cols-2">
            <AccountInformation :user="user!" @edit="openAccountDialog" />
            <PersonalInformation :role="role!" :personalInfo="personalInfo" @edit="openPersonalDialog" />
        </div>

        <AccountDialog v-model:open="isAccountDialogOpen" :user="user" @update="updateUser" />
        <PersonalDialog v-model:open="isPersonalDialogOpen" :user="personalInfo" @update="updateUser" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AccountInformation from '@/components/Admin/Profile/AccountInfo.vue'
import PersonalInformation from '@/components/Admin/Profile/PersonalInfo.vue'
import AccountDialog from '@/components/Admin/Profile/AccountDialog.vue'
import PersonalDialog from '@/components/Admin/Profile/PersonalDialog.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const user = ref(authStore.user)

const personalInfo = ref(authStore.personalInfo)
const role = ref(authStore.role)


const isAccountDialogOpen = ref(false)
const isPersonalDialogOpen = ref(false)

const openAccountDialog = () => {
    isAccountDialogOpen.value = true
}

const openPersonalDialog = () => {
    isPersonalDialogOpen.value = true
}

const updateUser = (updatedUser: Partial<User>) => {
    user.value = { ...user.value, ...updatedUser }
}
</script>