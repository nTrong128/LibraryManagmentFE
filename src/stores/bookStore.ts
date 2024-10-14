import {defineStore} from "pinia";
import axiosInstance, {type ApiResponse} from "@/services/axiosInstance";
import {type Sach} from "@/types/models";

const CLOUDNAME = import.meta.env.VITE_CLOUDINARY_NAME;

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
  sortBy: string;
  sortOrder: string;
}

export const useBookStore = defineStore("book", {
  state: (): State<Sach> => ({
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
    currentPage: 1,
    pageSize: 5,
    totalItems: 0,
    totalPages: 0,
    search: "",
    sortBy: "MaSach",
    sortOrder: "asc",
  }),
  actions: {
    async fetchBooks(page = 1, pageSize = 5) {
      this.loading = true;
      this.error = null;
      this.currentPage = page;
      this.pageSize = pageSize;

      try {
        const params: Record<string, any> = {
          page: this.currentPage,
          pageSize: this.pageSize,
          search: this.search,
          sortBy: this.sortBy,
          sortOrder: this.sortOrder,
        };

        const response = await axiosInstance.get<ApiResponse<Sach[]>>("/sach", {
          params: params,
        });

        this.items = response.data.data;
        this.totalItems = response.data.meta?.totalItems || 0;
        this.totalPages = response.data.meta?.totalPages || 0;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu!!!";
        console.error(error);
      } finally {
        // Simulate loading time for development, remove in production

        this.loading = false;
      }
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

    async uploadImage(file: File): Promise<string> {
      const url = `https://api.cloudinary.com/v1_1/${CLOUDNAME}/upload`;
      const formData = new FormData();
      formData.append("tags", "browser_upload");
      formData.append("upload_preset", "libraryManagement");
      formData.append("folder", "libraryManagement");
      formData.append("file", file);

      try {
        const response = await axiosInstance.post(url, formData, {
          withCredentials: false,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Uploaded image response:", response.data);
        if (response.data.secure_url) {
          return response.data.secure_url;
        } else {
          throw new Error("Upload failed");
        }
      } catch (error: any) {
        console.error("Error uploading the file:", error);
        throw new Error(error.response?.data?.message || "Failed to upload image");
      }
    },

    // Create a new book
    async createBook(
      newBook: Omit<Sach, "MaSach" | "updateAt" | "createAt" | "deleted">,
      imageFile?: File
    ) {
      this.loading = true;
      this.error = null;
      try {
        if (imageFile) {
          const imageUrl = await this.uploadImage(imageFile);
          console.log("Uploaded image URL:", imageUrl);
          newBook.image = imageUrl;
        }
        const response = await axiosInstance.post<ApiResponse<Sach>>("/sach", newBook);
        this.items.push(response.data.data);
        return response.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to create new book";
        console.error(error);
        throw error;
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
    isValidPage(page: number): boolean {
      return page >= 1 && page <= this.totalPages;
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
    setSort(sortBy: string, sortOrder: string) {
      this.sortBy = sortBy;
      this.sortOrder = sortOrder;
    },
    setSearch(search: string) {
      this.search = search;
    },
  },
  getters: {
    allBooks: (state) => state.items,
    bookById: (state) => (id: string) => state.items.find((book) => book.MaSach === id),
  },
});
