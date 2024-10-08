import {defineStore} from "pinia";
import axiosInstance, {type ApiResponse} from "@/services/axiosInstance"; // Import axios instance and ApiResponse interface
import {type NhaXuatBan} from "@/types/models"; // Assuming you have defined the `NhaXuatBan` type

interface State<T> {
  items: T[];
  selectedItem: T | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export const useNhaXuatBanStore = defineStore("nhaxuatban", {
  state: (): State<NhaXuatBan> => ({
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
    currentPage: 1, // Start with the first page
    pageSize: 5, // Default page size
    totalItems: 0, // Total number of items
    totalPages: 0, // Total number of pages
  }),

  actions: {
    // Fetch paginated NhaXuatBans
    async fetchNhaXuatBans(page = 1, pageSize = 5) {
      this.loading = true;
      this.error = null;
      this.currentPage = page;
      this.pageSize = pageSize;

      try {
        const response = await axiosInstance.get<ApiResponse<NhaXuatBan[]>>("/nhaxuatban", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
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

    // Fetch all NhaXuatBans
    async fetchAllNhaXuatBans() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get<ApiResponse<NhaXuatBan[]>>("/nhaxuatban");

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

    // Fetch a single nhaxuatban by ID
    async fetchNhaXuatBanById(id: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.get<ApiResponse<NhaXuatBan>>(`/nhaxuatban/${id}`);
        this.selectedItem = response.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || `Failed to fetch NhaXuatBan with ID: ${id}`;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // Create a new NhaXuatBan
    async createNhaXuatBan(
      newNhaXuatBan: Omit<NhaXuatBan, "MaNXB" | "updateAt" | "createAt" | "deleted">
    ) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axiosInstance.post<ApiResponse<NhaXuatBan>>(
          "/nhaxuatban",
          newNhaXuatBan
        );
        this.items.push(response.data.data);
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to create new NhaXuatBan";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // Update a NhaXuatBan by ID
    async updateNhaXuatBan(id: string, updatedNhaXuatBan: Partial<NhaXuatBan>) {
      this.loading = true;
      this.error = null;

      const {MaNXB, ...nhaXuatBanToUpdate} = updatedNhaXuatBan;

      try {
        const response = await axiosInstance.put<ApiResponse<NhaXuatBan>>(
          `/nhaxuatban/${id}`,
          nhaXuatBanToUpdate
        );
        const index = this.items.findIndex((nhaxuatban) => nhaxuatban.MaNXB === id);
        if (index !== -1) {
          this.items[index] = response.data.data;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || `Failed to update NhaXuatBan with ID: ${id}`;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // Delete a NhaXuatBan by ID
    async deleteNhaXuatBan(id: string) {
      this.loading = true;
      this.error = null;

      try {
        await axiosInstance.delete<ApiResponse<null>>(`/nhaxuatban/${id}`);
        this.items = this.items.filter((nhaxuatban) => nhaxuatban.MaNXB !== id);
      } catch (error: any) {
        this.error = error.response?.data?.message || `Failed to delete NhaXuatBan with ID: ${id}`;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // Methods to handle local state
    setNhaXuatBans(data: NhaXuatBan[]) {
      this.items = data;
    },

    selectNhaXuatBan(nhaxuatban: NhaXuatBan) {
      this.selectedItem = nhaxuatban;
    },

    clearSelectedNhaXuatBan() {
      this.selectedItem = null;
    },
  },

  getters: {
    allNhaXuatBans: (state) => state.items,
    nhaXuatBanById: (state) => (id: string) =>
      state.items.find((nhaxuatban) => nhaxuatban.MaNXB === id),
  },
});
