<template>
    <div class="min-h-screen bg-background">
        <main class="container py-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatisticsCard title="Tổng số sách" :value="totalBooks" icon="BookOpen" bg_color="bg-indigo-500" />
                <StatisticsCard title="Tổng số thành viên" :value="totalMembers" icon="Users" bg_color="bg-green-500" />
                <StatisticsCard title="Tổng số đơn mượn" :value="borrowedBooks" icon="Bookmark" bg_color="bg-yellow-500" />
            </div>
            <AreaChart :data="data" index="name" :categories="['total', 'predicted']" />

        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import StatisticsCard from '@/components/StatisticsCard.vue'
import { AreaChart } from '@/components/ui/chart-area'

const totalBooks = ref(1250)
const totalMembers = ref(75)
const borrowedBooks = ref(320)
const data = [
    { name: 'Jan', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'Feb', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'Mar', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'Apr', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'May', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'Jun', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
    { name: 'Jul', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
]

</script>