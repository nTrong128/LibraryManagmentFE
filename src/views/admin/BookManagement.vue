<template>
    <div class="container mx-auto py-6">
        <div class="flex justify-between">
            <h1 class="text-3xl font-bold mb-6">Quản lý sách</h1>
            <AddBookModal></AddBookModal>
        </div>
        <BookTable />
    </div>
</template>

<script setup lang="ts">
import BookTable from '@/components/Admin/BookManagement/BookTable.vue';
import AddBookModal from '@/components/Admin/BookManagement/AddBookModal.vue';


</script>
