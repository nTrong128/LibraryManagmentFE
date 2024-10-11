<template>
    <div class="min-h-screen bg-background">
        <main class="container py-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatisticsCard title="Total Books" :value="totalBooks" icon="BookOpen" bg_color="bg-indigo-500" />
                <StatisticsCard title="Total Members" :value="totalMembers" icon="Users" bg_color="bg-green-500" />
                <StatisticsCard title="Books Borrowed" :value="borrowedBooks" icon="Bookmark" bg_color="bg-yellow-500" />
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import StatisticsCard from '@/components/StatisticsCard.vue'

const totalBooks = ref(1250)
const totalMembers = ref(500)
const borrowedBooks = ref(320)


</script>