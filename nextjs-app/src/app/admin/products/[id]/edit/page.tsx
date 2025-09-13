'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNotification } from '@/contexts/NotificationContextNew';
import { useTranslation } from '@/utils/i18n';
import LucideIcon from '../../../../../components/ui/icons/LucideIcon';
import ImageThumbnailGallery from '../../../../../components/admin/ImageThumbnailGallery';
import { api } from '../../../../../services/api.js';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: {
    url: string;
    alt: string;
  };
}

interface ProductVariant {
  _id?: string;
  size: string; // This is the actual field name in DB
  sizeValue?: number; // Parsed from size
  sizeUnit?: 'ml' | 'l' | 'g' | 'kg'; // Parsed from size
  name?: string; // Fallback for compatibility
  sku: string;
  price: number;
  promotionalPrice?: number;
  cost?: number;
  stock: number; // This is the actual field name in DB
  inventory?: {
    quantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
  };
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  isDefault?: boolean;
  isActive: boolean;
  featured?: boolean;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
}

interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  brand: string;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  features: string[];
  allergens: string[];
  status: 'draft' | 'active' | 'archived';
  visibility: 'visible' | 'hidden';
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

const EditProductPage = () => {
  const params = useParams();
  const router = useRouter();
  const { addNotification } = useNotification();
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    brand: '',
    images: [],
    variants: [],
    tags: [],
    features: [],
    allergens: [],
    status: 'draft',
    visibility: 'visible',
    seo: {
      title: '',
      description: '',
      keywords: []
    }
  });

  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newAllergen, setNewAllergen] = useState('');
  
  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  const productId = params.id as string;

  // Helper function to parse size string into value and unit
  const parseSizeString = (sizeString: string): { sizeValue: number; sizeUnit: 'ml' | 'l' | 'g' | 'kg' } => {
    const match = sizeString.match(/^(\d+(?:\.\d+)?)(ml|l|g|kg)$/i);
    if (match) {
      return {
        sizeValue: parseFloat(match[1]),
        sizeUnit: match[2].toLowerCase() as 'ml' | 'l' | 'g' | 'kg'
      };
    }
    return { sizeValue: 0, sizeUnit: 'ml' };
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch product data
      const productResponse = await api.request(`/admin/products/${productId}`, {
        method: 'GET'
      });

      if (productResponse.success) {
        const product = productResponse.data.product;
        
        // Parse size values for each variant
        const parsedVariants = product.variants?.map((variant: any) => {
          const parsed = parseSizeString(variant.size || '');
          
          // Map imageUrls from database to images format expected by frontend
          const images = variant.imageUrls ? variant.imageUrls.map((url: string, index: number) => ({
            url: url,
            alt: `${variant.size || 'Variant'} - Image ${index + 1}`,
            isPrimary: index === 0 // First image is primary by default
          })) : [];
          
          return {
            ...variant,
            sizeValue: parsed.sizeValue,
            sizeUnit: parsed.sizeUnit,
            images: images
          };
        }) || [];
        
        setFormData({
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription || '',
          category: product.category._id,
          brand: product.brand._id,
          images: product.images || [],
          variants: parsedVariants,
          tags: product.tags || [],
          features: product.features || [],
          allergens: product.allergens || [],
          status: product.status,
          visibility: product.visibility,
          seo: {
            title: product.seo?.title || '',
            description: product.seo?.description || '',
            keywords: product.seo?.keywords || []
          }
        });
      } else {
        throw new Error(productResponse.message || t('admin.editProduct.errors.fetchFailed'));
      }
    } catch (err: any) {
      console.error('Fetch product error:', err);
      setError(err.message);
      addNotification({
        type: 'error',
        message: t('admin.editProduct.errors.loadFailed')
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndBrands = async () => {
    try {
      const [categoriesResponse, brandsResponse] = await Promise.all([
        api.request('/admin/categories?limit=100&includeInactive=false', {
          method: 'GET'
        }),
        api.request('/admin/brands?limit=100&includeInactive=false', {
          method: 'GET'
        })
      ]);

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data.categories);
      }
      if (brandsResponse.success) {
        setBrands(brandsResponse.data.brands);
      }
    } catch (err) {
      console.error('Failed to fetch categories/brands:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.variants.length === 0) {
      addNotification({
        type: 'error',
        message: t('admin.editProduct.validation.variantRequired')
      });
      return;
    }

    try {
      setSaving(true);

      // Transform formData to match database structure
      const transformedData = {
        ...formData,
        variants: formData.variants.map(variant => ({
          ...variant,
          // Convert images array back to imageUrls array for database
          imageUrls: variant.images?.map(img => img.url) || [],
          // Remove the frontend-only images field
          images: undefined
        }))
      };

      const response = await api.request(`/admin/products/${productId}`, {
        method: 'PUT',
        body: transformedData
      });

      if (response.success) {
        addNotification({
          type: 'success',
          message: t('admin.editProduct.success.updated')
        });
        router.push(`/admin/products/${productId}`);
      } else {
        throw new Error(response.message || t('admin.editProduct.errors.updateFailed'));
      }
    } catch (err: any) {
      console.error('Update product error:', err);
      addNotification({
        type: 'error',
        message: err.message || t('admin.editProduct.errors.updateFailed')
      });
    } finally {
      setSaving(false);
    }
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      size: '',
      sizeValue: 0,
      sizeUnit: 'ml',
      sku: `SKU-${Date.now()}`,
      price: 0,
      promotionalPrice: 0,
      stock: 0,
      weight: 0,
      isActive: true,
      isDefault: formData.variants.length === 0,
      images: []
    };
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => {
        if (i !== index) return variant;
        
        const updatedVariant = { ...variant, [field]: value };
        
        // Auto-generate size field when sizeValue or sizeUnit changes
        if (field === 'sizeValue' || field === 'sizeUnit') {
          const sizeValue = field === 'sizeValue' ? value : variant.sizeValue;
          const sizeUnit = field === 'sizeUnit' ? value : variant.sizeUnit;
          
          if (sizeValue && sizeUnit) {
            updatedVariant.size = `${sizeValue}${String(sizeUnit).toUpperCase()}`;
          }
        }
        
        return updatedVariant;
      })
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.seo.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, newKeyword.trim()]
        }
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter(keyword => keyword !== keywordToRemove)
      }
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const addAllergen = () => {
    if (newAllergen.trim() && !formData.allergens.includes(newAllergen.trim())) {
      setFormData(prev => ({
        ...prev,
        allergens: [...prev.allergens, newAllergen.trim()]
      }));
      setNewAllergen('');
    }
  };

  const removeAllergen = (allergenToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.filter(allergen => allergen !== allergenToRemove)
    }));
  };

  const handleImageUpload = async (file: File, variantIndex: number) => {
    try {
      setUploadingImage(true);
      
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await fetch('/api/admin/products/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('admin.editProduct.errors.uploadFailed'));
      }

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          variants: prev.variants.map((variant, i) => 
            i === variantIndex 
              ? { 
                  ...variant, 
                  images: [...variant.images, {
                    url: data.data.url,
                    alt: `${variant.size || 'Variant'} - Image ${variant.images.length + 1}`,
                    isPrimary: variant.images.length === 0 // First image is automatically primary
                  }]
                }
              : variant
          )
        }));
        
        addNotification({
          type: 'success',
          message: t('admin.editProduct.success.imageUploaded')
        });
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Upload image error:', err);
      addNotification({
        type: 'error',
        message: err.message || t('admin.editProduct.errors.uploadFailed')
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, variantIndex: number) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, variantIndex);
    }
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === variantIndex 
          ? { 
              ...variant, 
              images: variant.images.filter((_, idx) => idx !== imageIndex).map((img, idx) => ({
                ...img,
                isPrimary: idx === 0 && variant.images[imageIndex]?.isPrimary // If we removed primary, make first one primary
              }))
            }
          : variant
      )
    }));
  };

  const setVariantPrimaryImage = (variantIndex: number, imageIndex: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === variantIndex 
          ? {
              ...variant,
              images: variant.images.map((img, idx) => ({
                ...img,
                isPrimary: idx === imageIndex
              }))
            }
          : variant
      )
    }));
  };

  const updateVariantImageAlt = (variantIndex: number, imageIndex: number, alt: string) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === variantIndex 
          ? {
              ...variant,
              images: variant.images.map((img, idx) => 
                idx === imageIndex ? { ...img, alt } : img
              )
            }
          : variant
      )
    }));
  };

  // General image management functions
  const handleGeneralImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      
      const uploadFormData = new FormData();
      uploadFormData.append('image', file);

      const response = await fetch('/api/admin/products/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('admin.editProduct.errors.uploadFailed'));
      }

      if (data.success) {
        const newImage = {
          url: data.data.url,
          alt: file.name,
          isPrimary: formData.images.length === 0 // First image is primary by default
        };
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, newImage]
        }));
        
        addNotification({
          type: 'success',
          message: t('admin.editProduct.success.generalImageUploaded')
        });
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Upload general image error:', err);
      addNotification({
        type: 'error',
        message: err.message || t('admin.editProduct.errors.generalImageUploadFailed')
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGeneralFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleGeneralImageUpload(file);
    }
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  const removeGeneralImage = (index: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      // If we removed the primary image, make the first remaining image primary
      if (prev.images[index].isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      return { ...prev, images: newImages };
    });
  };

  const setGeneralPrimaryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }));
  };

  const updateGeneralImageAlt = (index: number, alt: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, alt } : img
      )
    }));
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
      fetchCategoriesAndBrands();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <LucideIcon name="circlenotch" size="xl" color="logo-lime" className="animate-spin" />
          <span className="ml-3 text-gray-600">Loading product...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <LucideIcon name="xcircle" size="lg" color="error" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{t('admin.editProduct.error')}</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => fetchProduct()}
                  className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
                >
                  {t('admin.editProduct.tryAgainButton')}
                </button>
                <Link
                  href="/admin/products"
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded"
                >
                  {t('admin.editProduct.backToProductsButton')}
                </Link>
              </div>
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
        <div className="flex items-center gap-4">
          <Link
            href={`/admin/products/${productId}`}
            className="text-gray-600 hover:text-gray-900"
          >
            <LucideIcon name="arrowleft" size="lg" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('admin.editProduct.title')}</h1>
            <p className="text-gray-600">{t('admin.editProduct.subtitle')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/products/${productId}`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
          >
            {t('admin.editProduct.cancelButton')}
          </Link>
          <button
            type="submit"
            form="edit-product-form"
            disabled={saving}
            className="bg-logo-lime hover:bg-logo-lime/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            {saving ? (
              <>
                <LucideIcon name="circlenotch" size="md" className="animate-spin" />
                {t('admin.editProduct.updatingButton')}
              </>
            ) : (
              <>
                <LucideIcon name="check" size="md" />
                {t('admin.editProduct.updateButton')}
              </>
            )}
          </button>
        </div>
      </div>

      <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.addProduct.basicInfo.title')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.addProduct.basicInfo.productName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    placeholder={t('admin.addProduct.basicInfo.productNamePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.addProduct.basicInfo.shortDescription')}
                  </label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    placeholder={t('admin.addProduct.basicInfo.shortDescriptionPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.addProduct.basicInfo.description')} *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    placeholder={t('admin.addProduct.basicInfo.descriptionPlaceholder')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.addProduct.basicInfo.category')} *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    >
                      <option value="">{t('admin.addProduct.basicInfo.selectCategory')}</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.addProduct.basicInfo.brand')} *
                    </label>
                    <select
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    >
                      <option value="">{t('admin.addProduct.basicInfo.selectBrand')}</option>
                      {brands.map((brand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>


            {/* General Product Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.addProduct.images.title')}</h2>
              <p className="text-sm text-gray-600 mb-4">
                {t('admin.addProduct.images.description')}
              </p>
              
              {/* Upload Section */}
              <div className="mb-6">
                <input
                  type="file"
                  id="general-image-upload"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleGeneralFileChange}
                  className="hidden"
                  disabled={uploadingImage}
                />
                <label
                  htmlFor="general-image-upload"
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50 ${
                    uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingImage ? (
                    <>
                      <LucideIcon name="circlenotch" size="sm" className="animate-spin mr-2" />
                      {t('admin.addProduct.images.uploading')}
                    </>
                  ) : (
                    <>
                      <LucideIcon name="plus" size="sm" className="mr-2" />
                      Upload General Image
                    </>
                  )}
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG, or WebP. Max 10MB.
                </p>
              </div>

              {/* General Images Gallery */}
              <ImageThumbnailGallery 
                images={formData.images}
                title=""
                onSetPrimary={setGeneralPrimaryImage}
                onRemoveImage={removeGeneralImage}
                onUpdateAlt={updateGeneralImageAlt}
                showControls={true}
                maxHeight="400px"
                className="mt-4"
              />
            </div>

            {/* Product Variants */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{t('admin.addProduct.variants.title')}</h2>
                <button
                  type="button"
                  onClick={addVariant}
                  className="bg-logo-lime hover:bg-logo-lime/90 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <LucideIcon name="plus" size="sm" />
                  {t('admin.addProduct.variants.addButton')}
                </button>
              </div>

              <div className="space-y-4">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">
                        Variant {index + 1}
                        {variant.isDefault && (
                          <span className="ml-2 bg-logo-lime text-white text-xs px-2 py-1 rounded">Default</span>
                        )}
                      </h3>
                      {formData.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <LucideIcon name="trash" size="md" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin.addProduct.variants.sizeValue')} *
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={variant.sizeValue || ''}
                          onChange={(e) => updateVariant(index, 'sizeValue', parseFloat(e.target.value) || 0)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                          placeholder={t('admin.addProduct.variants.sizeValuePlaceholder')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Unit *
                        </label>
                        <select
                          value={variant.sizeUnit || 'ml'}
                          onChange={(e) => updateVariant(index, 'sizeUnit', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                        >
                          <optgroup label={t('admin.addProduct.variants.volume')}>
                            <option value="ml">{t('admin.addProduct.variants.ml')}</option>
                            <option value="l">{t('admin.addProduct.variants.l')}</option>
                          </optgroup>
                          <optgroup label={t('admin.addProduct.variants.weight')}>
                            <option value="g">{t('admin.addProduct.variants.g')}</option>
                            <option value="kg">{t('admin.addProduct.variants.kg')}</option>
                          </optgroup>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Generated Size
                        </label>
                        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                          {variant.sizeValue && variant.sizeUnit ? `${variant.sizeValue}${variant.sizeUnit.toUpperCase()}` : 'Enter value and unit'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin.addProduct.variants.sku')} *
                        </label>
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                          placeholder={t('admin.addProduct.variants.skuPlaceholder')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin.addProduct.variants.regularPrice')} *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={variant.price || 0}
                          onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin.addProduct.variants.promotionalPrice')}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={variant.promotionalPrice || ''}
                          onChange={(e) => updateVariant(index, 'promotionalPrice', parseFloat(e.target.value) || undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                          placeholder={t('admin.addProduct.variants.promoPlaceholder')}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Optional. If set, will be shown as the main price with regular price crossed out.
                        </p>
                      </div>


                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin.addProduct.variants.stock')}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={variant.stock || 0}
                          onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('admin.editProduct.variants.weight')}
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={variant.weight || 0}
                          onChange={(e) => updateVariant(index, 'weight', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={variant.isActive !== false}
                          onChange={(e) => updateVariant(index, 'isActive', e.target.checked)}
                          className="rounded border-gray-300 text-logo-lime focus:ring-logo-lime"
                        />
                        <span className="ml-2 text-sm text-gray-700">{t('admin.editProduct.variants.activeVariant')}</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={variant.isDefault || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              // Set this as default and remove default from others
                              setFormData(prev => ({
                                ...prev,
                                variants: prev.variants.map((v, i) => ({
                                  ...v,
                                  isDefault: i === index
                                }))
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-logo-lime focus:ring-logo-lime"
                        />
                        <span className="ml-2 text-sm text-gray-700">Default variant</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={variant.featured || false}
                          onChange={(e) => updateVariant(index, 'featured', e.target.checked)}
                          className="rounded border-gray-300 text-logo-lime focus:ring-logo-lime"
                        />
                        <span className="ml-2 text-sm text-gray-700">Featured variant</span>
                      </label>
                    </div>

                    {/* Variant Images */}
                    <div className="md:col-span-3 mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Variant-Specific Images
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        Upload images specific to this variant size (showing the actual {variant.size || 'variant'} product)
                      </p>
                      
                      {/* Upload Section */}
                      <div className="mb-4">
                        <input
                          type="file"
                          id={`image-upload-${index}`}
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={(e) => handleFileChange(e, index)}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                        <label
                          htmlFor={`image-upload-${index}`}
                          className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-50 ${
                            uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {uploadingImage ? (
                            <>
                              <LucideIcon name="circlenotch" size="sm" className="animate-spin mr-2" />
                              {t('admin.addProduct.images.uploading')}
                            </>
                          ) : (
                            <>
                              <LucideIcon name="plus" size="sm" className="mr-2" />
                              {t('admin.addProduct.variants.addImageButton')}
                            </>
                          )}
                        </label>
                      </div>

                      {/* Variant Images Gallery */}
                      <ImageThumbnailGallery 
                        images={variant.images}
                        title=""
                        onSetPrimary={(imageIndex) => setVariantPrimaryImage(index, imageIndex)}
                        onRemoveImage={(imageIndex) => removeVariantImage(index, imageIndex)}
                        onUpdateAlt={(imageIndex, alt) => updateVariantImageAlt(index, imageIndex, alt)}
                        showControls={true}
                        maxHeight="300px"
                        className="mt-4"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.addProduct.tags.title')}</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    placeholder={t('admin.addProduct.tags.placeholder')}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
                  >
                    {t('admin.addProduct.tags.addButton')}
                  </button>
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-logo-lime/10 text-logo-lime text-sm px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-logo-lime hover:text-logo-lime/80"
                        >
                          <LucideIcon name="x" size="xs" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Features & Allergies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Features */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.addProduct.features.title')}</h2>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder={t('admin.addProduct.features.placeholder')}
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
                    >
                      {t('admin.addProduct.features.addButton')}
                    </button>
                  </div>

                  {formData.features.length > 0 && (
                    <div className="space-y-2">
                      {formData.features.map((feature, index) => (
                        <div
                          key={index}
                          className="bg-blue-50 text-blue-900 text-sm px-3 py-2 rounded-lg flex items-center justify-between"
                        >
                          <span>{feature}</span>
                          <button
                            type="button"
                            onClick={() => removeFeature(feature)}
                            className="text-blue-600 hover:text-blue-800 ml-2"
                          >
                            <LucideIcon name="x" size="xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Allergies */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.addProduct.allergies.title')}</h2>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAllergen}
                      onChange={(e) => setNewAllergen(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder={t('admin.addProduct.allergies.placeholder')}
                    />
                    <button
                      type="button"
                      onClick={addAllergen}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
                    >
                      {t('admin.addProduct.allergies.addButton')}
                    </button>
                  </div>

                  {formData.allergens.length > 0 && (
                    <div className="space-y-2">
                      {formData.allergens.map((allergen, index) => (
                        <div
                          key={index}
                          className="bg-red-50 text-red-900 text-sm px-3 py-2 rounded-lg flex items-center justify-between"
                        >
                          <span>{allergen}</span>
                          <button
                            type="button"
                            onClick={() => removeAllergen(allergen)}
                            className="text-red-600 hover:text-red-800 ml-2"
                          >
                            <LucideIcon name="x" size="xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.editProduct.status.title')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.editProduct.status.productStatus')}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  >
                    <option value="draft">{t('admin.products.status.draft')}</option>
                    <option value="active">{t('admin.products.status.active')}</option>
                    <option value="archived">{t('admin.editProduct.status.archived')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.editProduct.status.visibility')}
                  </label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  >
                    <option value="visible">{t('admin.editProduct.status.visible')}</option>
                    <option value="hidden">{t('admin.editProduct.status.hidden')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.addProduct.seo.title')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.addProduct.seo.seoTitle')}
                  </label>
                  <input
                    type="text"
                    value={formData.seo.title}
                    onChange={(e) => setFormData({
                      ...formData,
                      seo: { ...formData.seo, title: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    placeholder={t('admin.addProduct.seo.titlePlaceholder')}
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.seo.title.length}/60 {t('admin.addProduct.seo.characters')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.addProduct.seo.seoDescription')}
                  </label>
                  <textarea
                    value={formData.seo.description}
                    onChange={(e) => setFormData({
                      ...formData,
                      seo: { ...formData.seo, description: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    placeholder={t('admin.addProduct.seo.descriptionPlaceholder')}
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.seo.description.length}/160 {t('admin.addProduct.seo.characters')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.addProduct.seo.keywords')}
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                        placeholder={t('admin.addProduct.seo.keywordPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={addKeyword}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
                      >
                        {t('admin.addProduct.seo.addButton')}
                      </button>
                    </div>

                    {formData.seo.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {formData.seo.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded flex items-center gap-1"
                          >
                            {keyword}
                            <button
                              type="button"
                              onClick={() => removeKeyword(keyword)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <LucideIcon name="x" size="xs" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
