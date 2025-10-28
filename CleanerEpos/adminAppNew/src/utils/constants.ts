export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010';

export const AUTH_TOKEN_KEY = 'epos_auth_token';
export const AUTH_USER_KEY = 'epos_auth_user';

export const ROUTES = {
  LOGIN: '/login',
  HOME: '/home',
  USERS: '/users',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  ORDERS: '/orders',
  TRANSACTIONS: '/transactions',
  ANALYTICS: '/analytics',
  MENU: '/menu', // Menu
} as const;

export const API_ENDPOINTS = {
  // Account
  LOGIN: '/api/Account/login',
  ME: '/api/Account/me',
  ROLES: '/api/Account/role',
  CHANGE_PASSWORD: '/api/Account/passw',
  
  // Users
  USERS: '/api/User',
  USER_BY_ID: (id: string) => `/api/User/${id}`,
  
  // Categories
  CATEGORIES: '/api/Categories',
  CATEGORY_BY_ID: (id: string) => `/api/Categories/${id}`,
  
  // Products
  PRODUCTS: '/api/Products',
  PRODUCT_BY_ID: (id: string) => `/api/Products/${id}`,

  // Orders
  ORDERS: '/api/Orders',
  ORDER_BY_ID: (id: string) => `/api/Orders/${id}`,
} as const;
