import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CartSidebar from './components/CartSidebar.jsx'
import PageTransition from './components/PageTransition.jsx'
import Homepage from './pages/Homepage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'

function App() {
  return (
    <Router>
      <div className="bg-white min-h-screen font-sans">
        <Header />
        <CartSidebar />
        <main className="pt-16">
          <PageTransition>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Routes>
          </PageTransition>
        </main>
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1f2937',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              padding: '16px 20px',
              minWidth: '320px',
              maxWidth: '500px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
