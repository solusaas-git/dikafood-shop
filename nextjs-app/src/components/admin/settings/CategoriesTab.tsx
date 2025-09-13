'use client';

import React, { useState, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContextNew';
import LucideIcon from '../../ui/icons/LucideIcon';
import { useTranslation } from '@/utils/i18n';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: {
    _id: string;
    name: string;
    slug: string;
  };
  level: number;
  path: string;
  isActive: boolean;
  productCount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const CategoriesTab = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent: '',
    isActive: true,
    sortOrder: 0
  });

  const { addNotification } = useNotification();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/categories?includeInactive=true', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('admin.settings.categories.errors.fetchFailed'));
      }

      if (data.success) {
        setCategories(data.data.categories);
      } else {
        throw new Error(data.message || t('admin.settings.categories.errors.fetchFailed'));
      }
    } catch (err: any) {
      console.error('Fetch categories error:', err);
      setError(err.message);
      addNotification({
        type: 'error',
        message: t('admin.settings.categories.errors.loadFailed')
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory._id}`
        : '/api/admin/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          ...formData,
          parent: formData.parent || null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t(editingCategory ? 'admin.settings.categories.errors.updateFailed' : 'admin.settings.categories.errors.createFailed'));
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: t(editingCategory ? 'admin.settings.categories.notifications.updateSuccess' : 'admin.settings.categories.notifications.createSuccess')
        });
        
        setShowForm(false);
        setEditingCategory(null);
        setFormData({
          name: '',
          description: '',
          parent: '',
          isActive: true,
          sortOrder: 0
        });
        
        fetchCategories();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Submit category error:', err);
      addNotification({
        type: 'error',
        message: err.message || t(editingCategory ? 'admin.settings.categories.errors.updateFailed' : 'admin.settings.categories.errors.createFailed')
      });
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      parent: category.parent?._id || '',
      isActive: category.isActive,
      sortOrder: category.sortOrder
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm(t('admin.settings.categories.confirmDelete'))) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('admin.settings.categories.errors.deleteFailed'));
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: t('admin.settings.categories.notifications.deleteSuccess')
        });
        fetchCategories();
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Delete category error:', err);
      addNotification({
        type: 'error',
        message: err.message || t('admin.settings.categories.errors.deleteFailed')
      });
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      parent: '',
      isActive: true,
      sortOrder: 0
    });
  };

  const getIndentClass = (level: number) => {
    const indentMap = {
      0: '',
      1: 'pl-6',
      2: 'pl-12',
      3: 'pl-18',
      4: 'pl-24',
      5: 'pl-30'
    };
    return indentMap[level as keyof typeof indentMap] || 'pl-30';
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <LucideIcon name="xcircle" size="lg" color="error" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{t('admin.settings.categories.error')}</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={() => fetchCategories()}
                className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
              >
                {t('admin.settings.categories.tryAgain')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{t('admin.settings.categories.title')}</h2>
          <p className="text-gray-600">{t('admin.settings.categories.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-logo-lime hover:bg-logo-lime/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <LucideIcon name="plus" size="md" color="white" />
          {t('admin.settings.categories.addCategory')}
        </button>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingCategory ? t('admin.settings.categories.editCategory') : t('admin.settings.categories.addNewCategory')}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <LucideIcon name="x" size="lg" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.categories.name')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    placeholder={t('admin.settings.categories.namePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.categories.description')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    placeholder={t('admin.settings.categories.descriptionPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.settings.categories.parentCategory')}
                  </label>
                  <select
                    value={formData.parent}
                    onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  >
                    <option value="">{t('admin.settings.categories.noParent')}</option>
                    {categories
                      .filter(cat => cat._id !== editingCategory?._id)
                      .map((category) => (
                        <option key={category._id} value={category._id}>
                          {'—'.repeat(category.level)} {category.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.categories.sortOrder')}
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.settings.categories.status')}
                    </label>
                    <select
                      value={formData.isActive.toString()}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    >
                      <option value="true">{t('admin.settings.categories.active')}</option>
                      <option value="false">{t('admin.settings.categories.inactive')}</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-logo-lime hover:bg-logo-lime/90 text-white py-2 px-4 rounded-lg font-medium"
                  >
                    {editingCategory ? t('admin.settings.categories.updateCategory') : t('admin.settings.categories.createCategory')}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium"
                  >
                    {t('admin.settings.categories.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <LucideIcon name="circlenotch" size="xl" color="logo-lime" className="animate-spin" />
            <span className="ml-3 text-gray-600">{t('admin.settings.categories.loadingCategories')}</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center p-8">
            <LucideIcon name="tag" size="3xl" color="gray" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('admin.settings.categories.noCategoriesFound')}</h3>
            <p className="text-gray-600 mb-4">{t('admin.settings.categories.getStarted')}</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-logo-lime text-white rounded-lg hover:bg-logo-lime/90"
            >
              <LucideIcon name="plus" size="md" color="white" className="mr-2" />
              {t('admin.settings.categories.addCategory')}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.categories.name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.categories.parent')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.categories.products')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.categories.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.categories.sortOrder')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('admin.settings.categories.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className={`flex items-center ${getIndentClass(category.level)}`}>
                        {category.level > 0 && (
                          <LucideIcon name="caretright" size="sm" color="gray" className="mr-2" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                          {category.description && (
                            <div className="text-sm text-gray-500 mt-1">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {category.parent?.name || '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {category.productCount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        category.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.isActive ? t('admin.settings.categories.active') : t('admin.settings.categories.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {category.sortOrder}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-gray-600 hover:text-logo-lime"
                          title={t('admin.settings.categories.edit')}
                        >
                          <LucideIcon name="gear" size="md" />
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="text-gray-600 hover:text-red-600"
                          title={t('admin.settings.categories.delete')}
                          disabled={category.productCount > 0}
                        >
                          <LucideIcon name="trash" size="md" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesTab;
