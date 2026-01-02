import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProduct } from '../../api/productApi';
import type { Product } from '../../api/productApi';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LazyImage from '../../components/ui/LazyImage';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addItem } from '../../store/cartSlice';
import Skeleton from '../../components/ui/Skeleton';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/currency';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchProduct(Number(id))
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch(() => {
          setProduct(null);
          setLoading(false);
        });
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        price: product.discount ? product.price * (1 - product.discount / 100) : product.price,
        quantity,
        image: product.images?.[0],
      })
    );
    showToast(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to cart!`, 'success');
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-slate-300 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        <span className="ml-2 text-slate-600 dark:text-slate-400">({rating.toFixed(1)})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-main py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-main py-8">
        <Card className="p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-lg">Product not found</p>
        </Card>
      </div>
    );
  }

  const finalPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
  const inStock = (product.stockQuantity || 0) > 0;

  return (
    <div className="container-main py-8">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
            <LazyImage
              src={product.images?.[selectedImage]}
              alt={product.name}
              className="w-full h-full"
              placeholder={
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              }
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? 'border-primary-600 dark:border-primary-400'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <LazyImage
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {product.brand && (
            <p className="text-sm uppercase tracking-wider text-primary-600 dark:text-primary-400 font-semibold">
              {product.brand}
            </p>
          )}
          
          <div>
            <h1 className="text-4xl font-heading font-bold mb-4">{product.name}</h1>
            {product.ratingAvg && product.ratingAvg > 0 && (
              <div className="mb-4">{renderStars(product.ratingAvg)}</div>
            )}
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(finalPrice)}
            </span>
            {product.discount && product.discount > 0 && (
              <>
                <span className="text-2xl text-slate-500 line-through">{formatCurrency(product.price)}</span>
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md font-semibold text-sm">
                  -{product.discount}% OFF
                </span>
              </>
            )}
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Stock Status */}
          <div>
            {inStock ? (
              <p className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                In Stock ({product.stockQuantity} available)
              </p>
            ) : (
              <p className="text-red-600 dark:text-red-400 font-medium">Out of Stock</p>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <label className="font-medium">Quantity:</label>
            <div className="flex items-center gap-2 border border-slate-300 dark:border-slate-700 rounded-xl">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 1, q + 1))}
                className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                disabled={quantity >= (product.stockQuantity || 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="primary"
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button variant="accent" size="lg" className="flex-1" disabled={!inStock}>
              Buy Now
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="text-center">
              <svg className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-medium">Certified</p>
            </div>
            <div className="text-center">
              <svg className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-sm font-medium">Fast Shipping</p>
            </div>
            <div className="text-center">
              <svg className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-sm font-medium">Secure</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Facts / Additional Info */}
      <Card className="mt-12 p-8">
        <h2 className="text-2xl font-heading font-bold mb-6">Product Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Category</h3>
            <p className="text-slate-600 dark:text-slate-400">{product.categoryName || 'N/A'}</p>
          </div>
          {product.brand && (
            <div>
              <h3 className="font-semibold mb-2">Brand</h3>
              <p className="text-slate-600 dark:text-slate-400">{product.brand}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailsPage;

