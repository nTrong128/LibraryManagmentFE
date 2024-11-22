<template>
    <Dialog :open="isOpen" @update:open="$emit('update:isOpen', $event)">
        <DialogContent class="sm:max-w-[550px]">
            <DialogHeader>
                <DialogTitle class="text-2xl font-bold">Chi tiết mượn sách</DialogTitle>
                <DialogDescription>Xem thông tin chi tiết về yêu cầu mượn sách này.

                </DialogDescription>
            </DialogHeader>
            <div class="mt-6 space-y-6">
                <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center">
                        <!-- <BookOpenIcon class="w-8 h-8 text-gray-500" /> -->
                        <img :src="book.Sach.image" alt="Book Cover" class="w-36 h-36 object-cover rounded-lg" />
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold ">{{ book.Sach.TenSach }}</h3>
                        <p class="text-sm ">{{ book.Sach.NamXuatBan }} - {{ book.Sach.NguonGoc }}</p>
                    </div>
                </div>
                <Separator />
                <div class="grid grid-cols-2 gap-6">
                    <div>
                        <h4 class="text-lg font-medium">Thông tin đọc giả</h4>
                        <Separator class='my-2' />
                        <div class="space-y-2 mt-4">
                            <p class="text-sm"><span class="font-medium">Tên:</span> {{ book.Docgia.HoTen }}</p>
                            <p class="text-sm"><span class="font-medium">Số điện thoại:</span> {{ book.Docgia.DienThoai }}</p>
                            <p class="text-sm"><span class="font-medium">Email:</span> {{ book.Docgia.TaiKhoan?.email }}</p>
                            <p class="text-sm"><span class="font-medium">Tên tài khoản:</span> {{ book.Docgia.TaiKhoan?.username }}</p>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-lg font-medium">Thông tin mượn sách</h4>
                        <Separator class='my-2' />
                        <div class="space-y-2 mt-4">
                            <p class="text-sm"><span class="font-medium">Ngày yêu cầu:</span> {{ formatDate(book.NgayYeuCau) }}</p>
                            <p class="text-sm"><span class="font-medium">Ngày mượn:</span> {{ formatDate(book.NgayMuon) }}</p>
                            <p class="text-sm"><span class="font-medium">Ngày trả:</span> {{ formatDate(book.NgayTra) }}</p>
                            <p class="text-sm">
                                <span class="font-medium">Trạng thái:</span>
                                <span :class="{
                                    'px-2 py-1 rounded-full text-xs font-semibold ml-2': true,
                                    'bg-yellow-100 text-yellow-800': book.status === 'PENDING',
                                    'bg-green-100 text-green-800': book.status === 'ACCEPTED',
                                    'bg-blue-100 text-blue-800': book.status === 'BORROWED',
                                    'bg-red-100 text-red-800': book.status === 'REJECTED',
                                    'bg-green-100 text-green-600': book.status === 'RETURNED',
                                    'bg-orange-100 text-orange-600': book.status === 'OVERDUE'
                                }">
                                    {{ mappingBorrowStatus(book.status) }}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <DialogFooter class="mt-6">
                <div class="flex justify-end space-x-2">
                    <Button v-if="book.status === BorrowStatus.PENDING" @click="rejectBorrow" variant="destructive">
                        <XIcon class="w-4 h-4 mr-2" />
                        Từ chối
                    </Button>
                    <Button v-if="book.status === BorrowStatus.PENDING" @click="acceptBorrow" class="bg-blue-500 hover:bg-blue-600 text-white">
                        <CheckIcon class="w-4 h-4 mr-2" />
                        Xác nhận
                    </Button>
                    <Button v-if="book.status === BorrowStatus.ACCEPTED" @click="collectedBook" class="bg-green-500 hover:bg-green-600 text-white">
                        <BookIcon class="w-4 h-4 mr-2" />
                        Xác nhận đã nhận sách
                    </Button>
                    <Button v-if="book.status === BorrowStatus.BORROWED || book.status === BorrowStatus.OVERDUE" @click="returnedBook" class="bg-purple-500 hover:bg-purple-600 text-white">
                        <RotateCcwIcon class="w-4 h-4 mr-2" />
                        Xác nhận đã trả sách
                    </Button>
                    <Button v-if="book.status === BorrowStatus.OVERDUE" @click="sendRequestReturnBook" class="bg-orange-500 hover:bg-orange-600 text-white">
                        <BellIcon class="w-4 h-4 mr-2" />
                        Yêu cầu trả sách
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckIcon, XIcon, BookIcon, RotateCcwIcon, BellIcon } from 'lucide-vue-next'
import { BorrowStatus, type MuonSach } from '@/types/models'
import { mappingBorrowStatus } from '@/utils/mapping'

const props = defineProps<{
    isOpen: boolean
    book: MuonSach
}>()

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void
    (e: 'rejectBorrow', id: string): void
    (e: 'acceptBorrow', id: string): void
    (e: 'collectedBook', id: string): void
    (e: 'returnedBook', id: string): void
    (e: 'sendRequestReturnBook', id: string): void
}>()

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN')
}

const rejectBorrow = () => emit('rejectBorrow', props.book.MaMuon)
const acceptBorrow = () => emit('acceptBorrow', props.book.MaMuon)
const collectedBook = () => emit('collectedBook', props.book.MaMuon)
const returnedBook = () => emit('returnedBook', props.book.MaMuon)
const sendRequestReturnBook = () => emit('sendRequestReturnBook', props.book.MaMuon)
</script>