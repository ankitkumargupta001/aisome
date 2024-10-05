import { motion } from "framer-motion";
import { Heart, Zap, Brain, Globe } from "lucide-react";
import { useStore } from "../services/store";

const Footer = () => {
  const { theme } = useStore();

  const features = [
    { icon: Brain, text: "AI-Powered Analysis" },
    { icon: Zap, text: "Lightning Fast" },
    { icon: Globe, text: "Multi-language Support" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`pt-16 pb-8 mt-20 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Features Highlight */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className={`flex items-center gap-3 px-6 py-3 rounded-full ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"} transition-all duration-300 hover:scale-105`}
              >
                <Icon size={20} className="text-orange-500" />
                <span className="font-medium">{feature.text}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Main Footer Content */}
        <div className="text-center space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="space-y-3">
            <h3 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>AI Summarizer 2025</h3>
            <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Transforming how you consume content with cutting-edge AI technology</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#features" className={`hover:text-orange-500 transition-colors ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Features
            </a>
            <a href="#privacy" className={`hover:text-orange-500 transition-colors ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Privacy
            </a>
            <a href="#support" className={`hover:text-orange-500 transition-colors ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Support
            </a>
            <a
              href="https://github.com/Giri-Aayush/AI-Summarizer-Sumz"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-orange-500 transition-colors ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              GitHub
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${theme === "dark" ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-500"}`}
          >
            <div className="flex items-center gap-2">
              <span>Made with</span>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Heart size={16} className="text-red-500 fill-current" />
              </motion.div>
              <span>by Ankit Kumar Gupta</span>
            </div>

            <div className="text-sm">
              <span>© 2025 Aisome. AI-powered summarization.</span>
            </div>
          </motion.div>

          {/* Tech Stack Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 1 }} className="flex flex-wrap justify-center gap-3 pt-6">
            {["React", "Zustand", "OpenAI", "Framer Motion", "Tailwind"].map((tech, index) => (
              <span key={tech} className={`px-3 py-1 text-xs rounded-full ${theme === "dark" ? "bg-gray-800 text-gray-300 border border-gray-700" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
