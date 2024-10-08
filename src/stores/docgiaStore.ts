import {defineStore} from "pinia";
import axiosInstance, {type ApiResponse} from "@/services/axiosInstance"; // Import axios instance and ApiResponse interface
import {type Docgia} from "@/types/models";

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

export const useDocgiaStore = defineStore("docgia", {
  state: (): State<Docgia> => ({
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
    async fetchDocgia(page = 1, pageSize = 5) {
      this.loading = true;
      this.error = null;
      this.currentPage = page;
      this.pageSize = pageSize;

      try {
        const response = await axiosInstance.get<ApiResponse<Docgia[]>>("/docgia", {
          params: {
            page: this.currentPage,
            pageSize: this.pageSize,
          },
        });

        this.items = response.data.data;
        this.totalItems = response.data.meta?.totalItems || 0;
        this.totalPages = response.data.meta?.totalPages || 0;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to fetch docgias";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchAllDocgia() {
      this.loading = true;
      this.error = null;
      this.currentPage = 1; // Reset to first page if fetching all
      this.pageSize = 0; // Set pageSize to 0 to indicate "all items"

      try {
        const response = await axiosInstance.get<ApiResponse<Docgia[]>>("/docgia");

        this.items = response.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to fetch all docgias";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    isValidPage(page: number): boolean {
      return page >= 1 && page <= this.totalPages;
    },

    async fetchDocgiaById(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get<ApiResponse<Docgia>>(`/docgia/${id}`);
        this.selectedItem = response.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || `Failed to fetch docgia with ID: ${id}`;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async createDocgia(newDocgia: Docgia) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.post<ApiResponse<Docgia>>("/docgia", newDocgia);
        this.items.push(response.data.data);
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to create new docgia";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async updateDocgia(id: string, updatedDocgia: Partial<Docgia>) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.put<ApiResponse<Docgia>>(
          `/docgia/${id}`,
          updatedDocgia
        );
        const index = this.items.findIndex((docgia) => docgia.MaDocGia === id);
        if (index !== -1) {
          this.items[index] = response.data.data;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || `Failed to update docgia with ID: ${id}`;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async deleteDocgia(id: string) {
      this.loading = true;
      this.error = null;
      try {
        await axiosInstance.delete<ApiResponse<null>>(`/docgia/${id}`);
        this.items = this.items.filter((docgia) => docgia.MaDocGia !== id);
      } catch (error: any) {
        this.error = error.response?.data?.message || `Failed to delete docgia with ID: ${id}`;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // Methods to handle local state
    setDocgias(data: Docgia[]) {
      this.items = data;
    },
    selectDocgia(docgia: Docgia) {
      this.selectedItem = docgia;
    },
    clearSelectedDocgia() {
      this.selectedItem = null;
    },
  },
  getters: {
    allDocgias: (state) => state.items,
    docgiaById: (state) => (id: string) => state.items.find((docgia) => docgia.MaDocGia === id),
  },
});
