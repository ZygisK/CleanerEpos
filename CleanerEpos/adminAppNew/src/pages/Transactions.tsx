import React, { useEffect, useState } from 'react';
import { CreditCard, TrendingUp, Euro, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Input } from '@/components/ui/Input';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { transactionService } from '@/services/transactionService';
import { TransactionModel } from '@/types/models';

export const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.id.toLowerCase().includes(searchLower) ||
      transaction.status.toLowerCase().includes(searchLower) ||
      transaction.totalAmount.toString().includes(searchLower)
    );
  });

  const handleDeleteTransactionClick = (transaction: TransactionModel) => {
    setTransactionToDelete(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTransaction = async () => {
    if (!transactionToDelete) return;

    setIsDeleting(true);
    try {
      await transactionService.deleteTransaction(transactionToDelete.id);
      toast.success('Transaction deleted successfully');
      await fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'Transaction ID',
      render: (transaction: TransactionModel) => (
        <span className="font-mono text-sm">{transaction.id.slice(0, 8)}...</span>
      ),
    },
    {
      key: 'items',
      label: 'Items',
      render: (transaction: TransactionModel) => (
        <span>{transaction.items?.length ?? 0} items</span>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      render: (transaction: TransactionModel) => (
        <span className="font-semibold">€{transaction.totalAmount.toFixed(2)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (transaction: TransactionModel) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          transaction.status.toLowerCase() === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : transaction.status.toLowerCase() === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {transaction.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (transaction: TransactionModel) => (
        <span className="text-sm">
          {new Date(transaction.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right' as const,
      render: (transaction: TransactionModel) => (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => handleDeleteTransactionClick(transaction)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Delete Transaction"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600 mt-1">View and manage transaction history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Sales</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                €{transactions
                  .filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString())
                  .reduce((sum, t) => sum + t.totalAmount, 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <Euro className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{transactions.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Order</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                €{transactions.length > 0 
                  ? (transactions.reduce((sum, t) => sum + t.totalAmount, 0) / transactions.length).toFixed(2)
                  : '0.00'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions by ID, customer, status, or amount..."
            className="pl-10"
          />
        </div>
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
        )}
      </Card>

      {/* Transactions Table */}
      <Card>
        <Table
          data={filteredTransactions}
          columns={columns}
          keyExtractor={(transaction) => transaction.id}
          isLoading={isLoading}
          emptyMessage={searchTerm ? "No transactions match your search" : "No transactions found"}
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTransactionToDelete(null);
        }}
        onConfirm={handleDeleteTransaction}
        title="Delete Transaction"
        message={
          <div>
            <p>Are you sure you want to delete this transaction?</p>
            {transactionToDelete && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p><strong>Transaction ID:</strong> {transactionToDelete.id.slice(0, 8)}...</p>
                <p><strong>Customer:</strong> {transactionToDelete.user?.fullName || 'Unknown'}</p>
                <p><strong>Amount:</strong> €{transactionToDelete.totalAmount.toFixed(2)}</p>
                <p><strong>Status:</strong> {transactionToDelete.status}</p>
              </div>
            )}
            <p className="mt-2 text-red-600 font-medium">This action cannot be undone.</p>
          </div>
        }
        confirmText="Delete Transaction"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};
