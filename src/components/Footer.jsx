import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, Youtube } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    console.log('Newsletter subscription:', email)
    setEmail('')
  }

  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="text-center mb-12 pb-12 border-b border-gray-200">
          <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
          <p className="text-gray-600 mb-6">
            Get the latest updates on new launches and exclusive offers
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/products" className="hover:text-black transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Men" className="hover:text-black transition-colors">For Men</Link></li>
              <li><Link to="/products?category=Women" className="hover:text-black transition-colors">For Women</Link></li>
              <li><Link to="/products?category=Daily Wear" className="hover:text-black transition-colors">Daily Wear</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/about" className="hover:text-black transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-black transition-colors">Contact</Link></li>
              <li><Link to="/careers" className="hover:text-black transition-colors">Careers</Link></li>
              <li><Link to="/press" className="hover:text-black transition-colors">Press</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/help" className="hover:text-black transition-colors">Help Center</Link></li>
              <li><Link to="/shipping" className="hover:text-black transition-colors">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-black transition-colors">Returns</Link></li>
              <li><Link to="/track" className="hover:text-black transition-colors">Track Order</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex space-x-3 mb-4">
              <a href="https://instagram.com" className="text-gray-600 hover:text-black transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" className="text-gray-600 hover:text-black transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://youtube.com" className="text-gray-600 hover:text-black transition-colors">
                <Youtube size={20} />
              </a>
            </div>
            <p className="text-gray-600 text-sm">Follow us for daily updates and fragrance tips</p>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-600">
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4 md:mb-0 text-sm">
            <Link to="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-black transition-colors">Terms & Conditions</Link>
            <Link to="/refund" className="hover:text-black transition-colors">Refund Policy</Link>
          </div>
          <p className="text-sm">&copy; 2025 Minimalist Perfumes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
