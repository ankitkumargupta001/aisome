import { motion } from "framer-motion";
import { Sun, Moon, Github, Sparkles } from "lucide-react";
import { logo } from "../assets";
import { useStore } from "../services/store";

const Hero = () => {
  const { theme, toggleTheme } = useStore();

  return (
    <motion.header initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full flex justify-center items-center flex-col relative">
      <nav className="flex justify-between items-center w-full mb-10 pt-3">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Aisome</span>
            </h1>
          </div>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
            <Sparkles className="w-6 h-6 text-orange-500" />
          </motion.div>
        </motion.div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ${theme === "dark" ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => window.open("https://github.com/ankitkumargupta001/aisome", "_blank")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${theme === "dark" ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-800"}`}
          >
            <Github size={18} />
            <span>GitHub</span>
          </motion.button>
        </div>
      </nav>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-center">
        <h1 className={`head_text ${theme === "dark" ? "text-white" : ""}`}>
          Smart Article Summarization with <br className="max-md:hidden" />
          <span className="orange_gradient">Aisome AI</span>
        </h1>

        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className={`desc mt-6 text-center mx-auto ${theme === "dark" ? "text-gray-300" : ""}`}>
          Transform any article into concise, actionable insights using GPT-3.5. Get intelligent summaries, extract key points, and export your content in multiple formats—all in seconds.
        </motion.h2>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-wrap justify-center gap-4 mt-8">
          <div className={`feature-badge ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
            <Sparkles size={16} />
            <span>GPT-3.5 Powered</span>
          </div>
          <div className={`feature-badge ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
            📝 <span>Smart Summaries</span>
          </div>
          <div className={`feature-badge ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
            🎨 <span>Multiple Formats</span>
          </div>
          <div className={`feature-badge ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
            📤 <span>Export & Share</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.header>
  );
};

export default Hero;
