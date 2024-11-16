<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    BookOpen,
    Library,
    LogOut,
    ListChecks,
    ChevronsUpDown,
    Home,
    Menu
} from 'lucide-vue-next'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useAuthStore } from '@/stores/authStore'
import type { NhanVien } from '@/types/models'



const navItems = [
    { title: 'Trang chủ', icon: LayoutDashboard, route: '/dashboard' },
    { title: 'Landing page', icon: Home, route: '/' },
    { title: 'Sách', icon: BookOpen, route: '/dashboard/books' },
    { title: 'Đơn mượn sách', icon: ListChecks, route: '/dashboard/applications' },
    { title: 'Nhà xuất bản', icon: Library, route: '/dashboard/publishers' },
    { title: 'Nhân viên', icon: ShieldCheck, route: '/dashboard/employees' },
    { title: 'Người dùng', icon: Users, route: '/dashboard/users' },
]


const isCollapsed = ref(true)

const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
}

const image_url = 'https://github.com/shadcn.png'

const authStore = useAuthStore()
const user = { user: authStore.user, personalInfo: authStore.personalInfo as NhanVien }

const onSubmit = async () => {
    await authStore.logout()
}



</script>

<template>
    <aside class=" flex flex-col h-screen transition-all duration-100 ease-in-out" :class="{ 'w-72': !isCollapsed, 'w-20': isCollapsed }">
        <div class="flex items-center justify-between p-4">
            <h1 class="text-xl font-bold" v-if="!isCollapsed">Hệ thống quản lý</h1>
            <Button variant="ghost" size="icon" @click="toggleSidebar">
                <Menu class="h-6 w-6" />
            </Button>
        </div>
        <Separator />
        <div class="flex-1">
            <nav class="space-y-2 p-2">
                <RouterLink v-for="item in navItems" :key="item.title" :to="item.route" custom v-slot="{ navigate, isActive }">
                    <Button @click="navigate" :variant="isActive ? 'secondary' : 'ghost'" :class="[
                        'w-full justify-start',
                        isCollapsed ? 'px-2' : 'px-4'
                    ]">
                        <component :is="item.icon" class="h-5 w-5 mr-2" />
                        <span v-if="!isCollapsed">{{ item.title }}</span>
                    </Button>
                </RouterLink>
                <ThemeToggle v-if="isCollapsed" />
                <ThemeToggle v-if="!isCollapsed" :show-text="true">

                </ThemeToggle>
            </nav>
        </div>
        <Separator />
        <div class="p-4">
            <div class="flex justify-between items-center">
                <Popover v-if="isCollapsed">
                    <PopoverTrigger as-child>
                        <Avatar>
                            <AvatarImage :src="image_url" :alt="user.user?.username" />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div class="flex flex-col space-y-2">
                            <RouterLink to="/profile" class="w-full">
                                <Button class="w-full flex justify-start" variant="outline">Trang cá nhân</Button>
                            </RouterLink>
                            <Button @click="onSubmit" variant="destructive" class="flex justify-between ">
                                Đăng xuất
                                <LogOut />
                            </Button>
                        </div>

                    </PopoverContent>
                </Popover>
                <div v-if="!isCollapsed" class="w-full">
                    <Popover v-if="!isCollapsed">
                        <PopoverTrigger as-child>
                            <div class="flex space-x-4">
                                <Avatar>
                                    <AvatarImage :src="image_url" :alt="user.user?.username" />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                                <div class="">
                                    <p class="font-semibold">
                                        {{ user.personalInfo?.HoTenNV }}
                                    </p>
                                    <!-- <p class="text-sm">
                                        {{ user.user?.email }}
                                    </p> -->
                                </div>
                                <div>
                                    <ChevronsUpDown class="h-5 w-h-5" />
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div class="flex flex-col space-y-2">
                                <RouterLink to="/profile" class="w-full">
                                    <Button class="w-full flex justify-start" variant="outline">Trang cá nhân</Button>
                                </RouterLink>
                                <Button @click="onSubmit" variant="destructive" class="flex justify-between ">
                                    Đăng xuất
                                    <LogOut />
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                </div>
            </div>
        </div>
    </aside>
    <Separator orientation="vertical" />
</template>