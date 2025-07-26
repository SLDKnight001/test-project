import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { addToCart } from '../../slices/cartSlice';
import { Product as ProductType } from '../../model/CartItem';
import { ShoppingCart, Star, Eye, Heart } from 'lucide-react';

interface ProductProps {
  product: ProductType;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }

    setIsAddingToCart(true);
    try {
      await dispatch(addToCart({ 
        productId: product._id, 
        quantity: 1 
      })).unwrap();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const currentPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const defaultImage = '/src/assets/products/laptop.jpg';
  const productImage = !imageError && product.images?.[0] 
    ? product.images[0] 
    : defaultImage;

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link to={`/product/${product._id}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-secondary-50">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {hasDiscount && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{discountPercentage}%
              </span>
            )}
            {product.featured && (
              <span className="bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                Featured
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-secondary-50 transition-colors duration-200">
              <Heart className="h-4 w-4 text-secondary-600" />
            </button>
            <Link 
              to={`/product/${product._id}`}
              className="p-2 bg-white rounded-full shadow-md hover:bg-secondary-50 transition-colors duration-200"
            >
              <Eye className="h-4 w-4 text-secondary-600" />
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category & Brand */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2 py-1 rounded-full">
              {product.category}
            </span>
            <span className="text-xs text-secondary-500">
              {product.brand}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-secondary-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-secondary-600 ml-2">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-primary-600">
                ${currentPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-secondary-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-sm text-secondary-600">
              Stock: {product.stock}
            </span>
          </div>

          {/* Specifications Preview */}
          {product.specifications && (
            <div className="mb-4">
              <div className="text-xs text-secondary-600 space-y-1">
                {product.specifications.processor && (
                  <div className="truncate">
                    <span className="font-medium">CPU:</span> {product.specifications.processor}
                  </div>
                )}
                {product.specifications.ram && (
                  <div className="truncate">
                    <span className="font-medium">RAM:</span> {product.specifications.ram}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || product.stock === 0 || !isAuthenticated}
          className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
            product.stock === 0 || !isAuthenticated
              ? 'bg-secondary-200 text-secondary-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-md'
          }`}
        >
          {isAddingToCart ? (
            <div className="spinner border-white"></div>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              <span>
                {!isAuthenticated 
                  ? 'Login to Buy' 
                  : product.stock === 0 
                    ? 'Out of Stock' 
                    : 'Add to Cart'
                }
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Product;