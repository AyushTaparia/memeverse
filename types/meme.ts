export interface IMemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
  captions?: number;
}

export interface IMeme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count?: number;
  caption?: string;
  likes: number;
  comments: IComment[];
  category: string;
  createdAt: string;
  creator?: string;
}

export interface IComment {
  id: string;
  text: string;
  username: string;
  createdAt: string;
}

export interface IUser {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  likedMemes: string[];
  uploadedMemes: string[];
}

export type MemeCategory = "trending" | "new" | "classic" | "random" | "all";

export interface ICaptionedMeme {
  url: string;
  page_url: string;
}

export interface IAIGeneratedMeme extends ICaptionedMeme {
  template_id: number;
  texts: string[];
}

export interface IApiResponse<T> {
  success: boolean;
  data: T;
  error_message?: string;
}
