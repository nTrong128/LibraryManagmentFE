<template>
    <Card>
      <CardHeader>
        <CardTitle class="flex justify-between items-center">
          Book List
          <Button @click="$emit('add-book')">Add New Book</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="book in books" :key="book.id">
              <TableCell>{{ book.title }}</TableCell>
              <TableCell>{{ book.author }}</TableCell>
              <TableCell>{{ book.isbn }}</TableCell>
              <TableCell>
                <Badge :variant="book.status === 'Available' ? 'default' : 'secondary'">
                  {{ book.status }}
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </template>
  
  <script setup>
  import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
  import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
  import { Button } from '@/components/ui/button'
  import { Badge } from '@/components/ui/badge'
  
  defineProps({
    books: {
      type: Array,
      required: true
    }
  })
  
  defineEmits(['add-book'])
  </script>