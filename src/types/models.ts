// Types for Docgia
export interface Docgia {
  MaDocGia: string;
  HoLot: string;
  Ten: string;
  NgaySinh: string;
  Phai: boolean;
  DiaChi: string;
  DienThoai: string;
  updateAt: string;
  createAt: string;
  deleted: boolean;
}

// Types for Sach
export interface Sach {
  MaSach: string;
  TenSach: string;
  DonGia: string | number | undefined;
  SoQuyen: number;
  image: string;
  NamXuatBan: number;
  MaNXB: string;
  NguonGoc: string;
  updateAt: string;
  createAt: string;
  deleted: boolean;
}

// Types for NhaXuatBan
export interface NhaXuatBan {
  MaNXB: string;
  TenNXB: string;
  DiaChi: string;
  updateAt: string;
  createAt: string;
  deleted: boolean;
}

// Types for MuonSach
export interface MuonSach {
  MaMuon: string;
  MaDocGia: string;
  MaSach: string;
  NgayMuon: string | null;
  NgayTra: string | null;
  status: BorrowStatus;
  updateAt: string;
  createAt: string;
  deleted: boolean;
}

// Types for NhanVien
export interface NhanVien {
  MSNV: string;
  HoTenNV: string;
  Password: string;
  ChucVu: string;
  DiaChi: string;
  SoDienThoai: string;
  updateAt: string;
  createAt: string;
  deleted: boolean;
}

export type TaiKhoan = {
  id: string;
  username: string;
  email: string;
  role: Role;
  docGiaId: string | null;
  nhanVienId: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpiresAt: string | null;
  deleted: boolean;
  createAt: string;
  updateAt: string;
};

export enum Role {
  ADMIN = "ADMIN",
  DOCGIA = "DOCGIA",
  NHANVIEN = "NHANVIEN",
}

// Enum for BorrowStatus
export enum BorrowStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  BORROWED = "BORROWED",
  RETURNED = "RETURNED",
}
