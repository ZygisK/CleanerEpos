import { apiClient, handleApiError } from './api';
import { API_ENDPOINTS } from '@/utils/constants';
import { CreateOrderModel, OrderModel } from '@/types/models';

export const getAllOrders = async (): Promise<OrderModel[]> => {
  try {
    const res = await apiClient.get<OrderModel[]>(API_ENDPOINTS.ORDERS);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getOrderById = async (id: string): Promise<OrderModel> => {
  try {
    const res = await apiClient.get<OrderModel>(API_ENDPOINTS.ORDER_BY_ID(id));
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const createOrder = async (model: CreateOrderModel): Promise<OrderModel> => {
  try {
    const res = await apiClient.post<OrderModel>(API_ENDPOINTS.ORDERS, model);
    return res.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const deleteOrder = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(API_ENDPOINTS.ORDER_BY_ID(id));
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// Placeholder for future: update status and process → create transaction
export const updateOrderStatus = async (_id: string, _status: string): Promise<void> => {
  throw new Error('Not implemented: backend endpoint for updating order status is missing');
};


