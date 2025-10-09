import { apiClient, handleApiError } from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import {
  LoginModel,
  LoginResponse,
  ApplicationUserModel,
  ApplicationRoleModel,
} from '@/types/models';

// POST /api/Account/login
export const login = async (credentials: LoginModel): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.LOGIN,
      credentials
    );
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error(handleApiError(error));
  }
};

// GET /api/Account/me
export const getCurrentUser = async (): Promise<ApplicationUserModel> => {
  try {
    const response = await apiClient.get<ApplicationUserModel>(API_ENDPOINTS.ME);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// GET /api/Account/role
export const getRoles = async (): Promise<ApplicationRoleModel[]> => {
  try {
    const response = await apiClient.get<ApplicationRoleModel[]>(API_ENDPOINTS.ROLES);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};


// POST /api/Account/passw/{id}
export const changePassword = async (
  userId: string,
  newPassword: string
): Promise<void> => {
  try {
    await apiClient.post(`${API_ENDPOINTS.CHANGE_PASSWORD}/${userId}`, {
      password: newPassword
    });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
