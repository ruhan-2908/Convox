import { create } from "zustand";

export const useThemeStore = create((set) => {
    const storedTheme = localStorage.getItem("chat-theme") || "coffee";

    return {
        theme: storedTheme,
        setTheme: (theme) => {
            localStorage.setItem("chat-theme", theme);
            if (typeof document !== "undefined") {
                document.documentElement.setAttribute("data-theme", theme);
            }
            set({ theme });
        },
    };
});
