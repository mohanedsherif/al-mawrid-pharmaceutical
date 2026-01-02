import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateQuantity, removeItem } from '../../store/cartSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/currency';

const CartPage = () => {
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Shipping: Free for orders over 1500 EGP, otherwise 180 EGP
  const shipping = subtotal > 1500 ? 0 : 180;
  const tax = subtotal * 0.14; // 14% VAT in Egypt
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeItem(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-main py-12">
        <Card className="p-12 text-center">
          <svg className="w-24 h-24 text-slate-300 dark:text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8m0 0L21 4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-heading font-bold mb-2">Your cart is empty</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Start adding products to see them here</p>
          <Link to="/products">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <h1 className="text-4xl font-heading font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.productId} className="p-6">
              <div className="flex gap-4">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{formatCurrency(item.price)} each</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 border border-slate-300 dark:border-slate-700 rounded-xl">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 min-w-[3rem] text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-lg">{formatCurrency(item.price * item.quantity)}</p>
                      <button
                        onClick={() => dispatch(removeItem(item.productId))}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        aria-label="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-heading font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tax (VAT 14%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              {subtotal < 1500 && (
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  Add {formatCurrency(1500 - subtotal)} more for free shipping!
                </p>
              )}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Link to="/checkout" className="block">
              <Button variant="primary" size="lg" className="w-full mb-4">
                Proceed to Checkout
              </Button>
            </Link>
            
            <Link to="/products">
              <Button variant="ghost" size="md" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

