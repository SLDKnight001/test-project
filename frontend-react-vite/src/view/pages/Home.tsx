import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchFeaturedProducts } from '../../slices/productsSlice';
import Product from '../common/Product';
import { 
  ArrowRight, 
  Shield, 
  Truck, 
  Headphones, 
  Award,
  Star,
  Users,
  Package,
  TrendingUp
} from 'lucide-react';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { featuredProducts, loading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchFeaturedProducts(8));
  }, [dispatch]);

  const features = [
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'All products come with manufacturer warranty and quality assurance'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Free shipping on orders over $100 with express delivery options'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Expert technical support available round the clock'
    },
    {
      icon: Award,
      title: 'Best Prices',
      description: 'Competitive pricing with regular discounts and offers'
    }
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Happy Customers' },
    { icon: Package, value: '5,000+', label: 'Products Sold' },
    { icon: Star, value: '4.9', label: 'Average Rating' },
    { icon: TrendingUp, value: '99%', label: 'Satisfaction Rate' }
  ];

  const categories = [
    {
      name: 'Laptops',
      image: '/src/assets/products/laptop.jpg',
      description: 'High-performance laptops for work and gaming'
    },
    {
      name: 'Desktops',
      image: '/src/assets/products/laptop.jpg',
      description: 'Powerful desktop computers for all needs'
    },
    {
      name: 'Monitors',
      image: '/src/assets/products/monitor.jpg',
      description: 'Crystal clear displays for productivity'
    },
    {
      name: 'Components',
      image: '/src/assets/products/processer.jpg',
      description: 'Latest computer parts and components'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative gradient-bg text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Empowering Your
                <span className="block text-yellow-300">Digital World</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Discover the latest in computer technology with our premium selection 
                of laptops, desktops, and accessories. Quality guaranteed, prices unmatched.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-secondary-50 transition-colors duration-200 group"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative animate-slide-up">
              <img
                src="/src/assets/products/laptop.jpg"
                alt="Latest Technology"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-secondary-900">4.9/5 Rating</p>
                    <p className="text-sm text-secondary-600">From 10,000+ customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Why Choose Techno Computers?
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              We're committed to providing the best technology solutions with exceptional service
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300 group"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                  <feature.icon className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-secondary-600">
              Find exactly what you're looking for in our specialized categories
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category.name}`}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-secondary-600">
                Discover our handpicked selection of premium products
              </p>
            </div>
            <Link
              to="/products"
              className="hidden md:inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-secondary-200 h-48 rounded-t-xl"></div>
                  <div className="bg-white p-4 rounded-b-xl border border-secondary-200">
                    <div className="h-4 bg-secondary-200 rounded mb-2"></div>
                    <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-secondary-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Product key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12 md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center btn-primary"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-blue-100">
              Join our growing community of satisfied customers
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Upgrade Your Tech?
          </h2>
          <p className="text-lg text-secondary-300 mb-8">
            Explore our extensive collection of computers, laptops, and accessories. 
            Find the perfect technology solution for your needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 group"
            >
              Browse Products
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-secondary-600 text-secondary-300 hover:border-white hover:text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;