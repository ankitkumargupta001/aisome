# Aisome

An AI-powered article summarizer that leverages GPT-3.5 to provide intelligent content analysis and summarization. Built with modern React technologies for a seamless user experience.

![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.2-blue?style=flat-square&logo=tailwindcss)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-green?style=flat-square&logo=openai)
![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## Features

- **Smart Summarization**: Extract key insights from articles using GPT-3.5
- **Multiple Summary Styles**: Brief, Balanced, Detailed, and Bullet Point formats
- **Theme Support**: Dark/Light mode with persistent preferences
- **Export Options**: Save summaries as PDF, Markdown, or plain text
- **Article History**: Local storage for previously summarized articles
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Tech Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, customizable icons
- **Vite** - Fast build tool and development server

### State Management

- **Zustand** - Lightweight state management with persistent storage

### AI & APIs

- **OpenAI API (GPT-3.5)** - Primary AI engine for content analysis
- **RapidAPI Article Extractor** - Fallback service for article extraction

### Export & Utilities

- **jsPDF** - PDF generation
- **html2canvas** - HTML to canvas conversion
- **React Syntax Highlighter** - Code syntax highlighting
- **React Hot Toast** - Elegant notification system

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ankitkumargupta001/aisome.git
   cd aisome
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   Create a `.env` file in the root directory:

   ```env
   VITE_RAPID_API_ARTICLE_KEY=your_rapidapi_key_here
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## API Configuration

### Required: RapidAPI Key

Get your free API key from [Article Extractor API](https://rapidapi.com/restyler/api/article-extractor-and-summarizer)

### Optional: OpenAI API Key

For enhanced AI features, get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

> **Note**: The app will fallback to RapidAPI if OpenAI key is not provided.

## Usage

1. Enter an article URL in the input field
2. Select your preferred summary style
3. Click "Analyze" to generate the summary
4. Export or save the results as needed

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Demo.jsx        # Main summarization interface
│   ├── Hero.jsx        # Landing section
│   └── Footer.jsx      # Footer component
├── services/           # API and state management
│   ├── article.js      # Article extraction service
│   └── store.js        # Zustand store
├── utils/              # Utility functions
│   └── exportUtils.js  # Export functionality
└── assets/             # Static assets and icons
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Ankit Kumar Gupta**

- GitHub: [@ankitkumargupta001](https://github.com/ankitkumargupta001)
- Website: [ankitkumargupta.in](https://ankitkumargupta.in)

---

⭐ Star this repository if you find it useful!
