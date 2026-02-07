import { api } from "./client";
import type {
  User,
  UserProfile,
  UserStats,
  Achievement,
  Beer,
  PaginatedResponse,
  LeaderboardEntry,
  LeaderboardType,
  LeaderboardCategory,
  Notification,
} from "@/lib/types";

// API wraps responses in { success: boolean, data: T }
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface UpdateProfileParams {
  displayName?: string;
  bio?: string;
  avatar?: File;
}

export const usersApi = {
  async getProfile(username: string): Promise<UserProfile> {
    const response = await api.get<ApiResponse<UserProfile>>(`/users/${username}`);
    return response.data.data;
  },

  async getStats(userId: string): Promise<UserStats> {
    const response = await api.get<ApiResponse<UserStats>>(`/users/${userId}/stats`);
    return response.data.data;
  },

  async updateProfile(params: UpdateProfileParams): Promise<User> {
    const formData = new FormData();
    if (params.displayName) formData.append("displayName", params.displayName);
    if (params.bio) formData.append("bio", params.bio);
    if (params.avatar) formData.append("avatar", params.avatar);

    const response = await api.patch<ApiResponse<User>>("/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  },

  async getAchievements(userId: string): Promise<Achievement[]> {
    const response = await api.get<ApiResponse<Achievement[]>>(`/users/${userId}/achievements`);
    return response.data.data;
  },

  async getSavedBeers(page = 1, limit = 20): Promise<PaginatedResponse<Beer>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Beer>>>("/users/me/saved-beers", {
      params: { page, limit },
    });
    return response.data.data;
  },

  async getWishlist(page = 1, limit = 20): Promise<PaginatedResponse<Beer>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Beer>>>("/users/me/wishlist", {
      params: { page, limit },
    });
    return response.data.data;
  },

  async follow(userId: string): Promise<void> {
    await api.post(`/users/${userId}/follow`);
  },

  async unfollow(userId: string): Promise<void> {
    await api.delete(`/users/${userId}/follow`);
  },

  async getFollowers(userId: string, page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    const response = await api.get<ApiResponse<PaginatedResponse<User>>>(`/users/${userId}/followers`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  async getFollowing(userId: string, page = 1, limit = 20): Promise<PaginatedResponse<User>> {
    const response = await api.get<ApiResponse<PaginatedResponse<User>>>(`/users/${userId}/following`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  async getLeaderboard(
    type: LeaderboardType,
    category: LeaderboardCategory,
    limit = 50
  ): Promise<LeaderboardEntry[]> {
    const response = await api.get<ApiResponse<LeaderboardEntry[]>>("/leaderboard", {
      params: { type, category, limit },
    });
    return response.data.data;
  },

  async getNotifications(page = 1, limit = 20): Promise<PaginatedResponse<Notification>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Notification>>>("/notifications", {
      params: { page, limit },
    });
    return response.data.data;
  },

  async markNotificationRead(notificationId: string): Promise<void> {
    await api.patch(`/notifications/${notificationId}/read`);
  },

  async markAllNotificationsRead(): Promise<void> {
    await api.patch("/notifications/read-all");
  },

  async getUnreadNotificationCount(): Promise<number> {
    const response = await api.get<ApiResponse<{ count: number }>>("/notifications/unread-count");
    return response.data.data.count;
  },
};
