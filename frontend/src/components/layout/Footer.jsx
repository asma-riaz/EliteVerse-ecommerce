// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom'
import { ShoppingBag, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <ShoppingBag size={16} className="text-white" />
              </div>
              <span className="text-lg font-display font-bold text-white">EliteVerse</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">Premium e-commerce platform</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Shop</h4>
            <ul className="space-y-2 text-sm">
              {[['All Products','/products'],['Electronics','/products?category=electronics'],['Fashion','/products?category=fashion'],['Home & Living','/products?category=home-living']].map(([label,to]) => (
                <li key={to}><Link to={to} className="hover:text-orange-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Account</h4>
            <ul className="space-y-2 text-sm">
              {[['Login','/login'],['Register','/register'],['My Orders','/orders'],['Wishlist','/wishlist']].map(([label,to]) => (
                <li key={to}><Link to={to} className="hover:text-orange-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail size={14} className="text-orange-400" /> support@eliteverse.pk</li>
              <li className="flex items-center gap-2"><Phone size={14} className="text-orange-400" /> 0320-4301008</li>
              <li className="flex items-center gap-2"><MapPin size={14} className="text-orange-400" /> Lahore, Pakistan</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-stone-500">
          <p>© 2026 EliteVerse Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
