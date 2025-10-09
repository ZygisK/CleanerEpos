import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { login } from '@/services/authService';
import { ROUTES } from '@/utils/constants';

export const Login: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ userName?: string; password?: string }>({});
  
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: { userName?: string; password?: string } = {};
    
    if (!userName.trim()) {
      newErrors.userName = 'Username is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      // API Call: POST /api/Account/login
      const response = await login({ userName, password });
      
      // Store auth data
      setAuth(response.user, response.token);
      
      toast.success('Login successful!');
      navigate(ROUTES.HOME);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">EPOS Admin</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              label="Username"
              placeholder="Enter your username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              error={errors.userName}
              autoComplete="username"
              disabled={isLoading}
            />
            
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
              disabled={isLoading}
            />
            
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-6"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Card>
        
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account? Contact your administrator.
        </p>
      </div>
    </div>
  );
};
