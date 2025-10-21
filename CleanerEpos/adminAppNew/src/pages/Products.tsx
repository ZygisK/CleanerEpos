import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/Input';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/services/productService';
import { getAllCategories } from '@/services/categoryService';
import { ProductModel, CreateProductModel, CategoryModel } from '@/types/models';

export const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductModel | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState<CreateProductModel>({
    name: '',
    price: 0,
    categoryId: '',
    imageUrl: '',
    isAvailable: true,
  });

  const fetchProducts = async () => {
    try {
      // API Call: GET /api/Products
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      // API Call: GET /api/Categories
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.categoryName?.toLowerCase().includes(searchLower) ||
      product.category?.name.toLowerCase().includes(searchLower)
    );
  });


  const handleEditProduct = (product: ProductModel) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = async () => {
    const product = editingProduct || newProduct;
    
    if (!product.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!product.categoryId) {
      toast.error('Please select a category');
      return;
    }
    if (product.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct);
        toast.success('Product updated successfully');
        setIsEditModalOpen(false);
        setEditingProduct(null);
      } else {
        await createProduct(newProduct);
        toast.success('Product created successfully');
        setIsAddModalOpen(false);
        resetProductForm();
      }
      fetchProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save product');
    }
  };

  const handleDeleteProductClick = (product: ProductModel) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      // API Call: DELETE /api/Products/{id}
      await deleteProduct(productToDelete.id);
      
      toast.success('Product deleted successfully');
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  const resetProductForm = () => {
    setNewProduct({
      name: '',
      price: 0,
      categoryId: '',
      imageUrl: '',
      isAvailable: true,
    });
  };

  // Table columns
  const columns = [
    { key: 'name', label: 'Name' },
    {
      key: 'price',
      label: 'Price',
      render: (product: ProductModel) => `$${product.price.toFixed(2)}`,
    },
    {
      key: 'category',
      label: 'Category',
      render: (product: ProductModel) => product.categoryName || product.category?.name || 'N/A',
    },
    {
      key: 'active',
      label: 'Available',
      render: (product: ProductModel) => (
        <span
          className={`px-2 py-1 text-xs rounded ${
            product.active
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {product.active ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right' as const,
      render: (product: ProductModel) => (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => handleEditProduct(product)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Edit Product"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteProductClick(product)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Delete Product"
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
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
            placeholder="Search products by name or category..."
            className="pl-10"
          />
        </div>
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        )}
      </Card>

      {/* Products Table */}
      <Card>
        <Table
          data={filteredProducts}
          columns={columns}
          keyExtractor={(product) => product.id}
          isLoading={isLoading}
          emptyMessage={searchTerm ? "No products match your search" : "No products found"}
        />
      </Card>

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetProductForm();
        }}
        title="Add New Product"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Product Name *"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            placeholder="e.g. Espresso"
          />
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Price *"
              type="number"
              step="0.01"
              min="0"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={newProduct.categoryId}
                onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Image URL"
            value={newProduct.imageUrl}
            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newProduct.isAvailable}
              onChange={(e) => setNewProduct({ ...newProduct, isAvailable: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">Available for sale</span>
          </label>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setIsAddModalOpen(false);
                resetProductForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProduct}>Create Product</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
        }}
        title="Edit Product"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Product Name *"
            value={editingProduct?.name || ''}
            onChange={(e) => setEditingProduct(editingProduct ? { ...editingProduct, name: e.target.value } : null)}
            placeholder="e.g. Espresso"
          />
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Price *"
              type="number"
              step="0.01"
              min="0"
              value={editingProduct?.price || 0}
              onChange={(e) => setEditingProduct(editingProduct ? { ...editingProduct, price: parseFloat(e.target.value) || 0 } : null)}
              placeholder="0.00"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={editingProduct?.categoryId || ''}
                onChange={(e) => setEditingProduct(editingProduct ? { ...editingProduct, categoryId: e.target.value } : null)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Image URL"
            value={editingProduct?.imageUrl || ''}
            onChange={(e) => setEditingProduct(editingProduct ? { ...editingProduct, imageUrl: e.target.value } : null)}
            placeholder="https://example.com/image.jpg"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editingProduct?.active || false}
              onChange={(e) => setEditingProduct(editingProduct ? { ...editingProduct, active: e.target.checked } : null)}
              className="rounded"
            />
            <span className="text-sm font-medium text-gray-700">Available for sale</span>
          </label>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingProduct(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProduct}>Confirm</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
