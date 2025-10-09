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
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/categoryService';
import { CategoryModel, CreateCategoryModel } from '@/types/models';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryModel | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryModel | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategory, setNewCategory] = useState<CreateCategoryModel>({
    name: '',
    description: '',
  });

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category => {
    const searchLower = searchTerm.toLowerCase();
    return (
      category.name.toLowerCase().includes(searchLower) ||
      category.description?.toLowerCase().includes(searchLower)
    );
  });

  const handleEditCategory = (category: CategoryModel) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!editingCategory) {
      if (!newCategory.name.trim()) {
        toast.error('Category name is required');
        return;
      }

      try {
        await createCategory(newCategory);
        
        toast.success('Category created successfully');
        setIsAddModalOpen(false);
        setNewCategory({ name: '', description: '' });
        fetchCategories();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to create category');
      }
    } else {
      if (!editingCategory.name.trim()) {
        toast.error('Category name is required');
        return;
      }

      try {
        await updateCategory(editingCategory);
        
        toast.success('Category updated successfully');
        setIsEditModalOpen(false);
        setEditingCategory(null);
        fetchCategories();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to update category');
      }
    }
  };

  const handleDeleteCategoryClick = (category: CategoryModel) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      await deleteCategory(categoryToDelete.id);
      
      toast.success('Category deleted successfully');
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right' as const,
      render: (category: CategoryModel) => (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => handleEditCategory(category)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Edit Category"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteCategoryClick(category)}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Delete Category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage product categories</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories by name..."
            className="pl-10"
          />
        </div>
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredCategories.length} of {categories.length} categories
          </div>
        )}
      </Card>

      <Card>
        <Table
          data={filteredCategories}
          columns={columns}
          keyExtractor={(category) => category.id}
          isLoading={isLoading}
          emptyMessage={searchTerm ? "No categories match your search" : "No categories found"}
        />
      </Card>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewCategory({ name: '', description: '' });
        }}
        title="Add New Category"
      >
        <div className="space-y-4">
          <Input
            label="Category Name *"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            placeholder="e.g. Beverages"
          />
          
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setIsAddModalOpen(false);
                setNewCategory({ name: '', description: '' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>Create Category</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCategory(null);
        }}
        title="Edit Category"
      >
        <div className="space-y-4">
          <Input
            label="Category Name *"
            value={editingCategory?.name || ''}
            onChange={(e) => setEditingCategory(editingCategory ? { ...editingCategory, name: e.target.value } : null)}
            placeholder="e.g. Beverages"
          />
          
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingCategory(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>Update Category</Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Category"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
