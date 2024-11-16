<template>
    <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Xóa đọc giả</DialogTitle>
                <DialogDescription>
                    Bạn có chắc muốn xóa đọc giả {{ selectedDocGia?.HoTen }} không? Hành động này không thể hoàn tác.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" @click="$emit('update:isOpen', false)" :disabled="loading">Cancel</Button>
                <Button variant="destructive" @click="handleDelete" :disabled="loading">
                    {{ loading ? 'Deleting...' : 'Delete' }}
                </Button>
                <Error v-if="docGiaStore.error" :description="docGiaStore.error || ''">
                </Error>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDocgiaStore } from '@/stores/docgiaStore'
import Error from '@/components/Error.vue'

const props = defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void
    (e: 'delete', bookId: string): void
}>()

const docGiaStore = useDocgiaStore()

const selectedDocGia = computed(() => docGiaStore.selectedItem)
const loading = computed(() => docGiaStore.loading)

const handleDelete = async () => {
    try {
        await docGiaStore.deleteDocgia(selectedDocGia.value?.MaDocGia as string)
        emit('update:isOpen', false)
    } catch (error) {
        console.error(error)
    }
}

</script>