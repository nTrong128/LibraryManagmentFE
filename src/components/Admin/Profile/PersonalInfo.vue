<template>
    <Card>
        <CardHeader>
            <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="space-y-2">
                <div><strong>Mã số:</strong> {{ toUpperCase(personalInfo?.MaDocGia || personalInfo?.MSNV) }}</div>
                <div><strong>Họ và tên:</strong> {{ personalInfo?.HoTen || personalInfo?.HoTenNV }}</div>
                <div v-if="role == roleEnum.DOCGIA"><strong>Giới tính:</strong> {{ personalInfo?.Phai }}</div>
                <div v-if="role !== roleEnum.DOCGIA">Loại tài khoản: {{ role }}</div>
                <div v-if="role == roleEnum.DOCGIA">
                    <strong>Ngày sinh:</strong> {{ personalInfo?.NgaySinh }}
                </div>
                <div v-if="role !== roleEnum.DOCGIA">
                    <strong>Chức vụ:</strong> {{ personalInfo?.ChucVu }}
                </div>
                <div><strong>Địa chỉ:</strong> {{ personalInfo.DiaChi }}</div>
                <div><strong>Số điện thoại:</strong> {{ personalInfo?.DienThoai || personalInfo?.SoDienThoai }}</div>
            </div>
        </CardContent>
        <CardFooter>
            <Button @click="$emit('edit')">Cập nhật</Button>
        </CardFooter>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Docgia, NhanVien } from '@/types/models';
import { Role as roleEnum } from '@/types/models';

interface PersonalInfo extends Docgia, NhanVien { }

defineProps<{
    personalInfo: PersonalInfo
    role: roleEnum
}>()

const toUpperCase = (str: string) => str.toUpperCase();

defineEmits(['edit'])
</script>