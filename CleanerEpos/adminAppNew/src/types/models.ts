// User
export interface ApplicationUserModel {
  id: string; //Guid
  fullName: string;
  userName: string;
  phoneNumber: string;
  email: string;
  roles: string[];
}

export interface CreateUserModel {
  id?: string;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  roles?: string[];
}

export interface UpdateUserModel {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  roles: string[];
}

// Authentication
export interface LoginModel {
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: ApplicationUserModel;
}

export interface ChangePasswordModel {
  userId: string;
  newPassword: string;
}

// Role Model
export interface ApplicationRoleModel {
  id: string; //Guid
  name: string;
}

// Category
export interface CategoryModel {
  id: string;
  name: string;
  description?: string;
}

export interface CreateCategoryModel {
  name: string;
  description?: string;
}

// Product
export interface ProductModel {
  id: string;
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  categoryName?: string;
  category?: CategoryModel;
  imageUrl?: string;
  active: boolean;
}

export interface CreateProductModel {
  name: string;
  description?: string;
  price: number;
  categoryId?: string;
  imageUrl?: string;
  isAvailable: boolean;
}

// Transaction
export interface TransactionModel {
  id: string;
  userId: string;
  user?: ApplicationUserModel;
  totalAmount: number;
  status: string;
  createdAt: string;
  items?: TransactionItemModel[];
}

export interface TransactionItemModel {
  id: string;
  transactionId: string;
  productId: string;
  product?: ProductModel;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// API Response 
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Common types
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
