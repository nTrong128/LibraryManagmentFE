<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Search, Clock, Users } from 'lucide-vue-next'
import { type Sach } from '@/types/models'
import { useBookStore } from '@/stores/bookStore'
import { useRouter } from 'vue-router'


interface Book extends Sach {
    _id: { $oid: string };
}

const searchQuery = ref('')
const router = useRouter()

const handleSearch = () => {
    if (!searchQuery.value) return
    router.push({ name: 'browseBooks', query: { q: searchQuery.value }, })
}

const featuredBooks = computed<Book[]>(() => bookStore.items as Book[])
const bookStore = useBookStore()

const goToBookDetail = (id: string) => {
    console.log('Navigating to book detail:', id)
    router.push({ name: "BookDetail", params: { id } });
};



onMounted(async () => {
    await bookStore.fetchRandomBooks()
})
</script>

<template>
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800">
        <main class="container mx-auto px-6 py-8">
            <section class="text-center mb-16">
                <h1 class="text-4xl font-bold mb-4">Chào mừng bạn đến với thư viện HEHE</h1>
                <p class="text-xl mb-8">Khám phá, mượn và tận hưởng thế giới sách trong tầm tay bạn.</p>
                <div class="flex justify-center">
                    <div class="relative w-full max-w-xl">
                        <Input v-model="searchQuery" type="text" placeholder="Nhập tên sách để tìm" class="pr-10" @keyup.enter="handleSearch" />
                        <Button class="absolute right-0 top-0 bottom-0 bg-green-500 hover:bg-green-600" @click="handleSearch">
                            <Search class="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </section>

            <section class="mb-16">
                <h2 class="text-2xl font-semibold mb-6">Sách nổi bật</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <Card v-for="book in featuredBooks" @click="goToBookDetail(book._id.$oid)" :key="book.MaSach" class="overflow-hidden">
                        <img :src="book.image" :alt="book.TenSach" class="h-96 w-full object-cover transition-transform duration-300 ease-in-out hover:scale-110 mb-10" loading="lazy" />
                        <CardContent>
                            <h3 class="font-semibold">{{ book.TenSach }}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">{{ book.NguonGoc }}</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section class="mb-16">
                <h2 class="text-2xl font-semibold mb-6 text-center">Tại sao chọn Thư viện HEHE?</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card>
                        <CardContent class="flex flex-col items-center text-center p-6">
                            <BookOpen class="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                            <h3 class="text-xl font-semibold mb-2">Số lượng sách lớn</h3>
                            <p>
                                Truy cập hàng ngàn cuốn sách thuộc nhiều thể loại và chủ đề khác nhau.

                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent class="flex flex-col items-center text-center p-6">
                            <Clock class="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                            <h3 class="text-xl font-semibold mb-2">Truy cập 24/7</h3>
                            <p>
                                Đăng ký mượn và trả sách mọi lúc, mọi nơi.
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent class="flex flex-col items-center text-center p-6">
                            <Users class="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                            <h3 class="text-xl font-semibold mb-2">Cộng đồng to lớn</h3>
                            <p>
                                Giao lưu, chia sẻ và học hỏi từ cộng đồng đam mê sách.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>

        <footer class="bg-white dark:bg-gray-800 shadow mt-16">
            <div class="container mx-auto px-6 py-4">
                <p class="text-center text-gray-600 dark:text-gray-400">
                    © B2106819 - Lê Nhật Trọng - 2024
                </p>
            </div>
        </footer>
    </div>
</template>