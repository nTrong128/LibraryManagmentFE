<template>
    <div class="container mx-auto py-6">
        <div class="flex justify-between">
            <h1 class="text-3xl font-bold mb-6">Quản lý sách</h1>
            <AddBookModal></AddBookModal>
        </div>
        <BookTable :page="validatedPage" @pageChange="changePage" />
    </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BookTable from '@/components/bookManagmenet/BookTable.vue';
import AddBookModal from '@/components/bookManagmenet/AddBookModal.vue';
import { useBookStore } from '@/stores/bookStore';

const props = defineProps<{
    page: number
}>();

const router = useRouter();
const bookStore = useBookStore();

const validatedPage = computed(() => {
    if (bookStore.isValidPage(props.page)) {
        return props.page;
    }
    return 1;
});

const changePage = (newPage: number) => {
    router.push({ name: 'books', query: { page: newPage.toString() } });
};

watch(validatedPage, (newPage) => {
    if (newPage !== props.page) {
        router.replace({ query: { page: newPage.toString() } });
    }
});

onMounted(() => {
    bookStore.fetchBooks(validatedPage.value);
});
</script>