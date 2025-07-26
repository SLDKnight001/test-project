import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { updateCartItem, removeFromCart } from '../../slices/cartSlice';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '../../model/CartItem';

interface ModifyCartProps {
  item: CartItem;
  onUpdate?: () => void;
}

const ModifyCart: React.FC<ModifyCartProps> = ({ item, onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.product.stock) return;
    
    setIsUpdating(true);
    try {
      await dispatch(updateCartItem({ 
        productId: item.productId, 
        quantity: newQuantity 
      })).unwrap();
      onUpdate?.();
    } catch (error) {
      console.error('Failed to update cart item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await dispatch(removeFromCart(item.productId)).unwrap();
      onUpdate?.();
    } catch (error) {
      console.error('Failed to remove cart item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentPrice = item.product.discountPrice || item.product.price;
  const totalPrice = currentPrice * item.quantity;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={item.product.images[0] || '/src/assets/products/laptop.jpg'}
            alt={item.product.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-secondary-900 truncate">
            {item.product.name}
          </h3>
          <p className="text-sm text-secondary-600 mb-2">
            Brand: {item.product.brand}
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary-600">
              ${currentPrice.toFixed(2)}
            </span>
            {item.product.discountPrice && (
              <span className="text-sm text-secondary-500 line-through">
                ${item.product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-secondary-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="p-2 text-secondary-600 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 text-center min-w-[3rem] font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= item.product.stock}
              className="p-2 text-secondary-600 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            title="Remove from cart"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <p className="text-lg font-bold text-secondary-900">
            ${totalPrice.toFixed(2)}
          </p>
          <p className="text-sm text-secondary-600">
            Stock: {item.product.stock}
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="spinner border-primary-600"></div>
        </div>
      )}
    </div>
  );
};

export default ModifyCart;