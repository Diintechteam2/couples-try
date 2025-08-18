import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('usertoken');

  // Compute totals before any conditional returns to keep hooks order stable
  const totals = useMemo(() => {
    const items = order?.items || [];
    const subtotal = items.reduce((s, it) => s + (it.price * it.quantity), 0);
    const taxes = subtotal * 0.18;
    const delivery = 0;
    const total = subtotal + taxes + delivery;
    return { subtotal, taxes, delivery, total };
  }, [order]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/clients/CLI746136Q0EY/user/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setOrder(res.data.order);
        else setError('Failed to load order');
      } catch (err) {
        setError('Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  const downloadInvoice = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/clients/CLI746136Q0EY/user/order/${orderId}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert('Failed to download invoice');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <button className="text-sm text-gray-600 mb-4" onClick={() => navigate(-1)}>&larr; Back</button>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white border rounded-lg p-4 md:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-semibold">Order #{order._id}</h1>
              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 capitalize">{order.status}</span>
            </div>
            <div className="text-sm text-gray-600">Placed on {new Date(order.orderDate).toLocaleString()}</div>
            <div className="text-sm">Payment: {order.paymentMethod}</div>
            <div className="mt-4">
              <h2 className="font-medium mb-2">Items</h2>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                      {item.product?.imageUrl && <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.product?.type}</div>
                      <div className="text-sm text-gray-600">Qty: {item.quantity} • Size: {item.size}</div>
                      <div className="text-sm">Unit Price: ₹{item.price}</div>
                    </div>
                    <div className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 h-fit">
            <h2 className="font-medium mb-3">Price Details</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{totals.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Taxes (18%)</span><span>₹{totals.taxes.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>₹{totals.delivery.toFixed(2)}</span></div>
            </div>
            <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{totals.total.toFixed(2)}</span>
            </div>
            <button onClick={downloadInvoice} className="mt-4 w-full px-3 py-2 bg-blue-600 text-white rounded text-sm">Download Invoice</button>
          </div>
        </div>
      </div>
    </div>
  );
}


