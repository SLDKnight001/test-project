import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { addToCart } from '../../slices/cartSlice';
import { Product as ProductType } from '../../model/CartItem';
import { ShoppingCart, Star, Eye, Heart } from 'lucide-react';


interface ProductProps {
  product: ProductType;
  viewMode?: 'grid' | 'list';
}

const Product: React.FC<ProductProps> = ({ product, viewMode = 'grid' }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
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

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      return;
    }

    // Get current wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isInWishlist) {
      // Remove from wishlist
      const updated = wishlist.filter((item: any) => item._id !== product._id);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      setIsInWishlist(false);
    } else {
      // Add to wishlist
      wishlist.push({ ...product, addedAt: new Date().toISOString() });
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      setIsInWishlist(true);
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

  // Check if product is in wishlist on component mount
  React.useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsInWishlist(wishlist.some((item: any) => item._id === product._id));
  }, [product._id]);


  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="flex">
          {/* Image */}
          <div className="relative w-48 h-48 flex-shrink-0 bg-gray-50">
            <img
              src={productImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-sm text-gray-500">{product.brand}</span>
              </div>
              
              <Link to={`/product/${product._id}`}>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {product.name}
                </h3>
              </Link>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  ({product.reviewCount})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">
                  ${currentPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0 || !isAuthenticated}
                className={`flex items-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                  product.stock === 0 || !isAuthenticated
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
                }`}
              >
                {isAddingToCart ? (
                  <div className="spinner border-white"></div>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    <span>
                      {!isAuthenticated 
                        ? 'Login' 
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
        </div>
      </div>
    );
  }

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
              <button
                onClick={handleWishlistToggle}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
              >
                <Heart className={`h-4 w-4 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
              </button>
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