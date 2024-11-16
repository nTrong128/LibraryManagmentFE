<template>
    <div class="container mx-auto py-6">
        <div class="flex justify-between">
            <h1 class="text-3xl font-bold mb-6">Quản lý người dùng</h1>
            <AddUser></AddUser>
        </div>
        <UserTable />
    </div>
</template>

<script setup lang="ts">
import UserTable from '@/components/Admin/UserManagement/UserTable.vue';
import AddUser from '@/components/Admin/UserManagement/AddUser.vue';


</script>
