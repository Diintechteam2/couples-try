import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  const token = localStorage.getItem('usertoken');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/clients/CLI746136Q0EY/user/order/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setOrders(res.data.orders || []);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (orders || []).filter((o) => {
      const matchesQuery = !q ||
        o._id.toLowerCase().includes(q) ||
        (o.items || []).some((it) => (it.product?.type || '').toLowerCase().includes(q));
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [orders, query, statusFilter]);

  const statusBadge = (status) => {
    const map = {
      pending: 'bg-orange-50 text-orange-700 border border-orange-200',
      confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
      shipped: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
      delivered: 'bg-green-50 text-green-700 border border-green-200',
      cancelled: 'bg-red-50 text-red-700 border border-red-200',
      returned: 'bg-gray-50 text-gray-700 border border-gray-200',
    };
    return map[status] || 'bg-gray-50 text-gray-700 border border-gray-200';
  };

  const SkeletonRow = () => (
    <div className="bg-white border rounded-lg p-4 animate-pulse">
      <div className="h-16 bg-gray-100 rounded" />
    </div>
  );

  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">My Orders</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order ID or product name"
              className="w-64 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all','pending','confirmed','shipped','delivered','cancelled','returned'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-sm capitalize border ${statusFilter===s ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-700 border-gray-200'}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {loading && (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          )}

          {!loading && filtered.map((order) => (
            <div key={order._id} className="bg-white border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {order.items?.[0]?.product?.imageUrl && (
                      <img src={order.items[0].product.imageUrl} alt="cover" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">Order #{order._id}</div>
                      <span className={`text-xs px-2 py-1 rounded ${statusBadge(order.status)} capitalize`}>{order.status}</span>
                    </div>
                    <div className="text-sm text-gray-600">{order.items?.length || 0} items • ₹{order.totalAmount?.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Placed on {new Date(order.orderDate).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    onClick={() => navigate(`/auth/orders/${order._id}`)}
                    className="px-3 py-2 bg-pink-500 text-white rounded text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!loading && filtered.length === 0 && (
            <div className="bg-white border rounded-lg p-8 text-center text-gray-600">
              No matching orders.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


