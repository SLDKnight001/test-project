import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Clock
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/src/assets/logo/Techno-logo.png" 
                alt="Techno Computers" 
                className="h-10 w-10"
              />
              <span className="text-xl font-bold">TECHNO COMPUTERS</span>
            </div>
            <p className="text-secondary-300 text-sm leading-relaxed">
              Your trusted partner for all computer and technology needs. 
              We provide high-quality products with exceptional customer service.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-secondary-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-secondary-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-secondary-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-secondary-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/products?category=Laptops" 
                  className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                >
                  Laptops
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=Desktops" 
                  className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                >
                  Desktops
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=Monitors" 
                  className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                >
                  Monitors
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=Components" 
                  className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                >
                  Components
                </Link>
              </li>
              <li>
                <Link 
                  to="/products?category=Accessories" 
                  className="text-secondary-300 hover:text-primary-400 transition-colors duration-200 text-sm"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-secondary-300 text-sm">
                    123 Technology Street<br />
                    Digital City, DC 12345
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <p className="text-secondary-300 text-sm">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400 flex-shrink-0" />
                <p className="text-secondary-300 text-sm">info@technocomputers.com</p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-secondary-300 text-sm">
                    Mon - Fri: 9:00 AM - 6:00 PM<br />
                    Sat: 10:00 AM - 4:00 PM<br />
                    Sun: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary-400 text-sm">
              © 2024 Techno Computers. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link 
                to="/privacy" 
                className="text-secondary-400 hover:text-primary-400 transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-secondary-400 hover:text-primary-400 transition-colors duration-200 text-sm"
              >
                Terms of Service
              </Link>
              <Link 
                to="/support" 
                className="text-secondary-400 hover:text-primary-400 transition-colors duration-200 text-sm"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;