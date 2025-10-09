import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { getAllProducts } from '@/services/productService';
import { getAllCategories } from '@/services/categoryService';
import { ProductModel, CategoryModel } from '@/types/models';

interface CartItem {
  product: ProductModel;
  quantity: number;
}

export const Menu: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [hasSelectedTable, setHasSelectedTable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);
        
        const activeProducts = productsData.filter(p => p.active);
        setProducts(activeProducts);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching menu data:', error);
        toast.error('Failed to load menu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const tableFromUrl = searchParams.get('table');
    if (tableFromUrl) {
      setTableNumber(tableFromUrl);
      setHasSelectedTable(true);
      toast.success(`Table ${tableFromUrl} selected from QR code`);
    }
  }, [searchParams]);

  useEffect(() => {
    const tableFromUrl = searchParams.get('table');
    if (!hasSelectedTable && !tableFromUrl) {
      setIsTableModalOpen(true);
    }
  }, [hasSelectedTable, searchParams]);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.categoryId === selectedCategory);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: ProductModel) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prevCart => {
      return prevCart
        .map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const handleTableSelection = () => {
    if (!tableNumber.trim()) {
      toast.error('Please enter a table number');
      return;
    }
    setHasSelectedTable(true);
    setIsTableModalOpen(false);
    toast.success(`Table ${tableNumber} selected`);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    toast.success('Checkout coming soon.');
    console.log('Order details:', {
      tableNumber,
      items: cart,
      total: cartTotal,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu..</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Menu</h1>
              {hasSelectedTable && (
                <p className="text-sm text-gray-600">
                  Table {tableNumber} 
                  <button
                    onClick={() => setIsTableModalOpen(true)}
                    className="ml-2 text-blue-600 hover:text-blue-700 underline"
                  >
                    Change
                  </button>
                </p>
              )}
            </div>
            
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">Cart</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Category Filter */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Items
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card>
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No products available in this category</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  {/* Product Image Placeholder */}
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <span className="text-4xl">🍽️</span>
                    </div>
                  )}

                  {/* Product Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {product.description || 'Delicious menu item'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {product.categoryName || product.category?.name}
                    </p>
                  </div>

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cart Modal */}
      <Modal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title="Your Cart"
      >
        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>Your cart is empty</p>
              <p className="text-sm mt-2">Add some items to get started!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cart.map(item => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        ${item.product.price.toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="p-1 rounded-lg bg-white hover:bg-gray-100 border border-gray-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="p-1 rounded-lg bg-white hover:bg-gray-100 border border-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right min-w-[80px]">
                      <p className="font-semibold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 rounded-lg hover:bg-red-50 text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setIsCartOpen(false)}
                    className="flex-1"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Table Selection Modal */}
      <Modal
        isOpen={isTableModalOpen}
        onClose={() => {
          if (hasSelectedTable) {
            setIsTableModalOpen(false);
          }
        }}
        title="Select Your Table"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Please enter your table number to start ordering
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Table Number
            </label>
            <Input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Enter table number (e.g., 5)"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTableSelection();
                }
              }}
            />
          </div>

          {/* Quick Select Buttons */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Or select from common tables:
            </p>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <button
                  key={num}
                  onClick={() => setTableNumber(num.toString())}
                  className={`p-3 rounded-lg border-2 font-medium transition-colors ${
                    tableNumber === num.toString()
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleTableSelection}
            disabled={!tableNumber.trim()}
            className="w-full"
          >
            Confirm Table
          </Button>
        </div>
      </Modal>
    </div>
  );
};

