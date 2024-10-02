<template>
    <Dialog :open="true" @update:open="$emit('close')">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="addBook">
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="title" class="text-right">Title</Label>
              <Input id="title" v-model="newBook.title" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="author" class="text-right">Author</Label>
              <Input id="author" v-model="newBook.author" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="isbn" class="text-right">ISBN</Label>
              <Input id="isbn" v-model="newBook.isbn" class="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Book</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  
  const emit = defineEmits(['close', 'add-book'])
  
  const newBook = reactive({
    title: '',
    author: '',
    isbn: ''
  })
  
  const addBook = () => {
    emit('add-book', { ...newBook })
    newBook.title = ''
    newBook.author = ''
    newBook.isbn = ''
  }
  </script>