import React from 'react';
import { 
  Users, 
  Award, 
  Target, 
  Heart,
  Shield,
  Truck,
  Headphones,
  Star
} from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Shield,
      title: 'Quality First',
      description: 'We never compromise on quality. Every product is carefully selected and tested to meet our high standards.'
    },
    {
      icon: Heart,
      title: 'Customer Focused',
      description: 'Our customers are at the heart of everything we do. We strive to exceed expectations in every interaction.'
    },
    {
      icon: Award,
      title: 'Innovation',
      description: 'We stay ahead of technology trends to bring you the latest and most innovative products in the market.'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our knowledgeable team provides expert advice and support to help you make the right technology choices.'
    }
  ];

  const team = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      image: '/src/assets/Profile-image.jpg',
      description: 'With over 15 years in the tech industry, John leads our vision of making technology accessible to everyone.'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      image: '/src/assets/Profile-image.jpg',
      description: 'Sarah oversees our technical operations and ensures we stay at the forefront of technology trends.'
    },
    {
      name: 'Mike Chen',
      role: 'Head of Sales',
      image: '/src/assets/Profile-image.jpg',
      description: 'Mike leads our sales team with a focus on building lasting relationships with our customers.'
    },
    {
      name: 'Emily Davis',
      role: 'Customer Success Manager',
      image: '/src/assets/Profile-image.jpg',
      description: 'Emily ensures every customer has an exceptional experience from purchase to support.'
    }
  ];

  const milestones = [
    { year: '2015', title: 'Company Founded', description: 'Started as a small computer repair shop' },
    { year: '2017', title: 'Online Store Launch', description: 'Expanded to e-commerce platform' },
    { year: '2019', title: '10,000 Customers', description: 'Reached our first major milestone' },
    { year: '2021', title: 'Award Winner', description: 'Best Computer Retailer of the Year' },
    { year: '2023', title: 'National Expansion', description: 'Serving customers nationwide' },
    { year: '2024', title: 'Innovation Hub', description: 'Launched tech innovation center' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative gradient-bg text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in">
              About Techno Computers
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Empowering individuals and businesses with cutting-edge technology solutions 
              since 2015. Your trusted partner in the digital world.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-primary-600 mr-3" />
                  <h2 className="text-3xl font-bold text-secondary-900">Our Mission</h2>
                </div>
                <p className="text-lg text-secondary-600 leading-relaxed">
                  To democratize access to technology by providing high-quality computer products 
                  and exceptional service at competitive prices. We believe everyone deserves 
                  access to the tools that can transform their personal and professional lives.
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <Star className="h-8 w-8 text-primary-600 mr-3" />
                  <h2 className="text-3xl font-bold text-secondary-900">Our Vision</h2>
                </div>
                <p className="text-lg text-secondary-600 leading-relaxed">
                  To be the leading technology retailer that bridges the gap between innovation 
                  and accessibility, creating a world where advanced technology empowers every 
                  individual and organization to achieve their full potential.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="/src/assets/products/laptop.jpg"
                alt="Our Mission"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary-600 text-white p-6 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold">9+</div>
                  <div className="text-sm">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape our commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 text-center group"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                  <value.icon className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-secondary-600">
              Key milestones that shaped our growth and success
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-primary-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-200 hover:shadow-lg transition-shadow duration-300">
                      <div className="text-2xl font-bold text-primary-600 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-secondary-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-secondary-600">
              The passionate people behind Techno Computers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-secondary-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-lg text-blue-100">
              Achievements that reflect our commitment to excellence
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Products Sold</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">4.9</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">99%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
            Ready to Experience the Difference?
          </h2>
          <p className="text-lg text-secondary-600 mb-8">
            Join thousands of satisfied customers who trust Techno Computers 
            for their technology needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;