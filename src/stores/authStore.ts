import {defineStore} from "pinia";
import axiosInstance, {type ApiResponse} from "@/services/axiosInstance";

interface State<T> {
  items: T;
  loading: boolean;
  error: string | null;
}

export const useBookStore = defineStore("auth", {
  state: (): State<null> => ({
    items: null,
    loading: false,
    error: null,
  }),
  actions: {},
  getters: {},
});
