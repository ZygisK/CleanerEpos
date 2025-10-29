import React, { useEffect, useState } from 'react';
import { Users, Package, FileText, TrendingUp, CreditCard, ShoppingCart, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { getAllUsers } from '@/services/userService';
import { getAllProducts } from '@/services/productService';
import { getAllCategories } from '@/services/categoryService';
import { transactionService } from '@/services/transactionService';
import { getAllOrders } from '@/services/orderService';
import { TransactionModel } from '@/types/models';
import { OrderModel } from '@/types/models';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Card>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </Card>
);

export const Home: React.FC = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    categories: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<TransactionModel[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, products, categories, transactions, orders] = await Promise.all([
          getAllUsers(),
          getAllProducts(),
          getAllCategories(),
          transactionService.getTransactions(),
          getAllOrders(),
        ]);

        setStats({
          users: users.length,
          products: products.length,
          categories: categories.length,
        });

        // last 5 transactions
        const sortedTransactions = transactions.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentTransactions(sortedTransactions.slice(0, 5));

        // last 5 orders
        const sortedOrders = orders.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentOrders(sortedOrders.slice(0, 5));
      } catch (error) {
        toast.error('Failed to load dashboard data');
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your EPOS admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.users}
          icon={<Users className="w-6 h-6 text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Total Products"
          value={stats.products}
          icon={<Package className="w-6 h-6 text-green-600" />}
          color="bg-green-100"
        />
        <StatCard
          title="Total Categories"
          value={stats.categories}
          icon={<FileText className="w-6 h-6 text-purple-600" />}
          color="bg-purple-100"
        />
        <StatCard
          title="Revenue (Mock)"
          value="€12,345"
          icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
          color="bg-orange-100"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-100">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No recent transactions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {tx.items?.length ?? 0} items
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(tx.createdAt), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      €{tx.totalAmount.toFixed(2)}
                    </p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      tx.status.toLowerCase() === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Orders */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-100">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No recent orders</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Table #{order.tableNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(order.createdAt), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      €{order.totalAmount.toFixed(2)}
                    </p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      order.status.toLowerCase() === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : order.status.toLowerCase() === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
