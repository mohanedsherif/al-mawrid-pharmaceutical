import { Link } from 'react-router-dom';
import Button from './Button';
import Card from './Card';
import LazyImage from './LazyImage';
import { formatCurrency } from '../../utils/currency';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  discount?: number;
  image?: string;
  rating?: number;
  stockQuantity?: number;
  onAddToCart?: () => void;
}

const ProductCard = ({
  id,
  name,
  price,
  discount = 0,
  image,
  rating = 0,
  stockQuantity = 0,
  onAddToCart,
}: ProductCardProps) => {
  const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;
  const inStock = stockQuantity > 0;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
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
          <svg key={i} className="w-4 h-4 text-slate-300 dark:text-slate-600 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-slate-600 dark:text-slate-400">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Card hover className="overflow-hidden group relative">
      <Link to={`/products/${id}`} className="block">
        <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
          <LazyImage
            src={image}
            alt={name}
            className="w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
            placeholder={
              <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            }
          />
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-br from-red-500 to-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-200">
              -{discount}%
            </div>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-slate-800 dark:bg-slate-900 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
          {/* Quick view overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      </Link>
      
      <div className="p-5">
        <Link to={`/products/${id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 group-hover:translate-x-1 transform">
            {name}
          </h3>
        </Link>
        
        {rating > 0 && (
          <div className="mb-3 transform group-hover:translate-x-0.5 transition-transform duration-200">
            {renderStars(rating)}
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(finalPrice)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                {formatCurrency(price)}
              </span>
            )}
          </div>
        </div>
        
        <Button
          variant="primary"
          size="sm"
          className="w-full group/btn relative overflow-hidden"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (inStock) {
              onAddToCart?.();
            }
          }}
          disabled={!inStock}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {inStock ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </>
            ) : (
              'Out of Stock'
            )}
          </span>
          {inStock && (
            <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-300" />
          )}
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;

