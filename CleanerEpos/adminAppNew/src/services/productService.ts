import { apiClient, handleApiError } from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import { ProductModel, CreateProductModel } from '@/types/models';

// GET /api/Products
export const getAllProducts = async (): Promise<ProductModel[]> => {
  try {
    const response = await apiClient.get<ProductModel[]>(API_ENDPOINTS.PRODUCTS);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// GET /api/Products/{id}
export const getProductById = async (id: string): Promise<ProductModel> => {
  try {
    const response = await apiClient.get<ProductModel>(
      API_ENDPOINTS.PRODUCT_BY_ID(id)
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// POST /api/Products
export const createProduct = async (
  productData: CreateProductModel
): Promise<ProductModel> => {
  try {
    const backendProductData = {
      ...productData,
      Active: productData.isAvailable,
      isAvailable: undefined
    };
    
    const response = await apiClient.post<ProductModel>(
      API_ENDPOINTS.PRODUCTS,
      backendProductData
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// POST /api/Products
export const updateProduct = async (
  productData: ProductModel
): Promise<ProductModel> => {
  try {
    const backendProductData = {
      ...productData,
      Active: productData.active,
      isAvailable: undefined
    };
    
    const response = await apiClient.post<ProductModel>(
      API_ENDPOINTS.PRODUCTS,
      backendProductData
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// DELETE /api/Products/{id}
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(API_ENDPOINTS.PRODUCT_BY_ID(id));
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
