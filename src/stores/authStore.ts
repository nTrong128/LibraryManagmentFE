import {defineStore} from "pinia";
import axiosInstance, {type ApiResponse} from "@/services/axiosInstance";
import {type Docgia, type NhanVien, Role, type TaiKhoan} from "@/types/models";
import router from "@/router";

interface AuthState {
  user: TaiKhoan | null;
  loading: boolean;
  error: string | null;
  role: Role | null;
  personalInfo: Docgia | NhanVien | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null,
    role: null,
    personalInfo: null,
  }),

  actions: {
    async login(credentials: {username: string; password: string}) {
      this.setLoading(true);
      this.clearError();

      try {
        const user = await this.authenticate("/auth/login", credentials);
        await this.loadPersonalInfo(user.docGiaId || user.nhanVienId!, user.role);
        this.redirectToHome(router);
      } catch (error) {
        this.handleError(error, "Tên đăng nhập hoặc mật khẩu không đúng!!!");
      } finally {
        this.setLoading(false);
      }
    },

    async signup(credentials: {username: string; password: string}) {
      this.setLoading(true);
      this.clearError();

      try {
        const user = await this.authenticate("/auth/signup", credentials);
        await this.loadPersonalInfo(user.docGiaId!, user.role);
      } catch (error) {
        this.handleError(error, "Có lỗi xảy ra khi đăng ký tài khoản!!!");
      } finally {
        this.setLoading(false);
      }
    },

    async authenticate(endpoint: string, credentials: {username: string; password: string}) {
      const response = await axiosInstance.post<ApiResponse<TaiKhoan>>(endpoint, credentials);
      this.user = response.data.data;
      return this.user!;
    },

    async loadPersonalInfo(id: string, role: Role) {
      this.setLoading(true);
      this.clearError();

      const endpoint = role === Role.DOCGIA ? `/docgia/${id}` : `/nhanvien/${id}`;
      try {
        const response = await axiosInstance.get<ApiResponse<Docgia | NhanVien>>(endpoint);
        this.role = role;
        this.personalInfo = response.data.data;
      } catch (error) {
        this.handleError(error, "Có lỗi xảy ra khi tải thông tin cá nhân!!!");
      } finally {
        this.setLoading(false);
      }
    },

    async checkingAuth() {
      this.setLoading(true);
      this.clearError();

      try {
        const response = await axiosInstance.get<ApiResponse<TaiKhoan>>("/auth/check-auth");
        this.user = response.data.data;
        await this.loadPersonalInfo(this.user.docGiaId || this.user.nhanVienId!, this.user.role);
        this.redirectToHome(router);
      } catch {
        this.clearUserData();
      } finally {
        this.setLoading(false);
      }
    },

    async logout() {
      this.setLoading(true);
      try {
        await axiosInstance.post("/auth/logout");
        this.clearUserData();
      } catch (error) {
        console.log("authStore logout error:", error);
        this.setLoading(false);
      }
    },

    // Helper Methods
    setLoading(isLoading: boolean) {
      this.loading = isLoading;
    },

    clearError() {
      this.error = null;
    },
    redirectToHome(router: any) {
      if (this.isDocGia) {
        router.push({path: "/"});
      } else if (this.isNhanVien) {
        router.push({path: "/dashboard"});
      }
    },

    handleError(error: any, fallbackMessage: string) {
      console.log("authStore error:", error);
      this.error = (error as string) || fallbackMessage;
    },

    clearUserData() {
      this.user = null;
      this.personalInfo = null;
      this.role = null;
      this.error = null;
      this.loading = false;
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.user,
    isDocGia: (state) => state.role === Role.DOCGIA,
    isNhanVien: (state) => state.role === Role.NHANVIEN,
  },
});
