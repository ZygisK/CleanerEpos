import { apiClient } from './api';
import { TransactionModel } from '@/types/models';

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


  // GET /api/Transactions/{id}
  async getTransaction(id: string): Promise<TransactionModel> {
    try {
      const response = await apiClient.get(`/api/Transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },

  // DELETE /api/Transactions/{id}
  async deleteTransaction(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/Transactions/${id}`);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }
};
