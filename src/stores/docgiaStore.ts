import {defineStore} from "pinia";
import axiosInstance, {type ApiResponse} from "@/services/axiosInstance"; // Import axios instance and ApiResponse interface
import {type Docgia, type DocGiaSignUp} from "@/types/models";

interface State<T> {
  items: T[];
  selectedItem: T | null;
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

export const useDocgiaStore = defineStore("docgia", {
  state: (): State<Docgia> => ({
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
    currentPage: 1,
    pageSize: 5,
    totalItems: 0,
    totalPages: 0,
    search: "",
    searchBy: "HoTen",
    sortBy: "HoTen",
    sortOrder: "asc",
  }),
  actions: {
    async fetchDocgia(this: State<Docgia>, page = this.currentPage, pageSize = this.pageSize) {
      this.loading = true;
      this.error = null;
      this.currentPage = page;
      this.pageSize = pageSize;

      try {
        const response = await axiosInstance.get<ApiResponse<Docgia[]>>("/docgia", {
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

    async fetchAllDocgia() {
      this.loading = true;
      this.error = null;

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
    async createDocgia(newDocgia: DocGiaSignUp) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.post<ApiResponse<Docgia>>(
          "/auth/admin-create-user",
          newDocgia
        );
        this.items.push(response.data.data);
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to create new docgia";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async updateDocgia(id: string, updatedDocgia: Partial<DocGiaSignUp>) {
      this.loading = true;
      this.error = null;

      const {updateAt, createAt, deleted, MaDocGia, username, ...docgia} = updatedDocgia;

      try {
        return await axiosInstance.put<ApiResponse<Docgia>>(`/docgia/${id}`, docgia);
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
        await axiosInstance.patch<ApiResponse<null>>(`/docgia/${id}`);
        this.items = this.items.filter((docgia) => docgia.MaDocGia !== id);
      } catch (error: any) {
        this.error = error.response?.data?.message || `Failed to delete docgia with ID: ${id}`;
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
    selectedDocgia: (state) => state.selectedItem,
    allDocgias: (state) => state.items,
    docgiaById: (state) => (id: string) => state.items.find((docgia) => docgia.MaDocGia === id),
  },
});
