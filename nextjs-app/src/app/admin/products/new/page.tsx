'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/contexts/NotificationContextNew';
import { useTranslation } from '@/utils/i18n';
import LucideIcon from '../../../../components/ui/icons/LucideIcon';
import ImageThumbnailGallery from '../../../../components/admin/ImageThumbnailGallery';

interface Brand {
  _id: string;
  name: string;
  slug: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  level: number;
}

interface ProductVariant {
  size: string;
  sizeValue: number;
  sizeUnit: 'ml' | 'l' | 'g' | 'kg';
  price: number;
  promotionalPrice?: number;
  stock: number;
  sku: string;
  weight?: number;
  featured?: boolean;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
}

const NewProductPage = () => {
  const router = useRouter();
  const { addNotification } = useNotification();
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    brand: '',
    category: '',
    status: 'draft' as 'draft' | 'active' | 'inactive',
    featured: false,
    tags: [] as string[],
    features: [] as string[],
    allergens: [] as string[],
    seo: {
      title: '',
      description: '',
      keywords: [] as string[]
    }
  });
  
  const [variants, setVariants] = useState<ProductVariant[]>([
    { size: '', sizeValue: 0, sizeUnit: 'ml', price: 0, promotionalPrice: 0, stock: 0, sku: '', weight: 0, images: [] }
  ]);
  
  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [allergenInput, setAllergenInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  
  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedVariantForImage, setSelectedVariantForImage] = useState<number>(0);
  
  // General product images state
  const [generalImages, setGeneralImages] = useState<Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>>([]);

  // Fetch brands and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/admin/brands', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }),
          fetch('/api/admin/categories', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
          })
        ]);

        const brandsData = await brandsResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (brandsData.success) {
          setBrands(brandsData.data.brands);
        }

        if (categoriesData.success) {
          setCategories(categoriesData.data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        addNotification({
          type: 'error',
          message: 'Failed to load brands and categories'
        });
      }
    };

    fetchData();
  }, [addNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.description || !formData.brand || !formData.category) {
      addNotification({
        type: 'error',
        message: t('admin.addProduct.validation.requiredFields')
      });
      return;
    }

    if (variants.length === 0 || !variants[0].size || variants[0].price <= 0) {
      addNotification({
        type: 'error',
        message: t('admin.addProduct.validation.variantRequired')
      });
      return;
    }

    try {
      setLoading(true);

      const productData = {
        ...formData,
        variants: variants.filter(v => v.size && v.price > 0),
        images: generalImages
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('admin.addProduct.errors.createFailed'));
      }

      if (data.success) {
        addNotification({
          type: 'success',
          message: t('admin.addProduct.success.created')
        });
        router.push('/admin/products');
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Create product error:', err);
      addNotification({
        type: 'error',
        message: err.message || t('admin.addProduct.errors.createFailed')
      });
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    setVariants([...variants, { size: '', sizeValue: 0, sizeUnit: 'ml', price: 0, promotionalPrice: 0, stock: 0, sku: '', weight: 0, images: [] }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number | boolean) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    
    // Auto-generate size field when sizeValue or sizeUnit changes
    if (field === 'sizeValue' || field === 'sizeUnit') {
      const variant = updatedVariants[index];
      const sizeValue = field === 'sizeValue' ? value : variant.sizeValue;
      const sizeUnit = field === 'sizeUnit' ? value : variant.sizeUnit;
      
      if (sizeValue && sizeUnit) {
        updatedVariants[index].size = `${sizeValue}${String(sizeUnit).toUpperCase()}`;
      }
    }
    
    setVariants(updatedVariants);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter(f => f !== feature)
    });
  };

  const addAllergen = () => {
    if (allergenInput.trim() && !formData.allergens.includes(allergenInput.trim())) {
      setFormData({
        ...formData,
        allergens: [...formData.allergens, allergenInput.trim()]
      });
      setAllergenInput('');
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData({
      ...formData,
      allergens: formData.allergens.filter(a => a !== allergen)
    });
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.seo.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        seo: {
          ...formData.seo,
          keywords: [...formData.seo.keywords, keywordInput.trim()]
        }
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      seo: {
        ...formData.seo,
        keywords: formData.seo.keywords.filter(k => k !== keyword)
      }
    });
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
        throw new Error(data.message || t('admin.addProduct.errors.uploadFailed'));
      }

      if (data.success) {
        const updatedVariants = [...variants];
        const isFirstImage = updatedVariants[variantIndex].images.length === 0;
        updatedVariants[variantIndex].images.push({
          url: data.data.url,
          alt: `${updatedVariants[variantIndex].size || 'Variant'} - Image ${updatedVariants[variantIndex].images.length + 1}`,
          isPrimary: isFirstImage // First image is automatically primary
        });
        setVariants(updatedVariants);
        
        addNotification({
          type: 'success',
          message: t('admin.addProduct.success.imageUploaded')
        });
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Upload image error:', err);
      addNotification({
        type: 'error',
        message: err.message || t('admin.addProduct.errors.uploadFailed')
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
    const updatedVariants = [...variants];
    const wasRemovingPrimary = updatedVariants[variantIndex].images[imageIndex]?.isPrimary;
    
    updatedVariants[variantIndex].images.splice(imageIndex, 1);
    
    // If we removed the primary image and there are still images, make the first one primary
    if (wasRemovingPrimary && updatedVariants[variantIndex].images.length > 0) {
      updatedVariants[variantIndex].images[0].isPrimary = true;
    }
    
    setVariants(updatedVariants);
  };

  const setVariantPrimaryImage = (variantIndex: number, imageIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].images.forEach((img, i) => {
      img.isPrimary = i === imageIndex;
    });
    setVariants(updatedVariants);
  };

  const updateVariantImageAlt = (variantIndex: number, imageIndex: number, alt: string) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].images[imageIndex].alt = alt;
    setVariants(updatedVariants);
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
        throw new Error(data.message || t('admin.addProduct.errors.uploadFailed'));
      }

      if (data.success) {
        const newImage = {
          url: data.data.url,
          alt: file.name,
          isPrimary: generalImages.length === 0 // First image is primary by default
        };
        
        setGeneralImages(prev => [...prev, newImage]);
        addNotification({
          type: 'success',
          message: 'General image uploaded successfully'
        });
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      console.error('Upload general image error:', err);
      addNotification({
        type: 'error',
        message: err.message || 'Failed to upload general image'
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
    setGeneralImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // If we removed the primary image, make the first remaining image primary
      if (prev[index].isPrimary && newImages.length > 0) {
        newImages[0].isPrimary = true;
      }
      return newImages;
    });
  };

  const setGeneralPrimaryImage = (index: number) => {
    setGeneralImages(prev => prev.map((img, i) => ({
      ...img,
      isPrimary: i === index
    })));
  };

  const updateGeneralImageAlt = (index: number, alt: string) => {
    setGeneralImages(prev => prev.map((img, i) => 
      i === index ? { ...img, alt } : img
    ));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          <LucideIcon name="arrowleft" size="lg" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.addProduct.title')}</h1>
          <p className="text-gray-600">{t('admin.addProduct.subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.addProduct.basicInfo.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
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
                    {'—'.repeat(category.level)} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.addProduct.basicInfo.shortDescription')}
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                placeholder={t('admin.addProduct.basicInfo.shortDescriptionPlaceholder')}
                maxLength={300}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.addProduct.basicInfo.description')} *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                placeholder={t('admin.addProduct.basicInfo.descriptionPlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.addProduct.basicInfo.status')}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              >
                <option value="draft">{t('admin.products.status.draft')}</option>
                <option value="active">{t('admin.products.status.active')}</option>
                <option value="inactive">{t('admin.products.status.inactive')}</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-gray-300 text-logo-lime focus:ring-logo-lime"
                />
                <span className="ml-2 text-sm text-gray-700">{t('admin.addProduct.basicInfo.featuredProduct')}</span>
              </label>
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
                  {t('admin.addProduct.images.uploadButton')}
                </>
              )}
            </label>
            <p className="text-xs text-gray-500 mt-1">
              {t('admin.addProduct.images.fileTypes')}
            </p>
          </div>

          {/* General Images Gallery */}
          <ImageThumbnailGallery 
            images={generalImages}
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
              className="text-logo-lime hover:text-logo-lime/80 font-medium flex items-center gap-1"
            >
              <LucideIcon name="plus" size="sm" />
              {t('admin.addProduct.variants.addButton')}
            </button>
          </div>

          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Size Information */}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder={t('admin.addProduct.variants.sizeValuePlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.addProduct.variants.unit')} *
                    </label>
                    <select
                      value={variant.sizeUnit}
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
                      {t('admin.addProduct.variants.generatedSize')}
                    </label>
                    <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                      {variant.sizeValue && variant.sizeUnit ? `${variant.sizeValue}${variant.sizeUnit.toUpperCase()}` : t('admin.addProduct.variants.enterValueUnit')}
                    </div>
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.addProduct.variants.regularPrice')} *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
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
                      {t('admin.addProduct.variants.promoDescription')}
                    </p>
                  </div>
                </div>

                {/* Inventory & SKU */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.addProduct.variants.stock')}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={variant.stock}
                      onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('admin.addProduct.variants.sku')}
                    </label>
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                      placeholder={t('admin.addProduct.variants.skuPlaceholder')}
                    />
                  </div>
                </div>

                {/* Variant Actions & Options */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={variant.featured || false}
                        onChange={(e) => updateVariant(index, 'featured', e.target.checked)}
                        className="rounded border-gray-300 text-logo-lime focus:ring-logo-lime"
                      />
                      <span className="ml-2 text-sm text-gray-700">{t('admin.addProduct.variants.featuredVariant')}</span>
                    </label>
                    <p className="text-xs text-gray-500">{t('admin.addProduct.variants.featuredDescription')}</p>
                  </div>
                  
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <LucideIcon name="trash" size="sm" />
                      <span className="text-sm">{t('admin.addProduct.variants.removeButton')}</span>
                    </button>
                  )}
                </div>

                {/* Variant Images - Full width */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('admin.addProduct.variants.variantImages')}
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    {t('admin.addProduct.variants.variantImagesDescription')}
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
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
              placeholder={t('admin.addProduct.tags.placeholder')}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
            >
              {t('admin.addProduct.tags.addButton')}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-logo-lime/10 text-logo-lime"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-logo-lime hover:text-logo-lime/80"
                >
                  <LucideIcon name="x" size="sm" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Features & Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Features */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.addProduct.features.title')}</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                placeholder={t('admin.addProduct.features.placeholder')}
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                {t('admin.addProduct.features.addButton')}
              </button>
            </div>

            <div className="space-y-2">
              {formData.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-700">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <LucideIcon name="x" size="sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.addProduct.allergies.title')}</h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={allergenInput}
                onChange={(e) => setAllergenInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergen())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                placeholder={t('admin.addProduct.allergies.placeholder')}
              />
              <button
                type="button"
                onClick={addAllergen}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                {t('admin.addProduct.allergies.addButton')}
              </button>
            </div>

            <div className="space-y-2">
              {formData.allergens.map((allergen) => (
                <div
                  key={allergen}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-gray-700">{allergen}</span>
                  <button
                    type="button"
                    onClick={() => removeAllergen(allergen)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <LucideIcon name="x" size="sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEO Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('admin.addProduct.seo.title')}</h3>
          
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
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-logo-lime focus:border-transparent"
                  placeholder={t('admin.addProduct.seo.keywordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                >
                  {t('admin.addProduct.seo.addButton')}
                </button>
              </div>

              {formData.seo.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {formData.seo.keywords.map((keyword) => (
                    <span
                      key={keyword}
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

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-logo-lime hover:bg-logo-lime/90 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <LucideIcon name="circlenotch" size="md" color="white" className="animate-spin" />}
            {t('admin.addProduct.createButton')}
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium"
          >
            {t('admin.addProduct.cancelButton')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProductPage;
