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
                <nav class="hidden md:flex space-x-4">
                    <Button v-for="item in navItems" :key="item.name" variant="ghost">
                        {{ item.name }}
                    </Button>
                </nav>

                <!-- User Menu (Desktop) -->
                <div class="hidden md:flex items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <div class="flex items-center">
                                <Avatar>
                                    <AvatarImage :src="image_url" :alt="props.user.name" />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                                <span class="ml-2 text-sm font-medium text-gray-700">{{ props.user.name }}</span>
                                <ChevronDownIcon class="ml-2 h-4 w-4 text-gray-500" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>
                                <Button class="w-full h-full" variant="outline" @click="onSubmit">Logout</Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <!-- Mobile Menu Button -->
                <div class="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MenuIcon class="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <nav class="flex flex-col space-y-4 mt-4">
                                <Button class="bg-green-500" v-for="item in navItems" :key="item.name">
                                    {{ item.name }}
                                </Button>
                            </nav>
                            <div class="mt-4">
                                <div class="flex items-center mb-4">
                                    <Avatar>
                                        <AvatarImage :src="image_url" :alt="props.user.name" />
                                        <AvatarFallback>A</AvatarFallback>

                                    </Avatar>
                                    <span class="ml-2 text-sm font-medium text-gray-700">{{ props.user.name }}</span>
                                </div>
                                <Button variant="outline" class="w-full">Profile</Button>
                                <Button variant="outline" class="w-full mt-2">Settings</Button>
                                <Button variant="outline" class="w-full mt-2">Logout</Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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
import { useAuthStore } from '@/stores/authStore'

// Define props for user data
interface UserProps {
    name: string
}

const props = defineProps<{
    user: UserProps
}>()

const image_url = 'https://github.com/shadcn.png'

// Mock navigation items (unchanged)
const navItems = [
    { name: 'Dashboard', href: '#' },
    { name: 'Projects', href: '#' },
    { name: 'Team', href: '#' },
    { name: 'Reports', href: '#' }
]

const authStore = useAuthStore()

const onSubmit = async () => {
    await authStore.logout()
}


</script>