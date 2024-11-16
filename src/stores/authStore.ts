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

        await this.loadPersonalInfo();
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
        await this.loadPersonalInfo();
        this.redirectToHome(router);
      } catch (error: any) {
        this.error = error.response.data.message;
        this.handleError(error, "Có lỗi xảy ra khi đăng ký tài khoản!!!");
      } finally {
        this.setLoading(false);
      }
    },

    async updateAccount(data: Partial<TaiKhoan>) {
      this.setLoading(true);
      this.clearError();

      try {
        const response = await axiosInstance.put<ApiResponse<TaiKhoan>>(
          `/auth/update-account/${this.user?.id}`,
          data
        );
        this.user = response.data.data;
        await this.loadPersonalInfo();
      } catch (error) {
        this.handleError(error, "Có lỗi xảy ra khi cập nhật thông tin tài khoản!!!");
      } finally {
        this.setLoading(false);
      }
    },

    async changePassword(data: {currentPassword: string; newPassword: string; rePassword: string}) {
      this.setLoading(true);
      this.clearError();

      try {
        await axiosInstance.put<ApiResponse<TaiKhoan>>(
          `/auth/change-password/${this.user?.id}`,
          data
        );
        this.error = "Đổi mật khẩu thành công!!!";
      } catch (error) {
        this.handleError(error, "Có lỗi xảy ra khi đổi mật khẩu!!!");
      } finally {
        this.setLoading(false);
      }
    },

    async authenticate(endpoint: string, credentials: {username: string; password: string}) {
      const response = await axiosInstance.post<ApiResponse<TaiKhoan>>(endpoint, credentials);
      this.user = response.data.data;
      return this.user!;
    },

    async loadPersonalInfo() {
      this.setLoading(true);
      this.clearError();

      const role = this.user!.role;

      try {
        if (role === Role.DOCGIA) {
          this.personalInfo = this.user!.docGia;
        } else {
          this.personalInfo = this.user!.nhanVien;
        }
        this.role = role;
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
        await this.loadPersonalInfo();
      } catch (error) {
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
        if (router.currentRoute.value.path.startsWith("/dashboard")) {
          router.push({path: "/login"});
        }
      } catch (error) {
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
      } else if (this.isNhanVien || this.isAdmin) {
        router.push({path: "/dashboard"});
      }
    },

    handleError(error: any, fallbackMessage: string) {
      if (error.code === "ERR_NETWORK") {
        this.error = "Không thể kết nối đến máy chủ!!!";
        return;
      }

      this.error = error.response.data.message || fallbackMessage;
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
    isAdmin: (state) => state.role === Role.ADMIN,
    getPersonalInfo: (state) => state.personalInfo,
  },
});
