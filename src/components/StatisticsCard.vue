<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ title }}</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="flex items-center">
        <div :class="['p-2 rounded-full mr-4', bg_color]">
          <component :is="iconComponent" class="h-6 w-6 text-white" />

        </div>
        <div class="text-3xl font-semibold">{{ value }}</div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BookOpen, Users, Bookmark } from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  bg_color: {
    type: String,
    required: false,
  }
})

const iconComponent = computed(() => {
  switch (props.icon) {
    case 'BookOpen':
      return BookOpen
    case 'Users':
      return Users
    case 'Bookmark':
      return Bookmark
    default:
      return BookOpen
  }
})
</script>