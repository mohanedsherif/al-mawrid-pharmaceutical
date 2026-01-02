import { useEffect, useState } from 'react';
import { fetchProducts, type Product } from '../../api/productApi';
import { createProduct, updateProduct, deleteProduct } from '../../api/adminApi';
import { fetchCategories, type Category } from '../../api/categoryApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import { useForm } from 'react-hook-form';
import { formatCurrency } from '../../utils/currency';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  discount: number;
  stockQuantity: number;
  brand: string;
  categoryId: number;
}

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStock, setFilterStock] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>();

  useEffect(() => {
    fetchProductsData();
    fetchCategoriesData();
  }, []);

  const fetchProductsData = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesData = async () => {
    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setError(null);
    const defaultCategoryId = categories.length > 0 ? categories[0].id : undefined;
    reset({
      name: '',
      description: '',
      price: 0,
      discount: 0,
      stockQuantity: 0,
      brand: '',
      categoryId: defaultCategoryId as number,
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      description: product.description || '',
      price: product.price,
      discount: product.discount || 0,
      stockQuantity: product.stockQuantity || 0,
      brand: product.brand || '',
      categoryId: product.categoryId,
    });
    setShowModal(true);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setError(null);
      
      // Validate required fields
      if (!data.name || !data.name.trim()) {
        setError('Product name is required');
        return;
      }
      
      if (!data.categoryId || data.categoryId <= 0) {
        setError('Please select a valid category');
        return;
      }
      
      if (!data.price || data.price <= 0) {
        setError('Price must be greater than 0');
        return;
      }

      // Prepare payload matching backend format
      // Backend expects BigDecimal for price/discount, which Spring converts from numbers
      const payload = {
        name: data.name.trim(),
        description: data.description?.trim() || '',
        price: parseFloat(data.price.toString()),
        discount: data.discount ? parseFloat(data.discount.toString()) : 0,
        stockQuantity: parseInt(data.stockQuantity.toString()) || 0,
        brand: data.brand?.trim() || '',
        categoryId: parseInt(data.categoryId.toString()),
        images: [] as string[],
      };

      console.log('Sending payload:', payload);

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      await fetchProductsData();
      setShowModal(false);
      setEditingProduct(null);
      reset();
    } catch (error: any) {
      console.error('Failed to save product:', error);
      console.error('Error response:', error?.response?.data);
      
      let errorMessage = 'Failed to save product. Please check all required fields.';
      
      if (error?.response?.status === 400) {
        // Handle validation errors
        const errorData = error.response.data;
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.errors && Array.isArray(errorData.errors)) {
          // Spring validation errors
          const validationErrors = errorData.errors.map((e: any) => 
            e.defaultMessage || e.message || `${e.field}: ${e.rejectedValue}`
          ).join(', ');
          errorMessage = `Validation errors: ${validationErrors}`;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        } else {
          // Try to extract any error message from the response
          errorMessage = JSON.stringify(errorData) || 'Invalid request data. Please check all fields.';
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProduct(deletingProduct.id);
      await fetchProductsData();
      setDeletingProduct(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };


  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStock = 
      filterStock === 'all' ||
      (filterStock === 'in-stock' && (product.stockQuantity || 0) > 10) ||
      (filterStock === 'low-stock' && (product.stockQuantity || 0) > 0 && (product.stockQuantity || 0) <= 10) ||
      (filterStock === 'out-of-stock' && (product.stockQuantity || 0) === 0);
    
    return matchesSearch && matchesStock;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Product Management</h1>
          <p className="text-slate-600 dark:text-slate-400">Create, update, or remove products</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          + Add New Product
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search products by name, description, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value as typeof filterStock)}
              className="input"
            >
              <option value="all">All Stock</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-6">
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg mb-4 flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold">{formatCurrency(product.price)}</span>
                {product.stockQuantity !== undefined && (
                  <span className={`text-sm px-2 py-1 rounded ${
                    product.stockQuantity > 10
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    Stock: {product.stockQuantity}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => openEditModal(product)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700 dark:text-red-400"
                  onClick={() => setDeletingProduct(product)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {searchTerm || filterStock !== 'all' 
              ? 'No products match your search criteria' 
              : 'No products found'}
          </p>
          {(!searchTerm && filterStock === 'all') && (
            <Button variant="primary" onClick={openCreateModal}>
              Create First Product
            </Button>
          )}
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? 'Edit Product' : 'Create Product'}
        size="lg"
        footer={
          <>
            <Button 
              variant="ghost" 
              onClick={() => {
                setShowModal(false);
                setEditingProduct(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit(onSubmit)} 
              isLoading={isSubmitting}
              type="button"
            >
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}
          <Input
            label="Product Name"
            {...register('name', { required: 'Product name is required' })}
            error={errors.name?.message}
          />
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              {...register('description')}
              className="input"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              step="0.01"
              {...register('price', { required: 'Price is required', min: 0 })}
              error={errors.price?.message}
            />
            <Input
              label="Discount (%)"
              type="number"
              step="0.01"
              {...register('discount', { min: 0, max: 100 })}
              error={errors.discount?.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Stock Quantity"
              type="number"
              {...register('stockQuantity', { required: 'Stock quantity is required', min: 0 })}
              error={errors.stockQuantity?.message}
            />
            <Input
              label="Brand"
              {...register('brand')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[#2C3E50] dark:text-[#E6EEF6]">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register('categoryId', { required: 'Category is required' })}
              className="input w-full"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
            )}
            {categories.length === 0 && (
              <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-1">
                No categories available. Please create a category first.
              </p>
            )}
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        title="Delete Product"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeletingProduct(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </>
        }
      >
        {deletingProduct && (
          <p className="text-slate-600 dark:text-slate-400">
            Are you sure you want to delete <strong>{deletingProduct.name}</strong>? This action cannot be undone.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default AdminProductsPage;
