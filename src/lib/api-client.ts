import axios from "axios";
import type { AxiosError } from "axios";

// Types for API responses
export interface ImgflipResponse<T> {
  success: boolean;
  data: T;
  error_message?: string;
}

export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
  captions?: number;
}

export interface CaptionedMeme {
  url: string;
  page_url: string;
}

export interface AIGeneratedMeme extends CaptionedMeme {
  template_id: number;
  texts: string[];
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: "https://api.imgflip.com",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

// Add request interceptor to handle credentials
apiClient.interceptors.request.use((config) => {
  // Add credentials to POST requests
  if (config.method === "post") {
    const credentials = {
      username: process.env.NEXT_PUBLIC_IMGFLIP_USERNAME,
      password: process.env.NEXT_PUBLIC_IMGFLIP_PASSWORD,
    };
    config.data = { ...config.data, ...credentials };
  }
  return config;
});

// Error handler helper
const handleApiError = (error: AxiosError<ImgflipResponse<any>>) => {
  if (error.response) {
    throw new Error(error.response.data.error_message || "API request failed");
  }
  throw error;
};

// API endpoints
export const imgflipApi = {
  // Get popular meme templates
  getMemes: async () => {
    try {
      const response = await apiClient.get<
        ImgflipResponse<{ memes: MemeTemplate[] }>
      >("/get_memes");
      return response.data.data.memes;
    } catch (error) {
      handleApiError(error as AxiosError<ImgflipResponse<any>>);
    }
  },

  // Caption a meme template
  captionImage: async (params: {
    template_id: string;
    text0?: string;
    text1?: string;
    boxes?: Array<{
      text: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      color?: string;
      outline_color?: string;
    }>;
    font?: string;
    max_font_size?: number;
  }) => {
    try {
      const response = await apiClient.post<ImgflipResponse<CaptionedMeme>>(
        "/caption_image",
        params
      );
      return response.data.data;
    } catch (error) {
      handleApiError(error as AxiosError<ImgflipResponse<any>>);
    }
  },

  // Caption a GIF (Premium)
  captionGif: async (params: {
    template_id: string;
    boxes: Array<{
      text: string;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      color?: string;
      outline_color?: string;
    }>;
    font?: string;
    max_font_size?: number;
    no_watermark?: boolean;
  }) => {
    try {
      const response = await apiClient.post<ImgflipResponse<CaptionedMeme>>(
        "/caption_gif",
        params
      );
      return response.data.data;
    } catch (error) {
      handleApiError(error as AxiosError<ImgflipResponse<any>>);
    }
  },

  // Search meme templates (Premium)
  searchMemes: async (params: { query: string; include_nsfw?: boolean }) => {
    try {
      const response = await apiClient.post<
        ImgflipResponse<{ memes: MemeTemplate[] }>
      >("/search_memes", params);
      return response.data.data.memes;
    } catch (error) {
      handleApiError(error as AxiosError<ImgflipResponse<any>>);
    }
  },

  // Get meme by ID (Premium)
  getMeme: async (template_id: string) => {
    try {
      const response = await apiClient.post<
        ImgflipResponse<{ meme: MemeTemplate }>
      >("/get_meme", { template_id });
      return response.data.data.meme;
    } catch (error) {
      handleApiError(error as AxiosError<ImgflipResponse<any>>);
    }
  },

  // Generate meme with AI (Premium)
  generateAIMeme: async (params: {
    text?: string;
    model?: "openai" | "classic";
    template_id?: string;
    prefix_text?: string;
    no_watermark?: boolean;
  }) => {
    try {
      const response = await apiClient.post<ImgflipResponse<AIGeneratedMeme>>(
        "/ai_meme",
        params
      );
      return response.data.data;
    } catch (error) {
      handleApiError(error as AxiosError<ImgflipResponse<any>>);
    }
  },

  // Auto-generate meme from text (Premium)
  autoMeme: async (params: { text: string; no_watermark?: boolean }) => {
    try {
      const response = await apiClient.post<ImgflipResponse<CaptionedMeme>>(
        "/automeme",
        params
      );
      return response.data.data;
    } catch (error) {
      handleApiError(error as AxiosError<ImgflipResponse<any>>);
    }
  },
};
