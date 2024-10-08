import {ref, watch, onMounted} from "vue";

export function useTheme() {
  const theme = ref<"light" | "dark">("light");

  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
  };

  const applyTheme = (newTheme: "light" | "dark") => {
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  watch(theme, (newTheme) => {
    applyTheme(newTheme);
  });

  onMounted(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      theme.value = savedTheme;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme.value = "dark";
    }
    applyTheme(theme.value);
  });

  return {theme, toggleTheme};
}
