<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Cập nhật tài khoản</DialogTitle>
            </DialogHeader>
            <form @submit.prevent="handleSubmit">
                <div class="space-y-4">
                    <div>
                        <Label for="firstName">First Name</Label>
                        <Input id="firstName" v-model="form.firstName" />
                    </div>
                    <div>
                        <Label for="lastName">Last Name</Label>
                        <Input id="lastName" v-model="form.lastName" />
                    </div>
                    <div>
                        <Label for="dateOfBirth">Date of Birth</Label>
                        <Input id="dateOfBirth" type="date" v-model="form.dateOfBirth" />
                    </div>
                    <div>
                        <Label for="address">Address</Label>
                        <Textarea id="address" v-model="form.address" />
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
import { Textarea } from '@/components/ui/textarea'

const props = defineProps<{
    open: boolean
    user: {
        firstName: string
        lastName: string
        dateOfBirth: string
        address: string
    }
}>()

const emit = defineEmits(['update:open', 'update'])

const form = ref({
    firstName: props.user.firstName,
    lastName: props.user.lastName,
    dateOfBirth: props.user.dateOfBirth,
    address: props.user.address,
})

watch(() => props.open, (newValue) => {
    if (newValue) {
        form.value = {
            firstName: props.user.firstName,
            lastName: props.user.lastName,
            dateOfBirth: props.user.dateOfBirth,
            address: props.user.address,
        }
    }
})

const handleSubmit = () => {
    emit('update', form.value)
    emit('update:open', false)
}
</script>