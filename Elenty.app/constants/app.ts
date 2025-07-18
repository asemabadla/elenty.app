export const APP_CONFIG = {
  name: "Elenty.app",
  version: "1.0.0",
  description: "تواصل، شارك، اتصل - كل شيء في مكان واحد",
  website: "https://elenty.app",
  supportEmail: "support@elenty.app",
  
  // API Configuration (will be used when backend is enabled)
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || "https://api.elenty.app",
    version: "v1",
  },
  
  // Database Configuration
  database: {
    // These will be configured when backend is enabled
    tables: {
      users: "users",
      posts: "posts", 
      stories: "stories",
      messages: "messages",
      chats: "chats",
      calls: "calls",
      notifications: "notifications",
      challenges: "challenges",
      effects: "effects",
      live_streams: "live_streams",
    }
  },
  
  // Feature Flags
  features: {
    voiceCalls: true,
    videoCalls: true,
    liveStreaming: true,
    shortVideos: true,
    challenges: true,
    effects: true,
    internationalCalling: true,
    aiFeatures: true,
  },
  
  // Social Media Links
  social: {
    instagram: "https://instagram.com/elenty.app",
    twitter: "https://twitter.com/elenty_app",
    facebook: "https://facebook.com/elenty.app",
    tiktok: "https://tiktok.com/@elenty.app",
  }
};