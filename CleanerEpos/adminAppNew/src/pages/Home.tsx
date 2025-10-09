import React, { useEffect, useState } from 'react';
import { Users, Package, FileText, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { getAllUsers } from '@/services/userService';
import { getAllProducts } from '@/services/productService';
import { getAllCategories } from '@/services/categoryService';
import toast from 'react-hot-toast';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, products, categories] = await Promise.all([
          getAllUsers(),
          getAllProducts(),
          getAllCategories(),
        ]);

        setStats({
          users: users.length,
          products: products.length,
          categories: categories.length,
        });
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
          value="$12,345"
          icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
          color="bg-orange-100"
        />
      </div>

      {/* recent activity to do*/}
      <Card title="Recent Activity" subtitle="todo">
        <div className="text-center py-8 text-gray-500">
          <p>Recent transactions and activity will appear here</p>
        </div>
      </Card>
    </div>
  );
};
