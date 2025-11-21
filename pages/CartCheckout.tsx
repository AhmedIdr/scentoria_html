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
      <SectionTitle title="Checkout" subtitle="Finalize Your Order" center={false} />

      {/* WhatsApp Process Explanation */}
      <div className="bg-gold/10 border-l-4 border-gold p-6 mb-8 rounded-r-lg">
        <div className="flex items-start gap-4">
          <MessageCircle size={24} className="text-gold shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-midnight mb-2 flex items-center gap-2">
              Personalized Order Processing via WhatsApp
            </h4>
            <p className="text-cedar text-sm leading-relaxed">
              Complete the form below, and we'll open WhatsApp with your order details pre-filled. This allows us to confirm your selection, coordinate delivery timing, and answer any questions for smooth service across Morocco.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-gradient-to-br from-white to-sand/20 p-8 rounded-xl shadow-xl border-2 border-cedar/10">
            <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-cedar/20">
              <h3 className="font-serif text-2xl text-midnight">Order Summary</h3>
              <span className="text-sm text-cedar/60">{items.length} item{items.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-5">
              {items.map(item => (
                <div key={item.id} className="flex gap-5 items-center bg-white/60 backdrop-blur-sm p-5 rounded-lg border border-cedar/20 hover:shadow-lg transition-all duration-300">
                  <div className="w-28 h-28 shrink-0 overflow-hidden rounded-lg shadow-md bg-sand/20">
                    <GeneratedImage
                      prompt={item.imagePrompt}
                      alt={item.name}
                      aspectRatio="3:4"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-serif text-xl text-midnight leading-tight">{item.name}</h4>
                      <span className="font-bold text-midnight text-lg ml-3">{item.price * item.quantity} <span className="text-sm font-normal text-cedar/70">MAD</span></span>
                    </div>
                    <p className="text-xs text-cedar/60 uppercase tracking-wider mb-4">{item.size}</p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center border-2 border-cedar/30 rounded-lg overflow-hidden shadow-sm bg-white">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-4 py-2 hover:bg-cedar/20 transition-colors font-medium">−</button>
                        <span className="px-4 py-2 text-sm font-semibold border-x-2 border-cedar/20">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-4 py-2 hover:bg-cedar/20 transition-colors font-medium">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-xs text-cedar/50 hover:text-red-600 font-medium underline">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-midnight to-midnight/95 p-8 rounded-xl shadow-2xl sticky top-32 border border-gold/20">
            <div className="mb-6 pb-6 border-b border-gold/20">
              <h3 className="font-serif text-3xl mb-2 text-sand italic">Complete Order</h3>
              <p className="text-sm text-sand/60 leading-relaxed">
                We finalize all orders via WhatsApp to ensure smooth delivery coordination in Morocco.
              </p>
            </div>
            
            <form onSubmit={handleWhatsAppOrder} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-xs uppercase font-bold text-gold/90 mb-2 tracking-wider">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('name')}
                  className={`w-full bg-white/10 backdrop-blur-sm border-2 p-4 rounded-lg focus:outline-none transition-all text-sand placeholder-sand/40 ${
                    errors.name && touched.name
                      ? 'border-red-400 focus:border-red-500 shadow-lg shadow-red-500/20'
                      : 'border-gold/20 focus:border-gold focus:shadow-lg focus:shadow-gold/20'
                  }`}
                  placeholder="e.g. Amina Benali"
                />
                {errors.name && touched.name && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1 bg-red-500/10 p-2 rounded">
                    <AlertCircle size={12} /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-xs uppercase font-bold text-gold/90 mb-2 tracking-wider">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('email')}
                  className={`w-full bg-white/10 backdrop-blur-sm border-2 p-4 rounded-lg focus:outline-none transition-all text-sand placeholder-sand/40 ${
                    errors.email && touched.email
                      ? 'border-red-400 focus:border-red-500 shadow-lg shadow-red-500/20'
                      : 'border-gold/20 focus:border-gold focus:shadow-lg focus:shadow-gold/20'
                  }`}
                  placeholder="e.g. amina@example.com"
                />
                {errors.email && touched.email && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1 bg-red-500/10 p-2 rounded">
                    <AlertCircle size={12} /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs uppercase font-bold text-gold/90 mb-2 tracking-wider">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full bg-white/10 backdrop-blur-sm border-2 p-4 rounded-lg focus:outline-none transition-all text-sand placeholder-sand/40 ${
                    errors.phone && touched.phone
                      ? 'border-red-400 focus:border-red-500 shadow-lg shadow-red-500/20'
                      : 'border-gold/20 focus:border-gold focus:shadow-lg focus:shadow-gold/20'
                  }`}
                  placeholder="e.g. 0600000000"
                />
                {errors.phone && touched.phone && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1 bg-red-500/10 p-2 rounded">
                    <AlertCircle size={12} /> {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block text-xs uppercase font-bold text-gold/90 mb-2 tracking-wider">
                  City / Area *
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('city')}
                  className={`w-full bg-white/10 backdrop-blur-sm border-2 p-4 rounded-lg focus:outline-none transition-all text-sand placeholder-sand/40 ${
                    errors.city && touched.city
                      ? 'border-red-400 focus:border-red-500 shadow-lg shadow-red-500/20'
                      : 'border-gold/20 focus:border-gold focus:shadow-lg focus:shadow-gold/20'
                  }`}
                  placeholder="e.g. Casablanca, Maarif"
                />
                {errors.city && touched.city && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1 bg-red-500/10 p-2 rounded">
                    <AlertCircle size={12} /> {errors.city}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gold/90 mb-3 tracking-wider">Shipping Method *</label>
                <div className="space-y-3">
                  {Object.entries(shippingOptions).map(([key, option]) => (
                    <label
                      key={key}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.shippingMethod === key
                          ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                          : 'border-gold/20 hover:border-gold/40 bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={key}
                          checked={formData.shippingMethod === key}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-gold focus:ring-gold/20"
                        />
                        <div>
                          <p className="font-semibold text-sm text-sand">{option.label}</p>
                          <p className="text-xs text-sand/60">{option.days}</p>
                        </div>
                      </div>
                      <span className="font-bold text-sm text-gold">
                        {option.price === 0 ? 'Free' : `${option.price} MAD`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-xs uppercase font-bold text-gold/90 mb-2 tracking-wider">
                  Special Requests
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 backdrop-blur-sm border-2 border-gold/20 p-4 rounded-lg focus:outline-none focus:border-gold focus:shadow-lg focus:shadow-gold/20 transition-all h-24 resize-none text-sand placeholder-sand/40"
                  placeholder="e.g. It's a gift, please deliver after 6 PM..."
                />
              </div>

              <div className="border-t-2 border-gold/30 pt-6 mt-6">
                {/* Promo Code Field */}
                <div className="mb-6">
                  <label className="block text-xs uppercase font-bold text-gold/90 mb-3 tracking-wider">Promo Code</label>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-4 bg-green-500/20 border-2 border-green-400/50 rounded-lg shadow-lg shadow-green-500/10">
                      <div className="flex items-center gap-3">
                        <span className="text-green-400 font-bold text-base">{appliedPromo.code}</span>
                        <span className="text-green-300 text-xs px-2 py-1 bg-green-500/20 rounded">applied</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemovePromo}
                        className="text-xs text-red-400 hover:text-red-300 underline font-medium"
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
                        className={`flex-1 bg-white/10 backdrop-blur-sm border-2 p-3 rounded-lg text-sm focus:outline-none transition-all text-sand placeholder-sand/40 ${
                          promoError ? 'border-red-400 shadow-lg shadow-red-500/20' : 'border-gold/20 focus:border-gold'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-5 py-3 bg-gold text-midnight text-xs font-bold uppercase rounded-lg hover:bg-gold/90 transition-colors shadow-lg"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {promoError && (
                    <p className="text-red-400 text-xs mt-2 flex items-center gap-1 bg-red-500/10 p-2 rounded">
                      <AlertCircle size={12} /> {promoError}
                    </p>
                  )}
                </div>

                {/* Order Total */}
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border-2 border-gold/20 mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-sand/80">
                      <span>Subtotal</span>
                      <span>{subtotal} MAD</span>
                    </div>
                    {appliedPromo && (
                      <div className="flex justify-between text-sm text-green-400">
                        <span>Discount ({appliedPromo.code})</span>
                        <span>-{discountAmount} MAD</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-sand/80">
                      <span>Shipping</span>
                      <span className={shippingCost === 0 ? 'text-green-400' : ''}>{shippingCost === 0 ? 'Free' : `${shippingCost} MAD`}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-serif font-bold text-sand border-t-2 border-gold/30 pt-4">
                      <span>Total</span>
                      <span>{totalWithShipping} <span className="text-base font-normal text-sand/70">MAD</span></span>
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white border-none h-14 text-base font-bold shadow-xl hover:shadow-2xl transition-all rounded-lg">
                <MessageCircle size={20} />
                Send Order to WhatsApp →
              </Button>
              <p className="text-center text-xs text-sand/50 mt-3">Secure checkout via WhatsApp</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCheckout;