// Action Types
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
export const CLEAR_CART = 'CLEAR_CART';

/**
 * Add an item to the cart
 *
 * @param {Object} product - The product to add
 * @param {number} quantity - The quantity to add (default: 1)
 * @param {string|null} variant - Optional variant information
 * @returns {Object} Action object
 */
export const addToCart = (product, quantity = 1, variant = null) => ({
  type: ADD_TO_CART,
  payload: {
    id: variant ? `${product.id}_${variant}` : product.id,
    product,
    quantity,
    variant,
    price: product.price,
    name: product.name,
    image: product.image
  }
});

/**
 * Remove an item from the cart
 *
 * @param {string|number} id - The ID of the item to remove
 * @returns {Object} Action object
 */
export const removeFromCart = (id) => ({
  type: REMOVE_FROM_CART,
  payload: { id }
});

/**
 * Update the quantity of an item in the cart
 *
 * @param {string|number} id - The ID of the item
 * @param {number} quantity - The new quantity
 * @returns {Object} Action object
 */
export const updateQuantity = (id, quantity) => ({
  type: UPDATE_QUANTITY,
  payload: { id, quantity }
});

/**
 * Clear all items from the cart
 *
 * @returns {Object} Action object
 */
export const clearCart = () => ({
  type: CLEAR_CART
});