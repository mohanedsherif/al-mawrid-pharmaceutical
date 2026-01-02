import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../../api/productApi';
import type { Product } from '../../api/productApi';
import ProductCard from '../../components/ui/ProductCard';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import AnimatedSection from '../../components/ui/AnimatedSection';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addItem } from '../../store/cartSlice';
import { useI18n } from '../../contexts/I18nContext';
import { useToast } from '../../contexts/ToastContext';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [backendError, setBackendError] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useI18n();
  const { showToast } = useToast();

  useEffect(() => {
    fetchProducts()
      .then((products) => {
        setFeaturedProducts(products.slice(0, 6));
        setBackendError(false);
      })
      .catch((error) => {
        setFeaturedProducts([]);
        // Check if it's a connection error
        if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
          setBackendError(true);
        }
      });
  }, []);

  const benefits = [
    {
      title: 'GMP Certified',
      description: 'Manufactured to highest pharmaceutical standards',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Scientific Excellence',
      description: 'Backed by research and clinical studies',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: 'Fast & Reliable',
      description: 'Timely delivery to healthcare facilities',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Regulatory Compliance',
      description: 'Full adherence to health authority standards',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const reviews = [
    {
      name: 'Dr. Sarah Ahmed',
      role: 'Hospital Pharmacist',
      rating: 5,
      text: 'Consistent quality and reliable supply chain. AL-MAWRID products meet all our hospital standards.',
      avatar: '👩‍⚕️',
    },
    {
      name: 'Dr. Mohammed Hassan',
      role: 'Clinical Pharmacist',
      rating: 5,
      text: 'Excellent pharmaceutical products with proper documentation. Trustworthy partner for our clinic.',
      avatar: '👨‍⚕️',
    },
    {
      name: 'Dr. Layla Mansour',
      role: 'Pharmacy Director',
      rating: 5,
      text: 'Outstanding service and product quality. Their commitment to scientific excellence is evident.',
      avatar: '👩‍🔬',
    },
  ];

  const handleAddToCart = (product: Product) => {
    dispatch(addItem({
      productId: product.id,
      name: product.name,
      price: product.discount ? product.price * (1 - product.discount / 100) : product.price,
      quantity: 1,
      image: product.images?.[0],
    }));
    showToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <div className="space-y-20 py-12 bg-white dark:bg-[#0F1E2E] min-h-screen">
      {/* Hero Section - AL-MAWRID Branded with Flow Animations */}
      <AnimatedSection direction="fade" delay={0}>
        <section className="container-main">
          <div 
            className="relative overflow-hidden rounded-3xl bg-gradient-flow text-white p-12 md:p-16 lg:p-20 shadow-2xl bg-[length:400%_400%] animate-flow-gradient"
            style={{ animation: 'fadeIn 0.8s ease-out, slideUp 0.8s ease-out' }}
          >
            {/* Animated gradient mesh background */}
            <div 
              className="absolute inset-0 bg-gradient-mesh z-0"
              style={{
                animation: 'flow-gradient 20s linear infinite',
              }}
            />
            
            {/* Gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-700/90 via-primary-600/80 to-secondary-600/90 z-0"></div>
            
            {/* Flowing wave elements */}
            <div 
              className="absolute top-0 right-0 w-[600px] h-[600px] bg-cta-400/20 rounded-full blur-3xl animate-pulse"
              style={{ 
                transform: 'translate(33%, -33%)',
                animation: 'floatWave1 8s ease-in-out infinite',
              }}
            />
            <div 
              className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-400/15 rounded-full blur-3xl"
              style={{ 
                transform: 'translate(-33%, 33%)',
                animation: 'floatWave2 10s ease-in-out infinite',
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-secondary-400/10 rounded-full blur-3xl"
              style={{ 
                transform: 'translate(-50%, -50%)',
                animation: 'pulseGlow 6s ease-in-out infinite',
              }}
            />
            
            <div className="relative z-10 max-w-3xl animate-fade-in">
              <p 
                className="uppercase tracking-wider text-sm font-semibold text-cta-200 mb-4 animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              >
                AL-MAWRID PHARMACEUTICALS
              </p>
              
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight animate-slide-up"
                style={{ animationDelay: '0.3s' }}
              >
                <span
                  className="block"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #ffffff, #4ECDC4, #ffffff)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'shimmerText 5s linear infinite',
                  }}
                >
                  The Eternal Flow
                </span>
                <span 
                  className="block text-cta-300 mt-2 animate-fade-in"
                  style={{ animationDelay: '0.5s' }}
                >
                  From Research to Healing
                </span>
              </h1>
              
              <p 
                className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed opacity-95 max-w-2xl animate-fade-in"
                style={{ animationDelay: '0.7s' }}
              >
                Trusted pharmaceutical supplier committed to Flow, Continuity, Purity, and Scientific Depth. 
                Delivering excellence in pharmaceutical solutions for healthcare professionals.
              </p>
              
              <div 
                className="flex flex-col sm:flex-row gap-4 animate-fade-in"
                style={{ animationDelay: '0.9s' }}
              >
                <Link to="/products">
                  <Button 
                    variant="accent" 
                    size="lg" 
                    className="w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-white/30 water-ripple"
                  >
                    Explore Products
                  </Button>
                </Link>
                <Link to="/about">
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm water-ripple"
                  >
                    {t('home.aboutUs')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Featured Products */}
      <AnimatedSection direction="up" delay={200}>
        <section className="container-main">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-primary-600 via-secondary-500 to-cta-500 dark:from-primary-400 dark:via-secondary-400 dark:to-cta-400 bg-clip-text text-transparent">
                Featured Products
              </h2>
              <p className="text-[#2C3E50] dark:text-[#E6EEF6] text-lg">Trusted pharmaceutical solutions</p>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="group">
                View All 
                <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product, index) => (
                <AnimatedSection
                  key={product.id}
                  direction="up"
                  delay={300 + index * 100}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    discount={product.discount}
                    image={product.images?.[0]}
                    rating={product.ratingAvg}
                    stockQuantity={product.stockQuantity}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                </AnimatedSection>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                {backendError ? (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 max-w-md mx-auto">
                    <p className="text-yellow-800 dark:text-yellow-300 font-semibold mb-2">Backend Server Not Running</p>
                    <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                      Please start the backend server to view products. Run: <code className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded">cd backend && mvn spring-boot:run</code>
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400">Loading featured products...</p>
                )}
              </div>
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* Benefits Section */}
      <AnimatedSection direction="up" delay={100}>
        <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950 py-20">
          <div className="container-main">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-primary-600 via-secondary-500 to-cta-500 dark:from-primary-400 dark:via-secondary-400 dark:to-cta-400 bg-clip-text text-transparent">
                Why Choose AL-MAWRID
              </h2>
              <p className="text-[#2C3E50] dark:text-[#E6EEF6] text-lg">Flow, Continuity, Purity, and Scientific Depth</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <AnimatedSection
                  key={benefit.title}
                  direction="up"
                  delay={200 + index * 100}
                >
                  <Card 
                    hover
                    className="p-6 text-center transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="text-cta-500 dark:text-cta-400 mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                      {benefit.icon}
                    </div>
                    <h3 className="font-semibold text-xl mb-2 text-[#2C3E50] dark:text-[#E6EEF6] group-hover:text-cta-600 dark:group-hover:text-cta-400 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-[#2C3E50]/70 dark:text-[#E6EEF6]/70">{benefit.description}</p>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Reviews Section */}
      <AnimatedSection direction="up" delay={100}>
        <section className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-primary-600 via-secondary-500 to-cta-500 dark:from-primary-400 dark:via-secondary-400 dark:to-cta-400 bg-clip-text text-transparent">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-[#2C3E50] dark:text-[#E6EEF6] text-lg">What our partners say about AL-MAWRID</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <AnimatedSection
                key={idx}
                direction="up"
                delay={200 + idx * 100}
              >
                <Card 
                  hover
                  className="p-6 transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current transform hover:scale-125 transition-transform duration-200" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[#2C3E50] dark:text-[#E6EEF6] mb-4 italic leading-relaxed">"{review.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-[#B8C5D6]/50 dark:border-primary-700/30">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cta-100 to-accent-100 dark:from-cta-900/30 dark:to-accent-800/30 flex items-center justify-center text-2xl shadow-md">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-[#2C3E50] dark:text-[#E6EEF6]">{review.name}</p>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">{review.role}</p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Newsletter Section */}
      <AnimatedSection direction="up" delay={100}>
        <section className="container-main">
          <Card className="p-8 md:p-12 bg-gradient-flow text-white bg-[length:400%_400%] animate-flow-gradient relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/95 via-secondary-600/90 to-accent-600/95"></div>
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Stay Connected with AL-MAWRID
              </h2>
              <p className="text-white/90 mb-6 text-lg">
                Receive updates on new products, regulatory changes, and pharmaceutical industry insights.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-cta-300 backdrop-blur-sm"
                />
                <Button variant="accent" size="md" type="submit" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30">
                  Subscribe
                </Button>
              </form>
            </div>
          </Card>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default HomePage;

