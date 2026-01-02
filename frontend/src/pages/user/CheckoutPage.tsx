import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { clearCart } from '../../store/cartSlice';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { formatCurrency } from '../../utils/currency';

const CheckoutPage = () => {
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Egypt',
    shippingMethod: 'standard',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Shipping costs in EGP: Standard 180, Priority 300, Express 480, Free over 1500 EGP
  const shipping = subtotal > 1500 ? 0 : formData.shippingMethod === 'express' ? 480 : formData.shippingMethod === 'priority' ? 300 : 180;
  const tax = subtotal * 0.14; // 14% VAT in Egypt
  const total = subtotal + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with payment API (Stripe)
    alert('Order placed successfully! (Payment integration pending)');
    dispatch(clearCart());
    navigate('/orders');
  };

  if (items.length === 0) {
    return (
      <div className="container-main py-12">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-heading font-bold mb-2">Your cart is empty</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Add items to your cart to checkout</p>
          <Button variant="primary" onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-main py-8">
      <h1 className="text-4xl font-heading font-bold mb-8">Checkout</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="p-6">
              <h2 className="text-xl font-heading font-bold mb-6">Shipping Address</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="md:col-span-2"
                />
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
                <Input
                  label="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  required
                />
                <Input
                  label="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                />
              </div>
            </Card>

            {/* Shipping Method */}
            <Card className="p-6">
              <h2 className="text-xl font-heading font-bold mb-6">Shipping Method</h2>
              <div className="space-y-3">
                {[
                  { value: 'standard', label: 'Standard Shipping', price: subtotal > 1500 ? 'Free' : formatCurrency(180), days: '5-7 business days' },
                  { value: 'priority', label: 'Priority Shipping', price: subtotal > 1500 ? 'Free' : formatCurrency(300), days: '3-5 business days' },
                  { value: 'express', label: 'Express Shipping', price: subtotal > 1500 ? 'Free' : formatCurrency(480), days: '1-2 business days' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                      formData.shippingMethod === method.value
                        ? 'border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value={method.value}
                        checked={formData.shippingMethod === method.value}
                        onChange={(e) => setFormData({ ...formData, shippingMethod: e.target.value })}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <p className="font-semibold">{method.label}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{method.days}</p>
                      </div>
                    </div>
                    <span className="font-semibold">{method.price}</span>
                  </label>
                ))}
              </div>
            </Card>

            {/* Payment */}
            <Card className="p-6">
              <h2 className="text-xl font-heading font-bold mb-6">Payment Information</h2>
              <div className="space-y-4">
                <Input
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  maxLength={19}
                  required
                />
                <Input
                  label="Cardholder Name"
                  placeholder="John Doe"
                  value={formData.cardName}
                  onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    maxLength={5}
                    required
                  />
                  <Input
                    label="CVV"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    maxLength={3}
                    required
                  />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-heading font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2 mb-6">
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
                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                Place Order
              </Button>
              
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;

