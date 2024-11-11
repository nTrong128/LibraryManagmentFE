<template>


  <header class="border-b">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <!-- <img class="h-8 w-auto" src="/logo.svg" alt="Your Company" /> -->
          <span class="text-2xl font-semibold text-green-500">HEHE Library</span>
        </div>

        <!-- Desktop Navigation -->


        <!-- User Menu (Desktop) -->
        <div class="hidden md:flex items-center space-x-4">

          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div class="flex items-center space-x-4">


                <span>Xin chào, {{ user.personalInfo?.HoTen }}</span>
                <Avatar>
                  <AvatarImage :src="image_url" :alt="user.user?.username" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <span class="ml-2 text-sm font-medium ">{{ user.user?.username }}</span>
                <ChevronDownIcon class="ml-2 h-4 w-4 text-gray-500" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Thông tin cá nhân</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <RouterLink to="/profile">Trang cá nhân
                </RouterLink>
              </DropdownMenuItem>
              <DropdownMenuItem @click="onSubmit">Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon class="h-6 w-6 " />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader class="flex flex-row space-x-4 align-middle justify-between mt-4">
                <div class="flex items-center mb-4">
                  <Avatar>
                    <AvatarImage :src="image_url" :alt="user.personalInfo" />
                    <AvatarFallback>{{ user.personalInfo.HoTen }}</AvatarFallback>
                  </Avatar>
                  <span class="ml-2 text-sm font-medium">{{ user.personalInfo?.HoTen }}</span>

                </div>
                <div class="flex items-center space-x-4">
                  <ThemeToggle />
                  <SheetTitle>Menu</SheetTitle>
                </div>
              </SheetHeader>
              <nav class="flex flex-col space-y-4 mt-4">

                <RouterLink v-for="(item, index) in navItems" :key="index" :to="item.path" class="w-full">
                  <Button variant="ghost" class="mx-2 bg-green-500 hover:bg-green-700 w-full text-white">{{ item.label }}</Button>
                </RouterLink>

              </nav>
              <div class="mt-4">

                <Button variant="outline" class="w-full">Thông tin cá nhân</Button>
                <Button variant="outline" class="w-full mt-2">Đăng xuất</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  </header>


</template>

<script setup>
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

import { ChevronDownIcon, MenuIcon } from 'lucide-vue-next'

import ThemeToggle from '@/components/ThemeToggle.vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()

const image_url = 'https://github.com/shadcn.png'

const authStore = useAuthStore()

const user = { user: authStore.user, personalInfo: authStore.personalInfo }


const onSubmit = async () => {
  await authStore.logout()
}




const navItems = [
  { path: '/dashboard', label: 'Trang chủ' },
  { path: '/dashboard/books', label: 'Sách' },
  { path: '/dashboard/applications', label: 'Đơn mượn sách' },
  { path: '/dashboard/applications', label: 'Người dùng' },
  { path: '/dashboard/applications', label: 'Nhân viên' }
]
</script>
