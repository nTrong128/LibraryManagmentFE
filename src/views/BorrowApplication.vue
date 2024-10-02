<template>
    <div class="container py-6">
      <Card>
        <CardHeader>
          <CardTitle>Borrow Applications</CardTitle>
          <CardDescription>Review and approve user requests to borrow books</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Book</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="application in borrowApplications" :key="application.id">
                <TableCell>{{ application.user }}</TableCell>
                <TableCell>{{ application.book }}</TableCell>
                <TableCell>{{ formatDate(application.requestDate) }}</TableCell>
                <TableCell>
                  <Badge :variant="getStatusVariant(application.status)">
                    {{ application.status }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div class="flex space-x-2">
                    <Button 
                      v-if="application.status === 'Pending'" 
                      size="sm" 
                      @click="approveApplication(application.id)"
                    >
                      Approve
                    </Button>
                    <Button 
                      v-if="application.status === 'Pending'" 
                      size="sm" 
                      variant="destructive" 
                      @click="rejectApplication(application.id)"
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  
      <Dialog :open="showConfirmDialog" @update:open="showConfirmDialog = false">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {{ confirmAction }} this borrow application?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button @click="confirmDialog(false)">Cancel</Button>
            <Button :variant="confirmAction === 'approve' ? 'default' : 'destructive'" @click="confirmDialog(true)">
              {{ confirmAction === 'approve' ? 'Approve' : 'Reject' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
  import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
  import { Button } from '@/components/ui/button'
  import { Badge } from '@/components/ui/badge'
  import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog'
  
  // Mock data for borrow applications
  const borrowApplications = ref([
    { id: 1, user: 'John Doe', book: 'To Kill a Mockingbird', requestDate: new Date('2023-05-01'), status: 'Pending' },
    { id: 2, user: 'Jane Smith', book: '1984', requestDate: new Date('2023-05-02'), status: 'Approved' },
    { id: 3, user: 'Bob Johnson', book: 'Pride and Prejudice', requestDate: new Date('2023-05-03'), status: 'Rejected' },
    { id: 4, user: 'Alice Brown', book: 'The Great Gatsby', requestDate: new Date('2023-05-04'), status: 'Pending' },
  ])
  
  const showConfirmDialog = ref(false)
  const confirmAction = ref('')
  const currentApplicationId = ref(null)
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date)
  }
  
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Approved':
        return 'success'
      case 'Rejected':
        return 'destructive'
      default:
        return 'default'
    }
  }
  
  const approveApplication = (id) => {
    confirmAction.value = 'approve'
    currentApplicationId.value = id
    showConfirmDialog.value = true
  }
  
  const rejectApplication = (id) => {
    confirmAction.value = 'reject'
    currentApplicationId.value = id
    showConfirmDialog.value = true
  }
  
  const confirmDialog = (confirmed) => {
    if (confirmed) {
      const application = borrowApplications.value.find(app => app.id === currentApplicationId.value)
      if (application) {
        application.status = confirmAction.value === 'approve' ? 'Approved' : 'Rejected'
      }
    }
    showConfirmDialog.value = false
  }
  </script>