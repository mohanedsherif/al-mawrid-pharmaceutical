import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import type { TopProduct } from '../../api/adminApi';
import { formatCurrency } from '../../utils/currency';

interface ProductInsightsTableProps {
  products: TopProduct[];
  loading?: boolean;
}

type SortField = 'name' | 'sales' | 'revenue';
type SortDirection = 'asc' | 'desc';

const ProductInsightsTable = ({ products, loading = false }: ProductInsightsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const getStatusColor = (stock: number) => {
    if (stock === 0) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    if (stock < 10) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      switch (sortField) {
        case 'name':
          aVal = a.productName;
          bVal = b.productName;
          break;
        case 'sales':
          aVal = a.totalSales;
          bVal = b.totalSales;
          break;
        case 'revenue':
          aVal = a.totalRevenue;
          bVal = b.totalRevenue;
          break;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc' 
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return filtered;
  }, [products, searchTerm, sortField, sortDirection]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSorted.slice(start, start + itemsPerPage);
  }, [filteredAndSorted, currentPage]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-[#2C3E50] dark:text-[#E6EEF6]">Product Insights</h2>
        <Link to="/admin/products">
          <Button variant="ghost" size="sm">Manage Products</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-md"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#B8C5D6]/50 dark:border-primary-700/30">
              <th 
                className="text-left py-3 px-4 text-sm font-semibold text-[#2C3E50] dark:text-[#E6EEF6] cursor-pointer hover:bg-[#ECF0F3] dark:hover:bg-[#16283D] transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Product Name
                  <SortIcon field="name" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 text-sm font-semibold text-[#2C3E50] dark:text-[#E6EEF6] cursor-pointer hover:bg-[#ECF0F3] dark:hover:bg-[#16283D] transition-colors"
                onClick={() => handleSort('sales')}
              >
                <div className="flex items-center gap-2">
                  Units Sold
                  <SortIcon field="sales" />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 text-sm font-semibold text-[#2C3E50] dark:text-[#E6EEF6] cursor-pointer hover:bg-[#ECF0F3] dark:hover:bg-[#16283D] transition-colors"
                onClick={() => handleSort('revenue')}
              >
                <div className="flex items-center gap-2">
                  Revenue Generated
                  <SortIcon field="revenue" />
                </div>
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#2C3E50] dark:text-[#E6EEF6]">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <tr 
                  key={product.productId} 
                  className="border-b border-[#B8C5D6]/30 dark:border-primary-700/20 hover:bg-[#ECF0F3] dark:hover:bg-[#16283D] transition-colors"
                >
                  <td className="py-4 px-4">
                    <Link 
                      to={`/admin/products`}
                      className="font-medium text-[#2C3E50] dark:text-[#E6EEF6] hover:text-cta-600 dark:hover:text-cta-400 transition-colors"
                    >
                      {product.productName}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-[#2C3E50] dark:text-[#E6EEF6]">
                    {product.totalSales.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-[#2C3E50] dark:text-[#E6EEF6] font-semibold">
                    {formatCurrency(product.totalRevenue)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusColor(product.totalSales > 0 ? 50 : 0)}`}>
                      {product.totalSales > 0 ? 'Active' : 'No Sales'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#2C3E50] dark:text-[#E6EEF6] opacity-60">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#B8C5D6]/50 dark:border-primary-700/30">
          <p className="text-sm text-[#2C3E50] dark:text-[#E6EEF6] opacity-80">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredAndSorted.length)} of {filteredAndSorted.length} products
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProductInsightsTable;

