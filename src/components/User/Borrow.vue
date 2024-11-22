<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useBookStore } from '@/stores/bookStore';
import { useBorrowStore } from '@/stores/borrowBookStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DatePicker from "@/components/ui/DatePicker.vue";
import { convertToISODateTime } from '@/utils/dateTime';
import { type MuonSach, type Sach } from '@/types/models';
import { useToast } from '@/components/ui/toast';
import Error from "@/components/Error.vue";
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const { toast } = useToast();
const router = useRouter();
const bookStore = useBookStore();
const borrowStore = useBorrowStore();
const authStore = useAuthStore();

const authenticated = computed(() => authStore.isAuthenticated);




const dialogOpen = ref(false);
const selectedBook = computed(() => bookStore.selectedItem);

const { error } = storeToRefs(borrowStore);
const loading = computed(() => bookStore.loading);

const borrowDetails = ref({
    NgayMuon: convertToISODateTime(new Date()),
    NgayTra: convertToISODateTime(new Date(new Date().setDate(new Date().getDate() + 7))),
    MaSach: '',
    MaDocGia: authStore.user?.docGia?.MaDocGia,
    MaNhanVien: ''
} as unknown as MuonSach);

const handleSubmit = async () => {

    if (authenticated.value && !authStore.isDocGia) {
        toast({
            variant: "destructive",
            title: 'Lỗi',
            description: 'Chỉ người dùng là độc giả mới có thể thực hiện chức năng này.',
        });
        return;
    }


    if (!authenticated.value) {
        toast({
            variant: "destructive",
            title: 'Lỗi',
            description: 'Vui lòng đăng nhập để thực hiện chức năng này.',
        });

        router.push({ path: '/login' });
        return;
    }


    error.value = '';
    try {
        if (selectedBook.value) {
            borrowDetails.value.MaSach = selectedBook.value.MaSach;
        } else {
            throw new Error('No book selected');
        }
        await borrowStore.createBorrow(borrowDetails.value);
        if (!borrowStore.error) {
            dialogOpen.value = false;
            toast({
                title: 'Thành công',
                description: 'Đăng ký mượn sách thành công, vui lòng chờ xác nhận từ thư viện.',
                variant: 'success',
            });
        }
    } catch (err: any) {
        error.value = err.message || 'Thất bại.';
    }
};

const handleDialogUpdate = async (isOpen: boolean) => {
    dialogOpen.value = isOpen;
    if (!isOpen) {
        error.value = '';
        await borrowStore.cleanUp();
    }
};
</script>

<template>
    <Dialog :open="dialogOpen" @update:open="handleDialogUpdate">
        <DialogTrigger as-child>
            <div class="flex justify-between w-full mt-4">
                <Button class="w-full mr-2">Đăng ký mượn</Button>
            </div>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>Đăng ký mượn sách</DialogTitle>
                <DialogDescription>
                    Chọn ngày để đăng ký mượn sách
                </DialogDescription>
            </DialogHeader>
            <form @submit.prevent="handleSubmit">
                <div class="grid grid-cols-2 gap-4">
                    <div class="">
                        <Label class="font-semibio">Ngày mượn</Label>
                        <DatePicker class="" v-model="borrowDetails.NgayMuon" />
                        <Label class="font-semibio">Ngày trả</Label>
                        <DatePicker class="" v-model="borrowDetails.NgayTra" />
                    </div>
                    <div class="space-y-4">
                        <div class="">
                            <div>
                                <strong v-if="selectedBook">{{ selectedBook.NguonGoc }} - {{ selectedBook.NamXuatBan }}</strong>
                                <div class="flex space-x-2">
                                    <strong>Còn lại: </strong>
                                    <p>{{ selectedBook?.SoQuyen }}</p>
                                </div>
                            </div>
                        </div>
                        <img :src="selectedBook?.image" alt="Book cover preview" class="max-w-full h-2/3 mx-auto" />
                    </div>
                    <Error :description="error || ''"></Error>
                </div>
                <DialogFooter>
                    <Button type="submit" :disabled="loading" class="bg-green-500 mt-4 hover:bg-green-700">
                        {{ loading ? 'Đang lưu thay đổi ...' : 'Đăng ký' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>