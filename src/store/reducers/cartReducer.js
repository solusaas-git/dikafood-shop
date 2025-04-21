import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
  CLEAR_CART
} from '../actions/cartActions';

// Try to load initial state from localStorage
const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem('dikaCart');
    return storedCart ? JSON.parse(storedCart) : { items: [] };
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return { items: [] };
  }
};

// Initial state
const initialState = loadCartFromStorage();

// Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('dikaCart', JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

/**
 * Cart reducer
 *
 * @param {Object} state - Current state
 * @param {Object} action - Action object
 * @returns {Object} New state
 */
const cartReducer = (state = initialState, action) => {
  let newState;

  switch (action.type) {
    case ADD_TO_CART: {
      const { id, product, quantity, variant, price, name, image } = action.payload;

      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(item => item.id === id);

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + quantity
        };

        newState = {
          ...state,
          items: updatedItems
        };
      } else {
        // Add new item
        newState = {
          ...state,
          items: [...state.items, {
            id,
            product,
            variant,
            quantity,
            price,
            name,
            image
          }]
        };
      }
      break;
    }

    case REMOVE_FROM_CART: {
      const { id } = action.payload;

      newState = {
        ...state,
        items: state.items.filter(item => item.id !== id)
      };
      break;
    }

    case UPDATE_QUANTITY: {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // If quantity is 0 or negative, remove item
        newState = {
          ...state,
          items: state.items.filter(item => item.id !== id)
        };
      } else {
        // Update quantity
        newState = {
          ...state,
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        };
      }
      break;
    }

    case CLEAR_CART:
      newState = {
        ...state,
        items: []
      };
      break;

    default:
      return state;
  }

  // Save to localStorage
  saveCartToStorage(newState);

  return newState;
};

export default cartReducer;