export const APP_CONFIG = {
  name: "Elenty.app",
  version: "1.0.0",
  description: "تواصل، شارك، اتصل - كل شيء في مكان واحد",
  website: "https://elenty.app",
  supportEmail: "support@elenty.app",
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || "https://api.elenty.app",
    version: "v1",
  },
  database: {
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
  social: {
    instagram: "https://instagram.com/elenty.app",
    twitter: "https://twitter.com/elenty_app",
    facebook: "https://facebook.com/elenty.app",
    tiktok: "https://tiktok.com/@elenty.app",
  }
};