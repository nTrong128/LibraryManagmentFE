<template>
    <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Xóa nhà xuất bản</DialogTitle>
                <DialogDescription>
                    Bạn có chắc muốn xóa nhân viên {{ selectedNhanVien?.HoTenNV }} không? Hành động này bao gồm xóa cả tài khoản và không thể hoàn tác.
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
import { useNhanVienStore } from '@/stores/nhanvienStore'

const props = defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void
    (e: 'delete', bookId: string): void
}>()

const nhanvienStore = useNhanVienStore()
const selectedNhanVien = computed(() => nhanvienStore.selectedItem)
const loading = computed(() => nhanvienStore.loading)

const handleDelete = async () => {
    try {
        await nhanvienStore.deleteNhanVien(selectedNhanVien.value?.MSNV as string)
        emit('update:isOpen', false)
    } catch (error) {
        console.error('Error deleting publisher:', error)
    }
}

</script>