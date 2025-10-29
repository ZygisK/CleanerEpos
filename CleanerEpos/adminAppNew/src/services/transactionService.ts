import { apiClient } from './api';
import { TransactionModel, CreateTransactionModel } from '@/types/models';

export const transactionService = {
  async getTransactions(): Promise<TransactionModel[]> {
    try {
      const response = await apiClient.get('/api/Transactions');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  },

  async getTransaction(id: string): Promise<TransactionModel> {
    try {
      const response = await apiClient.get(`/api/Transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  async createTransaction(model: CreateTransactionModel): Promise<TransactionModel> {
    try {
      const response = await apiClient.post('/api/Transactions', model);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  async deleteTransaction(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/Transactions/${id}`);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }
};
