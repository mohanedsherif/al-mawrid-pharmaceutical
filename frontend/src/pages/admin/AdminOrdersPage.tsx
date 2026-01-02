import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus, type Order } from '../../api/adminApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Skeleton from '../../components/ui/Skeleton';
import Input from '../../components/ui/Input';
import { formatCurrency } from '../../utils/currency';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<Order['status']>('PENDING');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedOrder) return;
    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
      await fetchOrders();
      setShowStatusModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };


  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      PROCESSING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      SHIPPED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || 'bg-slate-100 text-slate-800';
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-bold mb-2">Order Management</h1>
        <p className="text-slate-600 dark:text-slate-400">View and manage customer orders</p>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Order['status'] | 'ALL')}
              className="input"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </Card>

      {loading ? (
        <Card className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#B8C5D6]/50 dark:border-primary-700/30">
                <th className="text-left py-3 px-4 font-semibold text-sm text-[#2C3E50] dark:text-[#E6EEF6]">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-[#2C3E50] dark:text-[#E6EEF6]">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-[#2C3E50] dark:text-[#E6EEF6]">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-[#2C3E50] dark:text-[#E6EEF6]">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-[#2C3E50] dark:text-[#E6EEF6]">Date</th>
                <th className="text-right py-3 px-4 font-semibold text-sm text-[#2C3E50] dark:text-[#E6EEF6]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="border-b border-[#B8C5D6]/30 dark:border-primary-700/20 hover:bg-[#ECF0F3] dark:hover:bg-[#16283D] transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-[#2C3E50] dark:text-[#E6EEF6]">#{order.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-[#2C3E50] dark:text-[#E6EEF6]">{order.userName}</p>
                      <p className="text-sm text-[#2C3E50] dark:text-[#E6EEF6] opacity-70">{order.userEmail}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#2C3E50] dark:text-[#E6EEF6]">{formatCurrency(order.totalAmount)}</td>
                  <td className="py-3 px-4 text-sm text-[#2C3E50] dark:text-[#E6EEF6] opacity-70">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Show order details modal (can be enhanced)
                          openStatusModal(order);
                        }}
                        className="text-xs"
                      >
                        View
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openStatusModal(order)}
                        className="text-xs"
                      >
                        Update
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              {searchTerm || statusFilter !== 'ALL' 
                ? 'No orders match your search criteria' 
                : 'No orders found'}
            </div>
          )}
        </Card>
      )}

      <Modal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedOrder(null);
        }}
        title="Update Order Status"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowStatusModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleStatusChange}>
              Update Status
            </Button>
          </>
        }
      >
        {selectedOrder && (
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-400">
              Update status for Order <strong>#{selectedOrder.id}</strong>
            </p>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as Order['status'])}
                className="input"
              >
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Order Items:</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm p-2 bg-slate-50 dark:bg-slate-800 rounded">
                      <span>{item.productName} x{item.quantity}</span>
                      <span className="font-medium">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;
