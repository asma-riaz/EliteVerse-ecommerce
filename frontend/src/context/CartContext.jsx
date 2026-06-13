// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState({ items: [], subtotal: 0, count: 0 })
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], subtotal: 0, count: 0 }); return }
    try {
      const { data } = await api.get('/cart/index.php')
      setCart(data)
    } catch {}
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = async (product_id, quantity = 1) => {
    if (!user) return false
    try {
      await api.post('/cart/index.php', { product_id, quantity })
      await fetchCart()
      return true
    } catch { return false }
  }

  const updateQty = async (cart_id, quantity) => {
    try {
      await api.put('/cart/index.php', { cart_id, quantity })
      await fetchCart()
    } catch {}
  }

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/index.php?id=${id}`)
      await fetchCart()
    } catch {}
  }

  const clearCart = async () => {
    try {
      await api.delete('/cart/index.php?id=all')
      await fetchCart()
    } catch {}
  }

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQty, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
