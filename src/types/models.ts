// Types for Docgia
export interface Docgia {
  username?: string;
  email?: string;
  MaDocGia: string;
  HoTen: string;
  NgaySinh?: string;
  DiaChi: string;
  Phai?: Gender;
  SoDienThoai: string;
  DienThoai: string;
  updateAt: string;
  createAt: string;
  deleted: boolean;
}

export interface DocGiaSignUp {
  MaDocGia: string;
  email: string;
  username: string;
  password?: string;
  HoTen: string;
  DiaChi: string;
  DienThoai: string;
  updateAt: string;
  createAt: string;
  deleted: boolean;
}

// Types for NhanVien
export interface NhanVien {
  username: string;
  email: string;
  MSNV: string;
  HoTenNV: string;
  Password: string;
  ChucVu: string;
  DiaChi: string;
  SoDienThoai: string;
  updateAt: string;
  createAt: string;
  deleted: boolean;
  role: Role;
}

export interface NhanVienSignUp {
  MSNV: string;
  email: string;
  username: string;
  HoTenNV: string;
  role: Role;
  taiKhoanId: string;
  password: string;
  ChucVu: string;
  DiaChi: string;
  SoDienThoai: string;
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
  NhaXuatBan?: NhaXuatBan;
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
  _count?: {
    Sach: number;
  };
}

// Types for MuonSach
export interface MuonSach {
  MaMuon: string;
  MaDocGia: string;
  MaSach: string;
  MaNhanVien: string;
  NgayYeuCau: string;
  NgayXacNhan: string | null;
  hoanThanh: string | null;
  NgayMuon: string;
  NgayTra: string;
  status: BorrowStatus;
  updateAt: string;
  createAt: string;
  deleted: boolean;
  NhanVien?: NhanVien;
  Docgia: Docgia;
  Sach: Sach;
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
  docGia: Docgia | null;
  nhanVien: NhanVien | null;
};

export enum Role {
  ADMIN = "ADMIN",
  DOCGIA = "DOCGIA",
  NHANVIEN = "NHANVIEN",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

// Enum for BorrowStatus
export enum BorrowStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  BORROWED = "BORROWED",
  RETURNED = "RETURNED",
  OVERDUE = "OVERDUE",
}
