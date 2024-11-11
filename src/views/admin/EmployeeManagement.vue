<template>
    <div class="container mx-auto py-6">
        <div class="flex justify-between">
            <h1 class="text-3xl font-bold mb-6">Quản lý nhân viên</h1>
            <AddEmployee></AddEmployee>
        </div>
        <EmployeeTable />
    </div>
</template>

<script setup lang="ts">
import EmployeeTable from '@/components/Admin/EmployeeManagement/EmployeeTable.vue';
import AddEmployee from '@/components/Admin/EmployeeManagement/AddEmployee.vue';


</script>
