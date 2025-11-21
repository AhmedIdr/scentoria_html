import React, { useState } from 'react';
import { useCartStore } from '../store';
import { useToastStore } from '../components/Toast';
import { Button, SectionTitle } from '../components/UI';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GeneratedImage } from '../components/GeneratedImage';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
}

const CartCheckout: React.FC = () => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const { addToast } = useToastStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    phone: '',
    notes: '',
    shippingMethod: 'standard'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState('');

  const shippingOptions = {
    standard: { label: 'Standard Delivery', price: 30, days: '2-4 business days' },
    express: { label: 'Express Delivery', price: 60, days: '1-2 business days' },
    pickup: { label: 'Store Pickup', price: 0, days: 'Same day in Casablanca' }
  };

  // Sample promo codes - in production, these would come from an API
  const promoCodes = {
    'WELCOME10': { discount: 10, type: 'percentage' as const },
    'FIRST50': { discount: 50, type: 'fixed' as const },
    'SUMMER15': { discount: 15, type: 'percentage' as const }
  };

  const shippingCost = shippingOptions[formData.shippingMethod as keyof typeof shippingOptions].price;
  const subtotal = getTotalPrice();
  const discountAmount = appliedPromo
    ? promoCodes[appliedPromo.code as keyof typeof promoCodes].type === 'percentage'
      ? Math.round(subtotal * (promoCodes[appliedPromo.code as keyof typeof promoCodes].discount / 100))
      : promoCodes[appliedPromo.code as keyof typeof promoCodes].discount
    : 0;
  const totalWithShipping = subtotal - discountAmount + shippingCost;

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return undefined;

      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email';
        return undefined;

      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        // Moroccan phone format: 06/07 XX XX XX XX
        const phoneRegex = /^(06|07)[0-9]{8}$/;
        const cleanPhone = value.replace(/\s/g, '');
        if (!phoneRegex.test(cleanPhone)) return 'Phone must be 10 digits starting with 06 or 07';
        return undefined;

      case 'city':
        if (!value.trim()) return 'City is required';
        if (value.trim().length < 2) return 'City must be at least 2 characters';
        return undefined;

      default:
        return undefined;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate on change if field was already touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleApplyPromo = () => {
    const upperCode = promoCode.trim().toUpperCase();

    if (!upperCode) {
      setPromoError('Please enter a promo code');
      return;
    }

    if (upperCode in promoCodes) {
      const promo = promoCodes[upperCode as keyof typeof promoCodes];
      setAppliedPromo({ code: upperCode, discount: promo.discount });
      setPromoError('');
      addToast(`Promo code applied! ${promo.type === 'percentage' ? `${promo.discount}%` : `${promo.discount} MAD`} off`, 'success');
    } else {
      setPromoError('Invalid promo code');
      setAppliedPromo(null);
      addToast('Invalid promo code', 'error');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
    addToast('Promo code removed', 'success');
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      city: validateField('city', formData.city)
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, city: true });

    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast('Please fix the errors in the form', 'error');
      return;
    }

    const itemsList = items.map(item =>
      `- ${item.quantity}x ${item.name} (${item.size}) - ${item.price * item.quantity} MAD`
    ).join('\n');

    const selectedShipping = shippingOptions[formData.shippingMethod as keyof typeof shippingOptions];

    const discountLine = appliedPromo ? `%0ADiscount (${appliedPromo.code}): -${discountAmount} MAD` : '';
    const message = `Hi Scentoria 🌿%0A%0AI'd like to order:%0A${itemsList}%0A%0ASubtotal: ${subtotal} MAD${discountLine}%0AShipping (${selectedShipping.label}): ${shippingCost} MAD%0ATotal: ${totalWithShipping} MAD%0A%0A---%0ADetails:%0AName: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0ACity: ${formData.city}%0AShipping: ${selectedShipping.label} (${selectedShipping.days})%0ANotes: ${formData.notes || 'None'}`;

    // Replace with actual number
    const phoneNumber = "212600000000";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    addToast('Opening WhatsApp...', 'success');
  };

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-20 min-h-screen flex flex-col items-center justify-center px-6">
        <h2 className="text-3xl font-serif text-midnight mb-4">Your cart is empty</h2>
        <p className="text-cedar/60 mb-8">Looks like you haven't added any rituals yet.</p>
        <Link to="/shop">
          <Button>Browse Collection</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <SectionTitle title="Checkout" subtitle="Finalize Order" center={false} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-sm shadow-sm border border-cedar/5">
            <h3 className="font-serif text-xl mb-6 text-midnight">Order Summary</h3>
            <div className="space-y-6">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 items-center border-b border-sand pb-6 last:border-0 last:pb-0">
                  <div className="w-24 h-24 shrink-0 overflow-hidden rounded-sm">
                    <GeneratedImage 
                      prompt={item.imagePrompt} 
                      alt={item.name} 
                      aspectRatio="3:4"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-serif text-lg text-midnight">{item.name}</h4>
                      <span className="font-medium">{item.price * item.quantity} MAD</span>
                    </div>
                    <p className="text-xs text-cedar/50 uppercase mb-4">{item.size}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border border-cedar/20 rounded bg-sand/20">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-cedar/10">-</button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-cedar/10">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-xs text-red-400 hover:text-red-600 underline">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-sm shadow-lg border-t-4 border-midnight sticky top-32">
            <h3 className="font-serif text-2xl mb-2 text-midnight">Complete Order</h3>
            <p className="text-sm text-cedar/60 mb-6">
              We finalize all orders via WhatsApp to ensure smooth delivery coordination in Morocco.
            </p>
            
            <form onSubmit={handleWhatsAppOrder} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xs uppercase font-bold text-cedar/70 mb-1">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('name')}
                  className={`w-full bg-sand/20 border p-3 rounded-sm focus:outline-none transition-colors ${
                    errors.name && touched.name
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-cedar/20 focus:border-cedar'
                  }`}
                  placeholder="e.g. Amina Benali"
                />
                {errors.name && touched.name && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs uppercase font-bold text-cedar/70 mb-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('email')}
                  className={`w-full bg-sand/20 border p-3 rounded-sm focus:outline-none transition-colors ${
                    errors.email && touched.email
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-cedar/20 focus:border-cedar'
                  }`}
                  placeholder="e.g. amina@example.com"
                />
                {errors.email && touched.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs uppercase font-bold text-cedar/70 mb-1">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full bg-sand/20 border p-3 rounded-sm focus:outline-none transition-colors ${
                    errors.phone && touched.phone
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-cedar/20 focus:border-cedar'
                  }`}
                  placeholder="e.g. 0600000000"
                />
                {errors.phone && touched.phone && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block text-xs uppercase font-bold text-cedar/70 mb-1">
                  City / Area *
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('city')}
                  className={`w-full bg-sand/20 border p-3 rounded-sm focus:outline-none transition-colors ${
                    errors.city && touched.city
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-cedar/20 focus:border-cedar'
                  }`}
                  placeholder="e.g. Casablanca, Maarif"
                />
                {errors.city && touched.city && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.city}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-cedar/70 mb-2">Shipping Method *</label>
                <div className="space-y-2">
                  {Object.entries(shippingOptions).map(([key, option]) => (
                    <label
                      key={key}
                      className={`flex items-center justify-between p-3 border rounded-sm cursor-pointer transition-all ${
                        formData.shippingMethod === key
                          ? 'border-cedar bg-cedar/5'
                          : 'border-cedar/20 hover:border-cedar/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={key}
                          checked={formData.shippingMethod === key}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-cedar focus:ring-cedar/20"
                        />
                        <div>
                          <p className="font-medium text-sm">{option.label}</p>
                          <p className="text-xs text-cedar/60">{option.days}</p>
                        </div>
                      </div>
                      <span className="font-bold text-sm">
                        {option.price === 0 ? 'Free' : `${option.price} MAD`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-xs uppercase font-bold text-cedar/70 mb-1">
                  Special Requests
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full bg-sand/20 border border-cedar/20 p-3 rounded-sm focus:outline-none focus:border-cedar transition-colors h-24 resize-none"
                  placeholder="e.g. It's a gift, please deliver after 6 PM..."
                />
              </div>

              <div className="border-t border-cedar/10 pt-4 mt-2">
                {/* Promo Code Field */}
                <div className="mb-4">
                  <label className="block text-xs uppercase font-bold text-cedar/70 mb-2">Promo Code</label>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-green-700 font-bold text-sm">{appliedPromo.code}</span>
                        <span className="text-green-600 text-xs">applied</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value.toUpperCase());
                          setPromoError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleApplyPromo();
                          }
                        }}
                        placeholder="Enter code"
                        className={`flex-1 bg-sand/20 border p-2 rounded-sm text-sm focus:outline-none transition-colors ${
                          promoError ? 'border-red-400' : 'border-cedar/20 focus:border-cedar'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-4 py-2 bg-midnight text-sand text-xs font-bold uppercase rounded-sm hover:bg-cedar transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {promoError && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {promoError}
                    </p>
                  )}
                </div>

                {/* Order Total */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm text-cedar">
                    <span>Subtotal</span>
                    <span>{subtotal} MAD</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-{discountAmount} MAD</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-cedar">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : `${shippingCost} MAD`}</span>
                  </div>
                  <div className="flex justify-between text-xl font-serif font-bold text-midnight border-t border-cedar/10 pt-2">
                    <span>Total</span>
                    <span>{totalWithShipping} MAD</span>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-none">
                <MessageCircle size={18} />
                Send Order to WhatsApp
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCheckout;