const OrdersPage = () => {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Your orders</h1>
      <p className="text-slate-600 dark:text-slate-400">Track shipping, delivery, and order history.</p>
      <div className="rounded-lg border border-slate-200/70 dark:border-slate-800 p-4 text-sm text-slate-500">
        No orders yet.
      </div>
    </div>
  );
};

export default OrdersPage;



