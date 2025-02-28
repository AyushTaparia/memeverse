import { IComment, IMeme } from "../../types/meme";
import { imgflipApi } from "./api-client";

// Fetch meme templates from Imgflip API
export const fetchMemeTemplates = async () => {
  try {
    return await imgflipApi.getMemes();
  } catch (error) {
    console.error("Error fetching meme templates:", error);
    throw error;
  }
};

// Transform API data to our Meme format
//eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformMemeData = (memes: any[]): IMeme[] => {
  const categories = ["trending", "new", "classic", "random"];

  return memes.map((meme, index) => ({
    id: meme.id || index.toString(),
    name: meme.name,
    url: meme.url,
    width: meme.width,
    height: meme.height,
    box_count: meme.box_count,
    likes: Math.floor(Math.random() * 1000),
    comments: generateRandomComments(Math.floor(Math.random() * 5)),
    category: categories[Math.floor(Math.random() * categories.length)],
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
    ).toISOString(),
  }));
};

// Generate random comments for demo purposes
const generateRandomComments = (count: number): IComment[] => {
  const comments: IComment[] = [];
  const usernames = [
    "meme_lord",
    "laugh_master",
    "joke_fan",
    "funny_guy",
    "meme_queen",
  ];
  const commentTexts = [
    "This is hilarious! 😂",
    "I can't stop laughing! 🤣",
    "Sharing this with my friends!",
    "Best meme I've seen today!",
    "This is so relatable!",
    "I feel personally attacked 😅",
    "Story of my life right here",
    "This deserves more likes",
    "Literally me every day",
    "Can't. Stop. Laughing.",
  ];

  for (let i = 0; i < count; i++) {
    comments.push({
      id: `comment-${i}-${Date.now()}`,
      username: usernames[Math.floor(Math.random() * usernames.length)],
      text: commentTexts[Math.floor(Math.random() * commentTexts.length)],
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
      ).toISOString(),
    });
  }

  return comments;
};

// Fetch trending memes
export const fetchTrendingMemes = async (): Promise<IMeme[]> => {
  try {
    const templates = await imgflipApi.getMemes();
    const memes = templates?.length
      ? transformMemeData(templates.slice(0, 20))
      : [];
    return memes.sort((a, b) => b.likes - a.likes);
  } catch (error) {
    console.error("Error fetching trending memes:", error);
    throw error;
  }
};

// Fetch memes by category
export const fetchMemesByCategory = async (
  category: string
): Promise<IMeme[]> => {
  try {
    const templates = await imgflipApi.getMemes();
    const memes = templates?.length ? transformMemeData(templates) : [];

    if (category && category !== "all") {
      if (category === "trending") {
        return memes.sort((a, b) => b.likes - a.likes).slice(0, 20);
      } else if (category === "new") {
        return memes
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 20);
      } else if (category === "classic") {
        return memes.filter((meme) => meme.category === "classic");
      } else if (category === "random") {
        return memes.sort(() => Math.random() - 0.5).slice(0, 20);
      }
    }

    return memes;
  } catch (error) {
    console.error(`Error fetching memes for category ${category}:`, error);
    throw error;
  }
};

// Search memes by text
export const searchMemes = async (query: string): Promise<IMeme[]> => {
  try {
    // Use premium search if available, otherwise fallback to filtering local results
    if (process.env.NEXT_PUBLIC_IMGFLIP_PREMIUM === "true") {
      const results = await imgflipApi.searchMemes({ query });
      if (results) {
        return transformMemeData(results);
      } else {
        return [];
      }
    } else {
      const templates = await imgflipApi.getMemes();
      const memes = templates?.length ? transformMemeData(templates) : [];

      if (!query) return memes;

      const lowerCaseQuery = query.toLowerCase();
      return memes.filter(
        (meme) =>
          meme.name.toLowerCase().includes(lowerCaseQuery) ||
          (meme.caption && meme.caption.toLowerCase().includes(lowerCaseQuery))
      );
    }
  } catch (error) {
    console.error(`Error searching memes for "${query}":`, error);
    throw error;
  }
};

// Create a meme using the Imgflip API
export const createMeme = async (params: {
  template_id: string;
  text0?: string;
  text1?: string;
  caption?: string;
}) => {
  try {
    const result = await imgflipApi.captionImage({
      template_id: params.template_id,
      text0: params.text0,
      text1: params.text1,
    });

    return {
      url: result?.url,
      page_url: result?.page_url,
    };
  } catch (error) {
    console.error("Error creating meme:", error);
    throw error;
  }
};

// API for uploading meme (mock)
export const uploadMeme = async (memeData: Partial<IMeme>): Promise<IMeme> => {
  // In a real app, this would be an actual API call to your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMeme: IMeme = {
        id: `meme-${Date.now()}`,
        name: memeData.name || "Untitled Meme",
        url: memeData.url || "",
        width: memeData.width || 500,
        height: memeData.height || 500,
        caption: memeData.caption || "",
        likes: 0,
        comments: [],
        category: "new",
        createdAt: new Date().toISOString(),
        creator: memeData.creator || "anonymous",
      };
      resolve(newMeme);
    }, 1000);
  });
};

// Generate AI caption (mock)
export const generateAICaption = async (imageName: string): Promise<string> => {
  try {
    if (process.env.NEXT_PUBLIC_IMGFLIP_PREMIUM === "true") {
      const result = await imgflipApi.generateAIMeme({
        prefix_text: imageName,
        model: "openai",
      });
      if (result?.texts) {
        return result.texts.join(" ");
      } else {
        return "";
      }
    } else {
      // Fallback to mock captions
      const aiCaptions = [
        "When you finally find the missing semicolon in your code",
        "That moment when you realize it's only Tuesday",
        "Me pretending to work when the boss walks by",
        "My face when someone says they'll be there in 5 minutes",
        "How I look waiting for my code to compile",
        "When the food arrives and it looks nothing like the picture",
        "Nobody: ... Me at 3am making memes instead of sleeping",
      ];
      return new Promise((resolve) => {
        setTimeout(() => {
          const randomIndex = Math.floor(Math.random() * aiCaptions.length);
          resolve(aiCaptions[randomIndex]);
        }, 1500);
      });
    }
  } catch (error) {
    console.error("Error generating AI caption:", error);
    throw error;
  }
};
