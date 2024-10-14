<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

interface Props {
    totalPages: number
    currentPage: number
    siblingsCount?: number
}

const props = withDefaults(defineProps<Props>(), {
    siblingsCount: 1
})

const emit = defineEmits(['change'])

const DOTS = 'DOTS'

const range = (start: number, end: number) => {
    const length = end - start + 1
    return Array.from({ length }, (_, idx) => idx + start)
}

const paginationRange = computed(() => {
    const totalPageNumbers = props.siblingsCount + 5

    if (totalPageNumbers >= props.totalPages) {
        return range(1, props.totalPages)
    }

    const leftSiblingIndex = Math.max(props.currentPage - props.siblingsCount, 1)
    const rightSiblingIndex = Math.min(
        props.currentPage + props.siblingsCount,
        props.totalPages
    )

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < props.totalPages - 2

    const firstPageIndex = 1
    const lastPageIndex = props.totalPages

    if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * props.siblingsCount
        const leftRange = range(1, leftItemCount)

        return [...leftRange, DOTS, props.totalPages]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 3 + 2 * props.siblingsCount
        const rightRange = range(
            props.totalPages - rightItemCount + 1,
            props.totalPages
        )
        return [firstPageIndex, DOTS, ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = range(leftSiblingIndex, rightSiblingIndex)
        return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
    }
})
</script>

<template>
    <nav role="navigation" aria-label="pagination" class="flex items-center justify-center space-x-2">
        <Button variant="outline" class="h-9 w-9 p-0" :disabled="currentPage === 1" @click="emit('change', currentPage - 1)">
            <span class="sr-only">Trang trước đó</span>
            <ChevronLeft class="h-4 w-4" />
        </Button>
        <Button v-for="page in paginationRange" :key="page" variant="outline" :class="[
            'h-9 w-9 p-0',
            page === currentPage ? 'bg-primary text-primary-foreground hover:text-white hover:bg-primary/90 dark:text-black' : ''
        ]" :disabled="page === DOTS" @click="page !== DOTS ? emit('change', page) : null">
            <span v-if="page === DOTS">
                <MoreHorizontal class="h-4 w-4" />
                <span class="sr-only">More pages</span>
            </span>
            <span v-else>{{ page }}</span>
        </Button>
        <Button variant="outline" class="h-9 w-9 p-0" :disabled="currentPage === totalPages" @click="emit('change', currentPage + 1)">
            <span class="sr-only">Trang kế tiếp</span>
            <ChevronRight class="h-4 w-4" />
        </Button>
    </nav>
</template>