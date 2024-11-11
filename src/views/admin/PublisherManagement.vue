<template>
    <div class="container mx-auto py-6">
        <div class="flex justify-between">
            <h1 class="text-3xl font-bold mb-6">Quản lý nhà xuất bản</h1>
            <AddPublisher></AddPublisher>
        </div>
        <PublisherTable />
    </div>
</template>

<script setup lang="ts">
import PublisherTable from '@/components/Admin/Publisher/PublisherTable.vue';
import AddPublisher from '@/components/Admin/Publisher/AddPublisher.vue';


</script>
