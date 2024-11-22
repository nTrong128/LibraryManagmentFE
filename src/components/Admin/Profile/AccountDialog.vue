<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Sửa thông tin cá nhân</DialogTitle>
            </DialogHeader>
            <form @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <div>
                        <Label for="email">Email</Label>
                        <Input id="email" v-model="form.email" />
                    </div>
                    <div>
                        <Label for="username">Username</Label>
                        <Input id="username" v-model="form.username" />
                    </div>
                </div>
                <DialogFooter class="mt-6">
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const props = defineProps<{
    open: boolean
    user: {
        email: string
        username: string
    }
}>()

const emit = defineEmits(['update:open', 'update'])

const form = ref({
    email: props.user.email,
    username: props.user.username,
})

watch(() => props.open, (newValue) => {
    if (newValue) {
        form.value = {
            email: props.user.email,
            username: props.user.username,
        }
    }
})

const handleSubmit = () => {
    emit('update', form.value)
    emit('update:open', false)
}
</script>