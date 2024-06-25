// Modern AI Service for 2025 - Using OpenAI APIs and fallback services

class AIService {
  constructor() {
    this.rapidApiKey = import.meta.env.VITE_RAPID_API_ARTICLE_KEY;
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseUrl = "https://article-extractor-and-summarizer.p.rapidapi.com/";
    this.openaiRapidUrl = "https://open-ai21.p.rapidapi.com/";
  }

  // Extract and fetch article content
  async extractArticle(url) {
    try {
      const response = await fetch(`${this.baseUrl}extract?url=${encodeURIComponent(url)}`, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": this.rapidApiKey,
          "X-RapidAPI-Host": "article-extractor-and-summarizer.p.rapidapi.com",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error extracting article:", error);
      throw error;
    }
  }

  // Generate summary with different styles using OpenAI
  async generateSummary(content, style = "balanced", language = "en") {
    const stylePrompts = {
      brief: "Provide a very brief summary in 2-3 sentences.",
      detailed: "Provide a comprehensive and detailed summary covering all key points.",
      balanced: "Provide a well-balanced summary that captures the main ideas concisely.",
      bulletpoints: "Provide a summary in clear bullet points highlighting key information.",
    };

    const prompt = `${stylePrompts[style]} Please summarize the following article content in ${language}:\n\n${content}`;

    try {
      // Try OpenAI via RapidAPI first if API key is available
      if (this.rapidApiKey) {
        return await this.callOpenAI(prompt);
      } else {
        // Fallback to RapidAPI text summarizer
        return await this.summarizeWithRapidAPI(content);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      // If OpenAI fails, try RapidAPI fallback
      return await this.summarizeWithRapidAPI(content);
    }
  }

  // OpenAI API call
  async callOpenAI(prompt) {
    const response = await fetch(`${this.openaiRapidUrl}chatgpt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": this.rapidApiKey,
        "X-RapidAPI-Host": "open-ai21.p.rapidapi.com",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        web_access: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI RapidAPI error! status: ${response.status}, message: ${errorData.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    return data.result || data.content || data.message || "No response received";
  }

  // Summarize text directly using RapidAPI
  async summarizeWithRapidAPI(text) {
    try {
      const response = await fetch(`${this.baseUrl}summarize-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": this.rapidApiKey,
          "X-RapidAPI-Host": "article-extractor-and-summarizer.p.rapidapi.com",
        },
        body: JSON.stringify({
          text: text,
          lang: "en",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to summarize text: ${response.status}`);
      }

      const data = await response.json();
      return data.summary || data.text || "Unable to generate summary";
    } catch (error) {
      console.error("RapidAPI text summarization error:", error);
      throw new Error(`Text summarization failed: ${error.message}`);
    }
  }

  // Fallback to RapidAPI summarizer using text-based summarization
  async fallbackSummary(url) {
    try {
      // First try to extract the article content
      const extractResponse = await fetch(`${this.baseUrl}extract?url=${encodeURIComponent(url)}`, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": this.rapidApiKey,
          "X-RapidAPI-Host": "article-extractor-and-summarizer.p.rapidapi.com",
        },
      });

      if (!extractResponse.ok) {
        throw new Error(`Failed to extract article content: ${extractResponse.status}`);
      }

      const extractData = await extractResponse.json();
      const articleText = extractData.content || extractData.text || "";

      if (!articleText) {
        throw new Error("No article content found to summarize");
      }

      // Now summarize the extracted text
      const summaryResponse = await fetch(`${this.baseUrl}summarize-text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": this.rapidApiKey,
          "X-RapidAPI-Host": "article-extractor-and-summarizer.p.rapidapi.com",
        },
        body: JSON.stringify({
          text: articleText,
          lang: "en",
        }),
      });

      if (!summaryResponse.ok) {
        throw new Error(`Failed to summarize text: ${summaryResponse.status}`);
      }

      const summaryData = await summaryResponse.json();
      return summaryData.summary || summaryData.text || "Unable to generate summary";
    } catch (error) {
      console.error("Fallback summary error:", error);
      throw new Error(`Unable to summarize article: ${error.message}`);
    }
  }

  // Helper function to extract JSON from markdown code blocks
  extractJsonFromResponse(response) {
    try {
      // First try direct JSON parsing
      return JSON.parse(response);
    } catch {
      // If that fails, try to extract JSON from markdown code blocks
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || response.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch {
          return null;
        }
      }
      return null;
    }
  }

  // Generate key insights using AI
  async generateInsights(content) {
    const prompt = `Analyze the following article and provide 3-5 key insights or takeaways. 

Please respond with a JSON object in this format:
{
  "insights": [
    "First key insight",
    "Second key insight", 
    "Third key insight"
  ]
}

Article content:
${content}`;

    try {
      if (this.rapidApiKey) {
        const response = await this.callOpenAI(prompt);
        const parsed = this.extractJsonFromResponse(response);

        if (parsed && parsed.insights && Array.isArray(parsed.insights)) {
          return parsed.insights.map((insight) => `• ${insight}`).join("\n\n");
        }
        return response; // Fallback to raw response if JSON parsing fails
      } else {
        return "Insights feature requires RapidAPI key. Please add VITE_RAPID_API_ARTICLE_KEY to your environment.";
      }
    } catch (error) {
      console.error("Error generating insights:", error);
      return "Unable to generate insights at this time.";
    }
  }

  // Analyze sentiment
  async analyzeSentiment(content) {
    const prompt = `Analyze the sentiment of the following article content. 

Please respond with a JSON object in this format:
{
  "sentiment": "Positive|Negative|Neutral",
  "confidence": "High|Medium|Low",
  "explanation": "Brief explanation of why this sentiment was assigned",
  "key_emotions": ["emotion1", "emotion2"]
}

Article content:
${content}`;

    try {
      if (this.rapidApiKey) {
        const response = await this.callOpenAI(prompt);
        const parsed = this.extractJsonFromResponse(response);

        if (parsed && parsed.sentiment) {
          return `**Sentiment:** ${parsed.sentiment} (${parsed.confidence} confidence)\n\n**Analysis:** ${parsed.explanation}\n\n**Key Emotions:** ${parsed.key_emotions?.join(", ") || "N/A"}`;
        }
        return response; // Fallback to raw response if JSON parsing fails
      } else {
        return "Sentiment analysis requires RapidAPI key.";
      }
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      return "Unable to analyze sentiment at this time.";
    }
  }

  // Translate summary
  async translateText(text, targetLanguage) {
    const languageNames = {
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ru: "Russian",
      ja: "Japanese",
      ko: "Korean",
      zh: "Chinese",
      hi: "Hindi",
      ar: "Arabic",
    };

    const targetLangName = languageNames[targetLanguage] || targetLanguage;
    const prompt = `Translate the following text to ${targetLangName}. 

Please respond with a JSON object in this format:
{
  "original_language": "detected language",
  "target_language": "${targetLangName}",
  "translation": "the translated text",
  "confidence": "High|Medium|Low"
}

Text to translate:
${text}`;

    try {
      if (this.rapidApiKey) {
        const response = await this.callOpenAI(prompt);
        const parsed = this.extractJsonFromResponse(response);

        if (parsed && parsed.translation) {
          return `**Translation to ${parsed.target_language}:**\n\n${parsed.translation}\n\n*Original language: ${parsed.original_language} | Confidence: ${parsed.confidence}*`;
        }
        return response; // Fallback to raw response if JSON parsing fails
      } else {
        return "Translation feature requires RapidAPI key.";
      }
    } catch (error) {
      console.error("Error translating text:", error);
      return "Unable to translate at this time.";
    }
  }

  // Validate URL format
  isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  // Clean and validate URL
  cleanUrl(url) {
    // Remove any HTML tags or encoded content
    let cleanedUrl = url.trim();

    // If it contains HTML tags, it's not a valid URL
    if (cleanedUrl.includes("<") || cleanedUrl.includes(">")) {
      throw new Error("Invalid URL format. Please paste a clean article URL (e.g., https://example.com/article)");
    }

    // If it starts with www, add https://
    if (cleanedUrl.startsWith("www.")) {
      cleanedUrl = "https://" + cleanedUrl;
    }

    // Validate the URL
    if (!this.isValidUrl(cleanedUrl)) {
      throw new Error("Invalid URL format. Please enter a valid article URL starting with http:// or https://");
    }

    return cleanedUrl;
  }

  // Comprehensive article processing
  async processArticle(url, summaryStyle = "balanced", language = "en") {
    try {
      // Clean and validate the URL first
      const cleanedUrl = this.cleanUrl(url);

      // Extract article content
      let articleData;

      try {
        articleData = await this.extractArticle(cleanedUrl);
      } catch (extractError) {
        // If extraction fails, try summarization directly
        console.warn("Direct extraction failed, trying summarization:", extractError);
        const summary = await this.fallbackSummary(cleanedUrl);
        return {
          url: cleanedUrl,
          title: "Article Summary",
          summary,
          insights: "Unable to generate insights without full content.",
          sentiment: "Unable to analyze sentiment without full content.",
          translation: "",
          timestamp: new Date().toISOString(),
        };
      }

      const content = articleData.content || articleData.text || "";
      const title = articleData.title || "Untitled Article";

      // Generate summary
      const summary = await this.generateSummary(content, summaryStyle, language);

      // Generate additional insights (if RapidAPI is available)
      let insights = "";
      let sentiment = "";

      if (this.rapidApiKey && content) {
        try {
          [insights, sentiment] = await Promise.all([this.generateInsights(content), this.analyzeSentiment(content)]);
        } catch (error) {
          console.warn("Error generating additional features:", error);
          insights = "Unable to generate insights.";
          sentiment = "Unable to analyze sentiment.";
        }
      }

      return {
        url: cleanedUrl,
        title,
        summary,
        insights,
        sentiment,
        translation: "",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error processing article:", error);
      throw new Error(`Failed to process article: ${error.message}`);
    }
  }
}

export const aiService = new AIService();
