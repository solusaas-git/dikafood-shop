/**
 * Utility functions for handling checkout items across different data sources
 */

/**
 * Generate a unique key for an item
 * @param {Object} item - The item object
 * @param {number} index - The item index
 * @returns {string} - Unique key for the item
 */
export const generateItemKey = (item, index) => {
  return (
    item.itemId || 
    item.id || 
    item._id || 
    (item.main?.productId ? `${item.main.productId}-${index}` : `item-${index}`)
  );
};

/**
 * Get the product title from an item
 * @param {Object} item - The item object
 * @returns {string} - Product title
 */
export const getItemTitle = (item) => {
  return item.productName || item.main?.productTitle || 'Product';
};

/**
 * Get the image source for an item
 * Updated for new storage service integration
 * @param {Object} item - The item object
 * @returns {string|null} - Image source URL or null
 */
export const getItemImageSrc = (item) => {
  // Priority 1: Use existing processed image URLs
  if (item.productImage || item.image) {
    return item.productImage || item.image;
  }
  
  // Priority 2: Check for storageKey in main object (new storage service)
  if (item.main?.storageKey) {
    return `/storage/files/${item.main.storageKey}?variant=thumbnail`;
  }
  
  // Priority 3: Check for storageKey in item itself
  if (item.storageKey) {
    return `/storage/files/${item.storageKey}?variant=thumbnail`;
  }
  
  // Priority 4: Check for direct storageKey string in image field
  if (item.main?.image && typeof item.main.image === 'string' && /^[a-f0-9]{32}$/i.test(item.main.image)) {
    return `/storage/files/${item.main.image}?variant=thumbnail`;
  }
  
  // Priority 5: Legacy imageId support
  if (item.main?.imageId) {
    return `/files/product-images/${item.main.imageId}`;
  }
  
  return null;
};

/**
 * Get the quantity for an item
 * @param {Object} item - The item object
 * @returns {number} - Item quantity
 */
export const getItemQuantity = (item) => {
  return item.quantity || item.main?.quantity || 1;
};

/**
 * Get the size for an item
 * @param {Object} item - The item object
 * @returns {string|null} - Item size
 */
export const getItemSize = (item) => {
  return item.main?.size || item.size || null;
};

/**
 * Get the price for an item
 * @param {Object} item - The item object
 * @returns {number} - Item price
 */
export const getItemPrice = (item) => {
  return (
    item.totalPrice || 
    (item.unitPrice * getItemQuantity(item)) || 
    (item.main?.price * (item.main?.quantity || 1)) || 
    0
  );
};

/**
 * Format item properties for display
 * @param {Object} item - The item object
 * @param {string} dataSource - 'cart' or 'order'
 * @returns {Array} - Array of formatted property strings
 */
export const formatItemProperties = (item, dataSource) => {
  const properties = [];

  if (dataSource === 'cart' && item.itemProperties && Array.isArray(item.itemProperties)) {
    item.itemProperties.forEach((prop) => {
      let displayText = '';
      if (typeof prop === 'object') {
        const values = Object.values(prop).filter(v => v);
        if (values.length) {
          displayText = values.join(': ');
        }
      } else if (typeof prop === 'string') {
        displayText = prop;
      }
      
      if (displayText) {
        properties.push(displayText);
      }
    });
  } else if (dataSource === 'order' && item.main?.properties && Object.keys(item.main.properties).length > 0) {
    Object.entries(item.main.properties).forEach(([key, value]) => {
      properties.push(`${key}: ${value}`);
    });
  }

  return properties;
};

/**
 * Get formatted item details string for display
 * @param {Object} item - The item object
 * @param {string} dataSource - 'cart' or 'order'
 * @returns {string} - Formatted details string
 */
export const getItemDetailsString = (item, dataSource) => {
  const details = [];
  
  // Add size
  const size = getItemSize(item);
  if (size) {
    details.push(size);
  }
  
  // Add brand
  if (item.brand || item.brandDisplayName) {
    details.push(item.brandDisplayName || item.brand);
  }
  
  // Add properties
  const properties = formatItemProperties(item, dataSource);
  details.push(...properties);
  
  // Add quantity if > 1
  const quantity = getItemQuantity(item);
  if (quantity > 1) {
    details.push(`Qté: ${quantity}`);
  }
  
  return details.join(' • ');
}; 