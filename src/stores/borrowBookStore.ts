import {defineStore} from "pinia";
import axiosInstance, {type ApiResponse} from "@/services/axiosInstance";
import {BorrowStatus, type MuonSach} from "@/types/models";

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

export const useBorrowStore = defineStore("borrowBook Store", {
  state: (): State<MuonSach> => ({
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
    currentPage: 1,
    pageSize: 5,
    totalItems: 0,
    totalPages: 0,
    search: "",
    searchBy: "",
    sortBy: "NgayYeuCau",
    sortOrder: "desc",
  }),
  actions: {
    async cleanUp() {
      this.search = "";
      this.searchBy = "";
      this.sortBy = "NgayYeuCau";
      this.sortOrder = "desc";
      this.error = null;
    },
    async fetchBorrows(page = 1, pageSize = 5) {
      this.loading = true;
      this.error = null;
      this.currentPage = page;
      this.pageSize = pageSize;

      try {
        const params: Record<string, any> = {
          page: this.currentPage,
          pageSize: this.pageSize,
          search: this.search || undefined,
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
          searchBy: this.searchBy || undefined,
        };

        const response = await axiosInstance.get<ApiResponse<MuonSach[]>>("/muonsach", {
          params: params,
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

    async fetchBorrowsByUser(id: string, page: number) {
      this.loading = true;
      try {
        const params: Record<string, any> = {
          page: page ? page : this.currentPage,
          pageSize: this.pageSize,
          search: this.search,
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
          searchBy: this.searchBy,
        };

        const response = await axiosInstance.get<ApiResponse<MuonSach[]>>(
          `/muonsach/docgia/${id}`,
          {
            params: params,
          }
        );

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

    async sendRequestReturnBook(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.post<ApiResponse<null>>(
          `/muonsach/${id}/request-return`
        );
        return response.data.message;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Có lỗi xảy ra khi gửi yêu cầu trả sách!!!";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async updateBorrowStatus(id: string, status: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.patch<ApiResponse<MuonSach>>(
          `/muonsach/${id}/status`,
          {status}
        );
        return response.data.data;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || `Failed to update borrow status with ID: ${id}`;
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    // Create a new borrow
    async createBorrow(newBorrow: Omit<MuonSach, "MaMuon" | "updateAt" | "createAt" | "deleted">) {
      this.loading = true;
      this.error = null;
      const {MaNhanVien, ...rest} = newBorrow;
      try {
        const response = await axiosInstance.post<ApiResponse<MuonSach>>("/muonsach", rest);
        return response.data.data;
      } catch (error: any) {
        this.error = error.response.data.message;
      } finally {
        this.loading = false;
      }
    },

    // Update a book by ID
    async updateBorrow(id: string, updateBorrow: Partial<MuonSach>) {
      this.loading = true;
      this.error = null;
      try {
        const {MaMuon, updateAt, createAt, deleted, ...borrowToUpdate} = updateBorrow;
        const response = await axiosInstance.patch<ApiResponse<MuonSach>>(
          `/muonsach/${id}/status`,
          borrowToUpdate
        );
      } catch (error: any) {
        this.error = error.response?.data?.message || `Failed to update borrow with ID: ${id}`;
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async acceptBorrow(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.patch<ApiResponse<MuonSach>>(
          `/muonsach/${id}/status`,
          {status: BorrowStatus.ACCEPTED}
        );
        return response.data.data;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || `Failed to update borrow status with ID: ${id}`;
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async rejectBorrow(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.patch<ApiResponse<MuonSach>>(
          `/muonsach/${id}/status`,
          {status: BorrowStatus.REJECTED}
        );
        return response.data.data;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || `Failed to update borrow status with ID: ${id}`;
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async collectedBook(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.patch<ApiResponse<MuonSach>>(
          `/muonsach/${id}/status`,
          {status: BorrowStatus.BORROWED}
        );
        return response.data.data;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || `Failed to update borrow status with ID: ${id}`;
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async returnedBook(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.patch<ApiResponse<MuonSach>>(
          `/muonsach/${id}/status`,
          {status: BorrowStatus.RETURNED}
        );
        return response.data.data;
      } catch (error: any) {
        this.error =
          error.response?.data?.message || `Failed to update borrow status with ID: ${id}`;
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    async deleteBorrow(MaMuon: string) {
      this.loading = true;
      this.error = null;
      try {
        await axiosInstance.patch<ApiResponse<null>>(`/muonsach/${MaMuon}`);
        this.items = this.items.filter((book) => book.MaMuon !== MaMuon);
      } catch (error: any) {
        this.error =
          error.response?.data?.message || `Failed to delete book with MaSach: ${MaMuon}`;
        console.log({MaMuon: MaMuon, error: error});
      } finally {
        this.loading = false;
      }
    },
    isValidPage(page: number): boolean {
      return page >= 1 && page <= this.totalPages;
    },

    // Methods to handle local state
    setBorrows(data: MuonSach[]) {
      this.items = data;
    },
    selectBorrow(muonsach: MuonSach) {
      this.selectedItem = muonsach;
    },
    clearSelectedBorrow() {
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
    selectedBorrow: (state) => state.selectedItem,
    allBorrows: (state) => state.items,
  },
});
