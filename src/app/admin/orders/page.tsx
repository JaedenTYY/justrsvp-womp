'use client'

import { useState, useEffect } from 'react'
import { Order } from '@prisma/client'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const ordersPerPage = 10

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const response = await fetch('/api/orders')
    const data = await response.json()
    setOrders(data)
  }

  const updateOrder = async (order: Order) => {
    setEditingOrder(order)
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingOrder) return

    const response = await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingOrder)
    })

    if (response.ok) {
      fetchOrders()
      setEditingOrder(null)
    } else {
      alert('Failed to update order')
    }
  }

  const deleteOrder = async (id: number) => {
    if (confirm('Are you sure you want to delete this order?')) {
      const response = await fetch('/api/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (response.ok) fetchOrders()
    }
  }

  const filteredOrders = orders.filter(order => 
    order.id.toString().includes(searchTerm) ||
    (order.stripeId && order.stripeId.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="p-8 rounded-xl shadow-lg bg-white max-w-7xl mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Orders</h1>
      
      <input
        type="text"
        placeholder="Search orders by ID or Stripe ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border rounded-full p-3 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stripe ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition duration-300 ease-in-out">
                <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.stripeId || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.totalAmount || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.eventId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.buyerId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => updateOrder(order)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full mr-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105">Update</button>
                  <button onClick={() => deleteOrder(order.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ease-in-out transform hover:scale-105">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center">
        {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-4 py-2 rounded-full transition duration-300 ease-in-out ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {editingOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Order</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stripeId">
                  Stripe ID
                </label>
                <input
                  type="text"
                  id="stripeId"
                  value={editingOrder.stripeId || ''}
                  onChange={(e) => setEditingOrder({...editingOrder, stripeId: e.target.value || null})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalAmount">
                  Total Amount
                </label>
                <input
                  type="text"
                  id="totalAmount"
                  value={editingOrder.totalAmount || ''}
                  onChange={(e) => setEditingOrder({...editingOrder, totalAmount: e.target.value || null})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Order
                </button>
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}