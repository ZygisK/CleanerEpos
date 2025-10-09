import { apiClient, handleApiError } from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import { CategoryModel, CreateCategoryModel } from '@/types/models';

// GET /api/Categories
export const getAllCategories = async (): Promise<CategoryModel[]> => {
  try {
    const response = await apiClient.get<CategoryModel[]>(API_ENDPOINTS.CATEGORIES);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};


// GET /api/Categories/{id}
export const getCategoryById = async (id: string): Promise<CategoryModel> => {
  try {
    const response = await apiClient.get<CategoryModel>(
      API_ENDPOINTS.CATEGORY_BY_ID(id)
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};


// POST /api/Categories
export const createCategory = async (
  categoryData: CreateCategoryModel
): Promise<CategoryModel> => {
  try {
    const response = await apiClient.post<CategoryModel>(
      API_ENDPOINTS.CATEGORIES,
      categoryData
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};


// POST /api/Categories
export const updateCategory = async (
  categoryData: CategoryModel
): Promise<CategoryModel> => {
  try {
    const response = await apiClient.post<CategoryModel>(
      API_ENDPOINTS.CATEGORIES,
      categoryData
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};


// DELETE /api/Categories/{id}
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(API_ENDPOINTS.CATEGORY_BY_ID(id));
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
