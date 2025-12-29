import api from './api';

export interface UserProfile {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  company: string | null;
  role: string;
  createdAt: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  company?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface CreateUserData {
  email: string;
  name?: string;
  company?: string;
}

export interface ProfileResponse {
  profile: UserProfile;
}

export interface UsersResponse {
  users: UserProfile[];
}

export interface CreateUserResponse {
  user: UserProfile;
  message: string;
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<ProfileResponse>('/user/profile');
    return response.data.profile;
  },

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await api.put<ProfileResponse>('/user/profile', data);
    return response.data.profile;
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.put('/user/password', data);
  },

  // Admin only
  async getAllUsers(): Promise<UserProfile[]> {
    const response = await api.get<UsersResponse>('/user/all');
    return response.data.users;
  },

  async createUser(data: CreateUserData): Promise<CreateUserResponse> {
    const response = await api.post<CreateUserResponse>('/user/create', data);
    return response.data;
  },

  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/user/${userId}`);
  },
};
