import {defineStore} from "pinia";
import axiosInstance, {type ApiResponse} from "@/services/axiosInstance";
import type {NhanVien, NhanVienSignUp} from "@/types/models";

interface State<T> {
  items: T[];
  selectedItem: T | null;
  editItem: NhanVienSignUp | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  search: string;
  searchBy: string;
  sortBy: string;
  sortOrder: string;
}

export const useNhanVienStore = defineStore("nhanvien", {
  state: (): State<NhanVien> => ({
    items: [],
    selectedItem: null,
    loading: false,
    editItem: null,
    error: null,
    currentPage: 1,
    pageSize: 5,
    totalItems: 0,
    totalPages: 0,
    search: "",
    searchBy: "HoTenNV",
    sortBy: "HoTenNV",
    sortOrder: "asc",
  }),

  actions: {
    // Fetch paginated NhanViens
    async fetchNhanViens(this: State<NhanVien>, page = this.currentPage, pageSize = this.pageSize) {
      this.loading = true;
      this.error = null;
      this.currentPage = page;
      this.pageSize = pageSize;

      try {
        const response = await axiosInstance.get<ApiResponse<NhanVien[]>>("/nhanvien", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
            search: this.search,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
            searchBy: this.searchBy,
          },
        });

        this.items = response.data.data;
        this.totalItems = response.data.meta?.totalItems || 0;
        this.totalPages = response.data.meta?.totalPages || 0;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu!!!";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // Fetch all NhanViens
    async fetchAllNhanViens() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get<ApiResponse<NhanVien[]>>("/nhanvien");

        this.items = response.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu!!!";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    isValidPage(page: number): boolean {
      return page >= 1 && page <= this.totalPages;
    },

    // Fetch a single NhanVien by ID
    async fetchNhanVienById(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.get<ApiResponse<NhanVien>>(`/nhanvien/${id}`);
        this.selectedItem = response.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || `Failed to fetch NhanVien with ID: ${id}`;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // Create a new NhanVien
    async createNhanVien(newNhanVien: NhanVienSignUp) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.post<ApiResponse<NhanVien>>(
          "/auth/admin-signup",
          newNhanVien
        );
        this.items.push(response.data.data);
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to create new NhanVien";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // Update a NhanVien by ID
    async updateNhanVien(id: string, updatedNhanVien: Partial<NhanVienSignUp>) {
      this.loading = true;
      this.error = null;

      const {updateAt, createAt, deleted, MSNV, username, ...toUpdate} = updatedNhanVien;
      try {
        return await axiosInstance.put<ApiResponse<NhanVien>>(`/nhanvien/${id}`, toUpdate);
      } catch (error: any) {
        this.error = error.response?.data?.message || `Failed to update NhanVien with ID: ${id}`;
      } finally {
        this.loading = false;
      }
    },

    // Delete a NhanVien by ID
    async deleteNhanVien(id: string) {
      this.loading = true;
      this.error = null;

      try {
        await axiosInstance.patch<ApiResponse<null>>(`/nhanvien/${id}`);
        this.items = this.items.filter((NhanVien) => NhanVien.MSNV !== id);
      } catch (error: any) {
        this.error = error.response?.data?.message || `Failed to delete NhanVien with ID: ${id}`;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // Methods to handle local state
    setNhanViens(data: NhanVien[]) {
      this.items = data;
    },

    selectNhanVien(NhanVien: NhanVien) {
      this.selectedItem = NhanVien;
    },

    clearSelectedNhanVien() {
      this.selectedItem = null;
    },
    setSort(sortBy: string, sortOrder: string) {
      this.sortBy = sortBy;
      this.sortOrder = sortOrder;
    },
    setSearch(search: string, searchBy: string) {
      this.search = search;
      this.searchBy = searchBy;
    },
  },

  getters: {
    selectedNhanVien: (state) => state.selectedItem,
    allNhanViens: (state) => state.items,
    NhanVienById: (state) => (id: string) => state.items.find((NhanVien) => NhanVien.MSNV === id),
  },
});
