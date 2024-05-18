import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set, get) => ({
      // Theme state
      theme: "light",
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

      // Articles state
      articles: [],
      currentArticle: { url: "", summary: "", insights: "", sentiment: "", translation: "" },

      // UI state
      isLoading: false,
      error: null,
      copied: "",

      // Settings
      summaryStyle: "balanced", // brief, detailed, balanced, bulletpoints
      language: "en",

      // Actions
      setCurrentArticle: (article) => set({ currentArticle: article }),

      addArticle: (article) =>
        set((state) => ({
          articles: [article, ...state.articles.slice(0, 19)], // Keep only 20 recent articles
          currentArticle: article,
        })),

      removeArticle: (url) =>
        set((state) => ({
          articles: state.articles.filter((article) => article.url !== url),
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      setCopied: (url) => {
        set({ copied: url });
        setTimeout(() => set({ copied: "" }), 3000);
      },

      setSummaryStyle: (style) => set({ summaryStyle: style }),

      setLanguage: (language) => set({ language }),

      clearError: () => set({ error: null }),

      // Search through articles
      searchArticles: (query) => {
        const articles = get().articles;
        if (!query) return articles;

        return articles.filter((article) => article.url.toLowerCase().includes(query.toLowerCase()) || article.summary.toLowerCase().includes(query.toLowerCase()));
      },
    }),
    {
      name: "ai-summarizer-storage",
      partialize: (state) => ({
        articles: state.articles,
        theme: state.theme,
        summaryStyle: state.summaryStyle,
        language: state.language,
      }),
    }
  )
);
