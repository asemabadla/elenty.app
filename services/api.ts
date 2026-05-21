// API service for backend communication
import { APP_CONFIG } from '@/constants/app';

export class ApiService {
  private baseUrl: string;
  private apiKey?: string;

  constructor(apiKey?: string) {
    this.baseUrl = APP_CONFIG.api.baseUrl;
    this.apiKey = apiKey;
  }

  setApiKey(apiKey?: string) {
    this.apiKey = apiKey;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/${APP_CONFIG.api.version}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(phoneId: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phoneId, password }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  // User endpoints
  async getProfile(userId: string) {
    return this.request(`/users/${userId}`);
  }

  async updateProfile(userId: string, userData: any) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async searchUsers(query: string) {
    return this.request(`/users/search?q=${encodeURIComponent(query)}`);
  }

  async followUser(userId: string) {
    return this.request(`/users/${userId}/follow`, {
      method: 'POST',
    });
  }

  async unfollowUser(userId: string) {
    return this.request(`/users/${userId}/unfollow`, {
      method: 'POST',
    });
  }

  async getFollowers(userId: string, page = 1, limit = 20) {
    return this.request(`/users/${userId}/followers?page=${page}&limit=${limit}`);
  }

  async getFollowing(userId: string, page = 1, limit = 20) {
    return this.request(`/users/${userId}/following?page=${page}&limit=${limit}`);
  }

  // Posts endpoints
  async createPost(postData: any) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async getFeed(userId: string, page = 1, limit = 20) {
    return this.request(`/posts/feed?userId=${userId}&page=${page}&limit=${limit}`);
  }

  async getPost(postId: string) {
    return this.request(`/posts/${postId}`);
  }

  async updatePost(postId: string, postData: any) {
    return this.request(`/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(postId: string) {
    return this.request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  }

  async likePost(postId: string) {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async unlikePost(postId: string) {
    return this.request(`/posts/${postId}/unlike`, {
      method: 'POST',
    });
  }

  async savePost(postId: string) {
    return this.request(`/posts/${postId}/save`, {
      method: 'POST',
    });
  }

  async unsavePost(postId: string) {
    return this.request(`/posts/${postId}/unsave`, {
      method: 'POST',
    });
  }

  async commentOnPost(postId: string, comment: string) {
    return this.request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    });
  }

  async getPostComments(postId: string, page = 1, limit = 20) {
    return this.request(`/posts/${postId}/comments?page=${page}&limit=${limit}`);
  }

  // Stories endpoints
  async createStory(storyData: any) {
    return this.request('/stories', {
      method: 'POST',
      body: JSON.stringify(storyData),
    });
  }

  async getStories(userId: string) {
    return this.request(`/stories?userId=${userId}`);
  }

  async markStoryAsSeen(storyId: string) {
    return this.request(`/stories/${storyId}/view`, {
      method: 'POST',
    });
  }

  async deleteStory(storyId: string) {
    return this.request(`/stories/${storyId}`, {
      method: 'DELETE',
    });
  }

  // Messages endpoints
  async sendMessage(chatId: string, message: any) {
    return this.request(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  async getChatMessages(chatId: string, page = 1, limit = 50) {
    return this.request(`/chats/${chatId}/messages?page=${page}&limit=${limit}`);
  }

  async getUserChats(userId: string) {
    return this.request(`/users/${userId}/chats`);
  }

  async createChat(participants: string[]) {
    return this.request('/chats', {
      method: 'POST',
      body: JSON.stringify({ participants }),
    });
  }

  async markMessageAsRead(messageId: string) {
    return this.request(`/messages/${messageId}/read`, {
      method: 'POST',
    });
  }

  // Calls endpoints
  async initiateCall(callData: any) {
    return this.request('/calls', {
      method: 'POST',
      body: JSON.stringify(callData),
    });
  }

  async getCallHistory(userId: string) {
    return this.request(`/users/${userId}/calls`);
  }

  async updateCallStatus(callId: string, status: string) {
    return this.request(`/calls/${callId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async endCall(callId: string) {
    return this.request(`/calls/${callId}/end`, {
      method: 'POST',
    });
  }

  // Live streaming endpoints
  async startLiveStream(streamData: any) {
    return this.request('/live-streams', {
      method: 'POST',
      body: JSON.stringify(streamData),
    });
  }

  async getLiveStreams() {
    return this.request('/live-streams');
  }

  async endLiveStream(streamId: string) {
    return this.request(`/live-streams/${streamId}/end`, {
      method: 'POST',
    });
  }

  async joinLiveStream(streamId: string) {
    return this.request(`/live-streams/${streamId}/join`, {
      method: 'POST',
    });
  }

  async leaveLiveStream(streamId: string) {
    return this.request(`/live-streams/${streamId}/leave`, {
      method: 'POST',
    });
  }

  // Challenges endpoints
  async createChallenge(challengeData: any) {
    return this.request('/challenges', {
      method: 'POST',
      body: JSON.stringify(challengeData),
    });
  }

  async getTrendingChallenges() {
    return this.request('/challenges/trending');
  }

  async getChallenge(challengeId: string) {
    return this.request(`/challenges/${challengeId}`);
  }

  async joinChallenge(challengeId: string) {
    return this.request(`/challenges/${challengeId}/join`, {
      method: 'POST',
    });
  }

  async getChallengeVideos(challengeId: string, page = 1, limit = 20) {
    return this.request(`/challenges/${challengeId}/videos?page=${page}&limit=${limit}`);
  }

  // Short videos endpoints
  async getShortVideos(page = 1, limit = 20) {
    return this.request(`/short-videos?page=${page}&limit=${limit}`);
  }

  async createShortVideo(videoData: any) {
    return this.request('/short-videos', {
      method: 'POST',
      body: JSON.stringify(videoData),
    });
  }

  async likeShortVideo(videoId: string) {
    return this.request(`/short-videos/${videoId}/like`, {
      method: 'POST',
    });
  }

  async unlikeShortVideo(videoId: string) {
    return this.request(`/short-videos/${videoId}/unlike`, {
      method: 'POST',
    });
  }

  // Notifications endpoints
  async getNotifications(page = 1, limit = 20) {
    return this.request(`/notifications?page=${page}&limit=${limit}`);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'POST',
    });
  }

  // Upload endpoints
  async uploadMedia(file: File | Blob, type: 'image' | 'video' | 'audio') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async uploadMultipleMedia(files: (File | Blob)[], type: 'image' | 'video' | 'audio') {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    formData.append('type', type);

    return this.request('/upload/multiple', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  // Effects endpoints
  async getEffects(category?: string) {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request(`/effects${query}`);
  }

  async getPopularEffects() {
    return this.request('/effects/popular');
  }

  async downloadEffect(effectId: string) {
    return this.request(`/effects/${effectId}/download`, {
      method: 'POST',
    });
  }

  // Search endpoints
  async search(query: string, type?: 'users' | 'posts' | 'challenges' | 'hashtags') {
    const params = new URLSearchParams({ q: query });
    if (type) params.append('type', type);
    return this.request(`/search?${params.toString()}`);
  }

  // Analytics endpoints (for content creators)
  async getAnalytics(userId: string, period = '7d') {
    return this.request(`/analytics/${userId}?period=${period}`);
  }

  async getPostAnalytics(postId: string) {
    return this.request(`/analytics/posts/${postId}`);
  }
}

// Export singleton instance
export const apiService = new ApiService();