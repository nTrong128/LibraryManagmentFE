<template>
    <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete Book</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this book? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" @click="$emit('update:isOpen', false)" :disabled="loading">Cancel</Button>
                <Button variant="destructive" @click="handleDelete" :disabled="loading">
                    {{ loading ? 'Deleting...' : 'Delete' }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useBookStore } from '@/stores/bookStore'

const props = defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void
    (e: 'delete', bookId: string): void
}>()

const bookStore = useBookStore()
const selectedBook = computed(() => bookStore.selectedItem)
const loading = computed(() => bookStore.loading)

const handleDelete = async () => {
    try {
        await bookStore.deleteBook(selectedBook.value?.MaSach as string)
        emit('update:isOpen', false)
    } catch (error) {
        console.error('Error deleting book:', error)
    }
}

</script>