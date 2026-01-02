import { useEffect, useState, useMemo } from 'react';
import { fetchProducts } from '../../api/productApi';
import type { Product } from '../../api/productApi';
import ProductCard from '../../components/ui/ProductCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import AnimatedSection from '../../components/ui/AnimatedSection';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addItem } from '../../store/cartSlice';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

type SortOption = 'price-asc' | 'price-desc' | 'popularity' | 'newest' | 'rating';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
  });

  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  const categories = ['Protein', 'Vitamins', 'Creatine', 'Pre-Workout', 'Recovery', 'Wellness'];
  const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));

  const filteredAndSorted = useMemo(() => {
    let filtered = [...products];

    if (filters.category) {
      filtered = filtered.filter((p) =>
        p.categoryName?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.brand) {
      filtered = filtered.filter((p) => p.brand === filters.brand);
    }

    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(filters.maxPrice));
    }

    if (filters.minRating) {
      filtered = filtered.filter(
        (p) => (p.ratingAvg || 0) >= Number(filters.minRating)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.ratingAvg || 0) - (a.ratingAvg || 0));
        break;
      case 'popularity':
        filtered.sort((a, b) => (b.stockQuantity || 0) - (a.stockQuantity || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => b.id - a.id);
    }

    return filtered;
  }, [products, filters, sortBy]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedProducts = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddToCart = (product: Product) => {
    dispatch(
      addItem({
        productId: product.id,
        name: product.name,
        price: product.discount ? product.price * (1 - product.discount / 100) : product.price,
        quantity: 1,
        image: product.images?.[0],
      })
    );
    showToast(`${product.name} added to cart!`, 'success');
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="container-main py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-bold mb-2">All Products</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Clean, effective supplements for every phase of training
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:w-64 flex-shrink-0">
          <Card className="p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Filters</h2>
            
            <div className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              {brands.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Brand</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="input"
                  >
                    <option value="">All Brands</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="input"
                >
                  <option value="">Any</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  setFilters({
                    category: '',
                    brand: '',
                    minPrice: '',
                    maxPrice: '',
                    minRating: '',
                  });
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort and Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-600 dark:text-slate-400">
              Showing {paginatedProducts.length} of {filteredAndSorted.length} products
            </p>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="input w-auto"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="aspect-square bg-slate-200 dark:bg-slate-800 rounded mb-4 animate-pulse" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded mb-2 animate-pulse" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 animate-pulse" />
                </Card>
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product, index) => (
                  <AnimatedSection
                    key={product.id}
                    direction="up"
                    delay={index * 50}
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
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'primary' : 'ghost'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  })}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                No products found. Try adjusting your filters.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

