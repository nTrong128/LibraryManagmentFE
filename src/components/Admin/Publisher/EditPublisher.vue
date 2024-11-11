<template>
    <Dialog :open="isOpen" @update:open="handleOpenChange">
        <DialogContent class="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Cập nhật nhà xuất bản</DialogTitle>
                <DialogDescription>
                    Cập nhật thông tin nhà xuất bản, nhấn cập nhật để lưu thay đổi
                </DialogDescription>
            </DialogHeader>
            <form @submit.prevent="handleSubmit">
                <div class="grid gap-4 py-4">
                    <div class="space-y-4">
                        <div class="grid grid-cols-5 items-center gap-4">
                            <Label for="tensach" class="text-right">Tên sách</Label>
                            <Input id="tensach" v-model="editedNhaXuatBan.TenNXB" class="col-span-4" />
                        </div>
                        <div class="grid grid-cols-5 items-center gap-4">
                            <Label for="quantity" class="text-right">Địa chỉ</Label>
                            <Input id="quantity" v-model="editedNhaXuatBan.DiaChi" class="col-span-4" />
                        </div>
                    </div>
                </div>





                <DialogFooter>
                    <Button type="submit" :disabled="loading" class="bg-green-500 hover:bg-green-700">
                        {{ loading ? 'Đang lưu thay đổi ...' : 'Cập nhật' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useNhaXuatBanStore } from '@/stores/nhaXuatBanStore'
import type { NhaXuatBan } from '@/types/models'
import { useToast } from '@/components/ui/toast'

const publisherStore = useNhaXuatBanStore()
const selectedNhaXuatBan = computed(() => publisherStore.selectedItem)
const { toast } = useToast()


const props = defineProps<{
    isOpen: boolean
}>()

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void
    (e: 'save', nhaxuatban: NhaXuatBan): void
}>()

const loading = computed(() => publisherStore.loading)

const editedNhaXuatBan = ref({} as NhaXuatBan)
const error = ref('')


watch(() => selectedNhaXuatBan.value, (newValue) => {
    if (newValue) {
        editedNhaXuatBan.value = { ...newValue }
    }
}, { immediate: true })

const handleSubmit = async () => {
    if (publisherStore.loading) return
    error.value = ''

    try {
        console.log(editedNhaXuatBan.value)
        await publisherStore.updateNhaXuatBan(editedNhaXuatBan.value.MaNXB, { ...editedNhaXuatBan.value })

        toast({
            title: "Thành công",
            description: "Cập nhật nhà xuất thành công.",
        })
        emit('update:isOpen', false)

    } catch (err: any) {
        error.value = err.message || 'Thất bại.'
        toast({
            title: "Error",
            description: error.value,
            variant: "destructive",
        })
        emit('update:isOpen', false)
    }
}



const handleOpenChange = (open: boolean) => {
    emit('update:isOpen', open)
    if (!open) {
        editedNhaXuatBan.value = {} as NhaXuatBan
        error.value = ''
        publisherStore.clearSelectedNhaXuatBan()
    }
}




onMounted(() => {
    publisherStore.fetchAllNhaXuatBans()
})
</script>