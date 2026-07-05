export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface MessageItem {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export interface ChatHistoryItem {
  id: number;
  title: string;
  created_at: string;
  language: string;
  messages: MessageItem[];
}
