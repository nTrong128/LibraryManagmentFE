import {defineStore} from "pinia";
import axiosInstance, {type ApiResponse} from "@/services/axiosInstance";
import {type Sach} from "@/types/models";

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

export const useBookStore = defineStore("book", {
  state: (): State<Sach> => ({
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
    // Fetch all books
    async fetchBooks(page = 1, pageSize = 5) {
      this.loading = true;
      this.error = null;
      this.currentPage = page;
      this.pageSize = pageSize;
      try {
        const response = await axiosInstance.get<ApiResponse<Sach[]>>("/sach", {
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
        // FIXME: Remove this line in production
        await new Promise((resolve) => setTimeout(resolve, 0)); // Simulate loading time
        this.loading = false;
      }
    },
    isValidPage(page: number): boolean {
      return page >= 1 && page <= this.totalPages;
    },

    // Fetch a single book by ID
    async fetchBookById(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get<ApiResponse<Sach>>(`/sach/${id}`);
        this.selectedItem = response.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || `Failed to fetch book with ID: ${id}`;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // Create a new book
    async createBook(newBook: Omit<Sach, "MaSach" | "updateAt" | "createAt" | "deleted">) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosInstance.post<ApiResponse<Sach>>("/sach", newBook);
        this.items.push(response.data.data);
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to create new book";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // Update a book by ID
    async updateBook(id: string, updatedBook: Partial<Sach>) {
      this.loading = true;
      this.error = null;
      try {
        const {MaSach, ...bookToUpdate} = updatedBook;
        const response = await axiosInstance.put<ApiResponse<Sach>>(`/sach/${id}`, bookToUpdate);
        const index = this.items.findIndex((book) => book.MaSach === id);
        if (index !== -1) {
          this.items[index] = response.data.data;
        }
      } catch (error: any) {
        this.error = error.response?.data?.message || `Failed to update book with ID: ${id}`;
        console.log(error);
      } finally {
        this.loading = false;
      }
    },

    // Delete a book by ID
    async deleteBook(MaSach: string) {
      this.loading = true;
      this.error = null;
      try {
        await axiosInstance.patch<ApiResponse<null>>(`/sach/${MaSach}`);
        this.items = this.items.filter((book) => book.MaSach !== MaSach);
      } catch (error: any) {
        this.error =
          error.response?.data?.message || `Failed to delete book with MaSach: ${MaSach}`;
        console.log({MaSach: MaSach, error: error});
      } finally {
        this.loading = false;
      }
    },

    // Methods to handle local state
    setBooks(data: Sach[]) {
      this.items = data;
    },
    selectBook(book: Sach) {
      this.selectedItem = book;
    },
    clearSelectedBook() {
      this.selectedItem = null;
    },
  },
  getters: {
    allBooks: (state) => state.items,
    bookById: (state) => (id: string) => state.items.find((book) => book.MaSach === id),
  },
});
