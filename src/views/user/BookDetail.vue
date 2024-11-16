<template>
    <div class="min-h-screen bg-gradient-to-br from-background to-secondary/20 text-foreground py-12 px-4 sm:px-6 lg:px-8 relative">
        <div class="relative max-w-6xl mx-auto">
            <Button variant="ghost" class="mb-6" @click="goBack">
                <ArrowLeft class="mr-2 h-4 w-4" />
                Quay lại
            </Button>

            <div v-if="bookStore.loading" class="flex justify-center my-40">
                <Spinner class="h-8 w-8" />
            </div>

            <div v-else-if="!book" class="flex justify-center my-40">
                <Alert variant="destructive">
                    <AlertCircle class="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Không tìm thấy sách
                    </AlertDescription>
                </Alert>
            </div>

            <Card v-else class="bg-card text-card-foreground border-border shadow-lg">
                <CardContent>
                    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <!-- Left Column: Book Cover -->
                        <div class="lg:col-span-2 flex flex-col items-center">
                            <AspectRatio :ratio="3 / 4" class=" rounded-lg overflow-hidden shadow-md w-full max-w-md">
                                <img v-if="book.image" :src="book.image" :alt="`Cover of ${book.TenSach}`"
                                    class="p-8 object-cover w-full h-full transition-transform duration-300 ease-in-out hover:scale-105" />
                                <div v-else class="w-full h-full flex items-center justify-center text-muted-foreground">
                                    <ImageOff class="w-16 h-16" />
                                </div>
                            </AspectRatio>

                        </div>

                        <div class="lg:col-span-3 space-y-6 my-4">
                            <h2 class="text-3xl font-bold">{{ book.TenSach }} ({{ book.NamXuatBan }})</h2>

                            <p v-if="book.SoQuyen === 0" class="text-red-500">Sách tạm hết</p>
                            <div>
                                <h3 class="text-2xl font-semibold mb-4">Thông tin sách</h3>
                                <div class="grid grid-cols-2">
                                    <div>
                                        <div class="flex space-x-2">
                                            <strong>Tác giả: </strong>
                                            <p>{{ book.NguonGoc }}</p>
                                        </div>
                                        <div class="flex space-x-2">
                                            <strong>Số quyển còn lại: </strong>
                                            <p>{{ book.SoQuyen }}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="flex space-x-2">
                                            <strong>Năm xuất bản: </strong>
                                            <p>{{ book.NamXuatBan }}</p>
                                        </div>
                                        <div class="flex space-x-2">
                                            <strong>Nhà xuất bản: </strong>
                                            <p>{{ getPublisherName(book.MaNXB) }}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <Borrow />
                            <Separator />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { BookOpen, ImageOff, ArrowLeft, AlertCircle } from 'lucide-vue-next'
import { useBookStore } from '@/stores/bookStore'
import { useNhaXuatBanStore } from '@/stores/nhaXuatBanStore'
import Spinner from '@/components/Spinner.vue'
import Borrow from '@/components/User/Borrow.vue'

const bookStore = useBookStore()
const publisherStore = useNhaXuatBanStore()
const route = useRoute()
const router = useRouter()

const publishers = computed(() => publisherStore.allNhaXuatBans)
const book = computed(() => bookStore.selectedBook)

const getPublisherName = (MaNXB: string) => {
    const publisher = publishers.value.find(p => p.MaNXB === MaNXB)
    return publisher ? publisher.TenNXB : 'Unknown'
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value)
}

const goBack = () => {
    router.back()
}

onMounted(async () => {
    const bookId = route.params.id
    await bookStore.fetchBookById(bookId as string)
    await publisherStore.fetchAllNhaXuatBans()
})
</script>