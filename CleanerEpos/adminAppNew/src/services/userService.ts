/**
 * User Service
 * Handles all user management API calls
 */

import { apiClient, handleApiError } from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  ApplicationUserModel,
  CreateUserModel,
  UpdateUserModel,
} from '@/types/models';

// GET /api/User

export const getAllUsers = async (): Promise<ApplicationUserModel[]> => {
  try {
    const response = await apiClient.get<ApplicationUserModel[]>(API_ENDPOINTS.USERS);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// GET /api/User/{id}
export const getUserById = async (id: string): Promise<ApplicationUserModel> => {
  try {
    const response = await apiClient.get<ApplicationUserModel>(
      API_ENDPOINTS.USER_BY_ID(id)
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// POST /api/User
export const createUser = async (
  userData: CreateUserModel
): Promise<ApplicationUserModel> => {
  try {
    const { password, ...userWithoutPassword } = userData;
    
    const response = await apiClient.post<ApplicationUserModel>(
      API_ENDPOINTS.USERS,
      userWithoutPassword
    );
    
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// PUT /api/User/{id}
export const updateUser = async (
  id: string,
  userData: UpdateUserModel
): Promise<ApplicationUserModel> => {
  try {
    const response = await apiClient.put<ApplicationUserModel>(
      API_ENDPOINTS.USER_BY_ID(id),
      userData
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// DELETE /api/User/{id}
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(API_ENDPOINTS.USER_BY_ID(id));
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// POST /api/Account/passw/{id}
export const setUserPassword = async (
  userId: string,
  password: string
): Promise<void> => {
  try {
    await apiClient.post(
      `${API_ENDPOINTS.CHANGE_PASSWORD}/${userId}`,
      { password }
    );
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
