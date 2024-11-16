import Borrow from "@/components/User/Borrow.vue";
import {Gender, BorrowStatus} from "@/types/models";

export const mappingGender = (gender: Gender) => {
  if (!gender) return "Chưa cập nhật";
  if (gender === Gender.MALE) return "Nam";
  else if (gender === Gender.FEMALE) return "Nữ";
  else return "Khác";
};

export const mappingBorrowStatus = (status: BorrowStatus) => {
  if (status === BorrowStatus.ACCEPTED) {
    return "Đã được duyệt";
  }
  if (status === BorrowStatus.REJECTED) {
    return "Đã bị từ chối";
  }
  if (status === BorrowStatus.PENDING) {
    return "Đang chờ";
  }
  if (status === BorrowStatus.BORROWED) {
    return "Đang mượn";
  }
  if (status === BorrowStatus.RETURNED) {
    return "Đã trả";
  }
  if (status === BorrowStatus.OVERDUE) {
    return "Quá hạn";
  }
};
