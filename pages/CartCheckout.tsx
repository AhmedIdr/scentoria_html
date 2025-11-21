import React, { useState } from 'react';
import { useCartStore } from '../store';
import { Button, SectionTitle } from '../components/UI';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GeneratedImage } from '../components/GeneratedImage';

const CartCheckout: React.FC = () => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    phone: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemsList = items.map(item => 
      `- ${item.quantity}x ${item.name} (${item.size}) - ${item.price * item.quantity} MAD`
    ).join('\n');

    const message = `Hi Scentoria 🌿%0A%0AI'd like to order:%0A${itemsList}%0A%0ASubtotal: ${getTotalPrice()} MAD%0A%0A---%0ADetails:%0AName: ${formData.name}%0APhone: ${formData.phone}%0ACity: ${formData.city}%0ANotes: ${formData.notes}`;

    // Replace with actual number
    const phoneNumber = "212600000000"; 
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
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
                <label className="block text-xs uppercase font-bold text-cedar/70 mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-sand/20 border border-cedar/20 p-3 rounded-sm focus:outline-none focus:border-cedar transition-colors"
                  placeholder="e.g. Amina Benali"
                />
              </div>
              
              <div>
                <label className="block text-xs uppercase font-bold text-cedar/70 mb-1">Phone Number</label>
                <input 
                  required
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-sand/20 border border-cedar/20 p-3 rounded-sm focus:outline-none focus:border-cedar transition-colors"
                  placeholder="e.g. 06 00 00 00 00"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-cedar/70 mb-1">City / Area</label>
                <input 
                  required
                  type="text" 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-sand/20 border border-cedar/20 p-3 rounded-sm focus:outline-none focus:border-cedar transition-colors"
                  placeholder="e.g. Casablanca, Maarif"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-cedar/70 mb-1">Special Requests</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="w-full bg-sand/20 border border-cedar/20 p-3 rounded-sm focus:outline-none focus:border-cedar transition-colors h-24 resize-none"
                  placeholder="e.g. It's a gift, please deliver after 6 PM..."
                />
              </div>

              <div className="border-t border-cedar/10 pt-4 mt-2 mb-6">
                <div className="flex justify-between text-lg font-serif font-bold text-midnight">
                  <span>Total</span>
                  <span>{getTotalPrice()} MAD</span>
                </div>
                <p className="text-[10px] text-cedar/50 mt-1">*Shipping fees confirmed via WhatsApp</p>
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