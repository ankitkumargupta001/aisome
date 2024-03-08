import { useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "./components/Hero";
import Demo from "./components/Demo";
import Footer from "./components/Footer";
import { useStore } from "./services/store";
import "./App.css";

const App = () => {
  const { theme } = useStore();

  useEffect(() => {
    // Apply theme to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <main className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "dark bg-gray-900" : "bg-white"}`}>
      <div className="main">
        <div className="gradient" />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="app relative z-10">
        <Hero />
        <Demo />
        <Footer />
      </motion.div>
    </main>
  );
};

export default App;
