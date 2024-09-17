import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LinkIcon, Copy, Check, Download, Share2, Volume2, VolumeX, Settings, Lightbulb, Heart, Languages, Trash2, Search, FileText, FileImage, FileJson } from "lucide-react";
import toast from "react-hot-toast";

import { copy, linkIcon, loader, tick } from "../assets";
import { useStore } from "../services/store";
import { aiService } from "../services/article";
import { ExportUtils } from "../utils/exportUtils";

const Demo = () => {
  const {
    articles,
    currentArticle,
    isLoading,
    error,
    copied,
    summaryStyle,
    language,
    theme,
    addArticle,
    removeArticle,
    setCurrentArticle,
    setLoading,
    setError,
    setCopied,
    setSummaryStyle,
    setLanguage,
    clearError,
    searchArticles,
  } = useStore();

  const [url, setUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const summaryStyles = [
    { value: "brief", label: "Brief", icon: "⚡" },
    { value: "balanced", label: "Balanced", icon: "⚖️" },
    { value: "detailed", label: "Detailed", icon: "📝" },
    { value: "bulletpoints", label: "Bullet Points", icon: "📋" },
  ];

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "ru", label: "Russian" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "zh", label: "Chinese" },
    { value: "hi", label: "Hindi" },
    { value: "ar", label: "Arabic" },
  ];

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!url.trim()) {
        toast.error("Please enter a valid article URL");
        return;
      }

      // Basic client-side URL validation
      const trimmedUrl = url.trim();
      if (trimmedUrl.includes("<") || trimmedUrl.includes(">")) {
        toast.error("Please paste a clean article URL, not HTML content");
        return;
      }

      setLoading(true);
      setError(null);
      clearError();

      try {
        const result = await aiService.processArticle(trimmedUrl, summaryStyle, language);
        addArticle(result);
        setUrl("");
        toast.success("Article processed successfully!");
      } catch (error) {
        console.error("Error processing article:", error);
        setError(error.message);
        toast.error(error.message || "Failed to process article. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [url, summaryStyle, language, setLoading, setError, clearError, addArticle]
  );

  const handleCopy = useCallback(
    async (text, type = "URL") => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(text);
        toast.success(`${type} copied to clipboard!`);
      } catch (error) {
        toast.error("Failed to copy to clipboard");
      }
    },
    [setCopied]
  );

  const handleSpeak = useCallback(
    (text) => {
      if ("speechSynthesis" in window) {
        if (isSpeaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
        } else {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.onstart = () => setIsSpeaking(true);
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);
          window.speechSynthesis.speak(utterance);
        }
      } else {
        toast.error("Speech synthesis not supported in this browser");
      }
    },
    [isSpeaking]
  );

  const handleTranslate = useCallback(
    async (targetLang) => {
      if (!currentArticle.summary) return;

      setIsTranslating(true);
      try {
        const translation = await aiService.translateText(currentArticle.summary, targetLang);
        setCurrentArticle({
          ...currentArticle,
          translation,
        });
        toast.success("Translation completed!");
      } catch (error) {
        toast.error("Translation failed");
      } finally {
        setIsTranslating(false);
      }
    },
    [currentArticle, setCurrentArticle]
  );

  const handleExport = useCallback(
    async (format) => {
      if (!currentArticle.summary) return;

      try {
        let fileName;
        switch (format) {
          case "pdf":
            fileName = await ExportUtils.exportToPDF(currentArticle);
            break;
          case "markdown":
            fileName = ExportUtils.exportToMarkdown(currentArticle);
            break;
          case "json":
            fileName = ExportUtils.exportToJSON(currentArticle);
            break;
          case "text":
            fileName = ExportUtils.exportToText(currentArticle);
            break;
          default:
            throw new Error("Unsupported format");
        }
        toast.success(`Exported as ${fileName}`);
      } catch (error) {
        toast.error("Export failed");
      }
    },
    [currentArticle]
  );

  const handleShare = useCallback(async () => {
    if (!currentArticle.summary) return;

    try {
      const success = await ExportUtils.shareArticle(currentArticle);
      if (success) {
        toast.success("Content shared successfully!");
      } else {
        toast.error("Sharing failed");
      }
    } catch (error) {
      toast.error("Sharing failed");
    }
  }, [currentArticle]);

  const filteredArticles = searchQuery ? searchArticles(searchQuery) : articles;

  return (
    <section className={`mt-16 w-full max-w-6xl ${theme === "dark" ? "text-white" : ""}`}>
      {/* URL Input Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col w-full gap-4">
        <form className="relative flex justify-center items-center" onSubmit={handleSubmit}>
          <LinkIcon className="absolute left-3 w-5 h-5 text-gray-400" />
          <input
            type="url"
            placeholder="Paste article URL here (e.g., https://example.com/article)..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className={`w-full pl-12 pr-32 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
              theme === "dark" ? "bg-gray-800 border-gray-600 text-white focus:border-orange-500" : "bg-white border-gray-200 text-gray-900 focus:border-orange-500"
            }`}
          />
          <div className="absolute right-2 flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <Settings size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-all"
            >
              {isLoading ? "Processing..." : "Analyze"}
            </motion.button>
          </div>
        </form>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`rounded-xl p-6 border-2 ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200"}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Summary Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {summaryStyles.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setSummaryStyle(style.value)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                          summaryStyle === style.value ? "bg-orange-500 text-white" : theme === "dark" ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {style.icon} {style.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-3">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className={`w-full p-3 rounded-lg border-2 ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-900"}`}
                  >
                    {languages.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Articles */}
        {articles.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search your articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all ${theme === "dark" ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-900"}`}
            />
          </div>
        )}

        {/* Article History */}
        {filteredArticles.length > 0 && (
          <motion.div layout className="flex flex-col gap-3 max-h-60 overflow-y-auto">
            <AnimatePresence>
              {filteredArticles.map((item, index) => (
                <motion.div
                  key={`${item.url}-${index}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => setCurrentArticle(item)}
                  className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    theme === "dark" ? "bg-gray-800 border-gray-600 hover:bg-gray-700" : "bg-white border-gray-200 hover:bg-gray-50"
                  } ${currentArticle.url === item.url ? "ring-2 ring-orange-500" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item.url);
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                    >
                      {copied === item.url ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeArticle(item.url);
                        toast.success("Article removed");
                      }}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.title || "Untitled"}</p>
                    <p className="text-xs text-gray-500 truncate">{item.url}</p>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>

      {/* Results Section */}
      <div className="my-10 max-w-full">
        {isLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12">
            <motion.img animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} src={loader} alt="loader" className="w-16 h-16 object-contain mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Processing your article with AI...</p>
          </motion.div>
        ) : error ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
            <p className="font-bold text-red-600 mb-2">Something went wrong</p>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button onClick={clearError} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Try Again
            </button>
          </motion.div>
        ) : (
          currentArticle.summary && (
            <motion.div
              id="summary-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-8 border-2 shadow-lg ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`}
            >
              {/* Article Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{currentArticle.title || "Article Summary"}</h2>
                  <p className="text-sm text-gray-500 break-all">{currentArticle.url}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={() => handleSpeak(currentArticle.summary)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <button onClick={() => handleCopy(currentArticle.summary, "Summary")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    {copied === currentArticle.summary ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                  <button onClick={handleShare} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-6 border-b dark:border-gray-600">
                {[
                  { id: "summary", label: "Summary", icon: FileText },
                  { id: "insights", label: "Insights", icon: Lightbulb },
                  { id: "sentiment", label: "Sentiment", icon: Heart },
                  { id: "translation", label: "Translation", icon: Languages },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-all ${
                        activeTab === tab.id ? "bg-orange-500 text-white" : theme === "dark" ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  {activeTab === "summary" && (
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="leading-relaxed">{currentArticle.summary}</p>
                    </div>
                  )}

                  {activeTab === "insights" && (
                    <div className="prose dark:prose-invert max-w-none">
                      {currentArticle.insights ? (
                        <p className="leading-relaxed">{currentArticle.insights}</p>
                      ) : (
                        <div className="text-gray-500 text-center py-8">
                          <Lightbulb size={48} className="mx-auto mb-4 opacity-50" />
                          <p>AI Insights available with RapidAPI</p>
                          <p className="text-sm">Add VITE_RAPID_API_ARTICLE_KEY to your environment</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "sentiment" && (
                    <div className="prose dark:prose-invert max-w-none">
                      {currentArticle.sentiment ? (
                        <p className="leading-relaxed">{currentArticle.sentiment}</p>
                      ) : (
                        <div className="text-gray-500 text-center py-8">
                          <Heart size={48} className="mx-auto mb-4 opacity-50" />
                          <p>Sentiment analysis available with RapidAPI</p>
                          <p className="text-sm">Add VITE_RAPID_API_ARTICLE_KEY to your environment</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "translation" && (
                    <div>
                      {currentArticle.translation ? (
                        <div className="prose dark:prose-invert max-w-none">
                          <p className="leading-relaxed">{currentArticle.translation}</p>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Languages size={48} className="mx-auto mb-4 opacity-50" />
                          <p className="mb-4">Translate summary to different languages</p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {languages
                              .filter((lang) => lang.value !== "en")
                              .slice(0, 6)
                              .map((lang) => (
                                <button
                                  key={lang.value}
                                  onClick={() => handleTranslate(lang.value)}
                                  disabled={isTranslating}
                                  className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 text-sm"
                                >
                                  {lang.label}
                                </button>
                              ))}
                          </div>
                          {isTranslating && <p className="mt-4 text-gray-500">Translating...</p>}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Export Options */}
              <div className="flex flex-wrap justify-center gap-3 mt-8 pt-6 border-t dark:border-gray-600">
                <button onClick={() => handleExport("pdf")} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
                  <FileImage size={16} />
                  PDF
                </button>
                <button onClick={() => handleExport("markdown")} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                  <FileText size={16} />
                  Markdown
                </button>
                <button onClick={() => handleExport("json")} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">
                  <FileJson size={16} />
                  JSON
                </button>
                <button onClick={() => handleExport("text")} className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm">
                  <FileText size={16} />
                  Text
                </button>
              </div>
            </motion.div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
