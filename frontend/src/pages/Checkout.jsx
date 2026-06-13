// src/pages/Checkout.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { useCart } from '../context/CartContext'
import api from '../utils/api'
import { formatPrice } from '../utils/helpers'
import toast from 'react-hot-toast'
import { MapPin, CreditCard, Truck } from 'lucide-react'

export default function Checkout() {
  const { cart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', address_line: '', city: 'Lahore', state: 'Punjab',
    zip: '', payment_method: 'cod', notes: ''
  })

  const [cardDetails, setCardDetails] = useState({
  card_number: '', card_name: '', expiry: '', cvv: ''
});

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const shipping = cart.subtotal > 5000 ? 0 : 150
  const total = cart.subtotal + shipping

  const handleOrder = async e => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.address_line || !form.city) return toast.error('Please fill all required fields')
    if (form.payment_method === 'card') {
      if (cardDetails.card_number.replace(/\s/g, '').length !== 16)
        return toast.error('Enter a valid 16-digit card number')
      if (!cardDetails.card_name.trim())
        return toast.error('Enter name on card')
      if (cardDetails.expiry.length !== 5)
        return toast.error('Enter a valid expiry date')
      if (cardDetails.cvv.length !== 3)
        return toast.error('Enter a valid CVV')
    }

    setLoading(true)
    try {
      const shippingAddress = `${form.name}, ${form.phone}, ${form.address_line}, ${form.city}, ${form.state} ${form.zip}`
      const { data } = await api.post('/orders/index.php', {
        shipping_address: shippingAddress,
        payment_method: form.payment_method,
        notes: form.notes,
        card_details: form.payment_method === 'card' ? cardDetails : null
      })
      toast.success('Order placed successfully!')
      navigate(`/orders`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Order failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-display font-bold text-stone-900 mb-6">Checkout</h1>

        <form onSubmit={handleOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              {/* Shipping */}
              <div className="card p-5">
                <h2 className="font-display font-bold text-stone-900 text-base mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-orange-500" /> Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="text-xs font-medium text-stone-600 mb-1 block">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} className="input" required /></div>
                  <div><label className="text-xs font-medium text-stone-600 mb-1 block">Phone *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="input" required /></div>
                  <div className="sm:col-span-2"><label className="text-xs font-medium text-stone-600 mb-1 block">Address *</label>
                    <input name="address_line" value={form.address_line} onChange={handleChange} className="input" placeholder="Street, House No." required /></div>
                  <div><label className="text-xs font-medium text-stone-600 mb-1 block">City *</label>
                    <input name="city" value={form.city} onChange={handleChange} className="input" required /></div>
                  <div><label className="text-xs font-medium text-stone-600 mb-1 block">State</label>
                    <input name="state" value={form.state} onChange={handleChange} className="input" /></div>
                  <div><label className="text-xs font-medium text-stone-600 mb-1 block">ZIP Code</label>
                    <input name="zip" value={form.zip} onChange={handleChange} className="input" /></div>
                </div>
              </div>

              {/* Payment */}
              <div className="card p-5">
                <h2 className="font-display font-bold text-stone-900 text-base mb-4 flex items-center gap-2">
                  <CreditCard size={18} className="text-orange-500" /> Payment Method
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when delivered' },
                    { value: 'card', label: 'Credit/Debit Card', desc: 'Secure online payment'}
                  ].map(m => (
                    <label key={m.value}
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${form.payment_method === m.value ? 'border-orange-500 bg-orange-50' : 'border-stone-200 hover:border-stone-300'}`}>
                      <input type="radio" name="payment_method" value={m.value} checked={form.payment_method === m.value} onChange={handleChange} className="sr-only" />
                      <span className="text-xl">{m.icon}</span>
                      <div>
                        <p className="font-semibold text-stone-900 text-sm">{m.label}</p>
                        <p className="text-xs text-stone-400">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {form.payment_method === 'card' && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-stone-600 mb-1 block">Card Number</label>
      <input
        type="text"
        maxLength={19}
        placeholder="1234 5678 9012 3456"
        value={cardDetails.card_number}
        onChange={e => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 16);
          const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
          setCardDetails(p => ({ ...p, card_number: formatted }));
        }}
        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
      />
    </div>
    <div className="sm:col-span-2">
      <label className="text-xs font-semibold text-stone-600 mb-1 block">Name on Card</label>
      <input
        type="text"
        placeholder="John Doe"
        value={cardDetails.card_name}
        onChange={e => setCardDetails(p => ({ ...p, card_name: e.target.value }))}
        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
      />
    </div>
    <div>
      <label className="text-xs font-semibold text-stone-600 mb-1 block">Expiry Date</label>
      <input
        type="text"
        maxLength={5}
        placeholder="MM/YY"
        value={cardDetails.expiry}
        onChange={e => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 4);
          const formatted = val.length >= 3 ? val.slice(0,2) + '/' + val.slice(2) : val;
          setCardDetails(p => ({ ...p, expiry: formatted }));
        }}
        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
      />
    </div>
    <div>
      <label className="text-xs font-semibold text-stone-600 mb-1 block">CVV</label>
      <input
        type="password"
        maxLength={3}
        placeholder="•••"
        value={cardDetails.cvv}
        onChange={e => setCardDetails(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
        className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500"
      />
    </div>
  </div>
)}
              </div>

              {/* Notes */}
              <div className="card p-5">
                <h2 className="font-display font-bold text-stone-900 text-base mb-3">Order Notes</h2>
                <textarea name="notes" value={form.notes} onChange={handleChange} className="input" rows={3} placeholder="Any special instructions..." />
              </div>
            </div>

            {/* Summary */}
            <div className="card p-5 h-fit sticky top-24">
              <h2 className="font-display font-bold text-stone-900 text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.items.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-stone-50" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-stone-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-stone-400">x{item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-stone-900">{formatPrice((item.sale_price || item.price) * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-stone-100 pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-stone-500">Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-stone-500">Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between font-display font-bold text-stone-900 border-t border-stone-100 pt-2">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
              <button type="submit" disabled={loading || cart.items.length === 0} className="btn-primary w-full mt-4 py-3 flex items-center justify-center gap-2">
                <Truck size={16} />{loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
