import React, { useState, useEffect } from 'react';
import api from '../api';
import { PageTransition } from '../components/ui/PageTransition';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Label, Select, Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Plus, X, Trash2, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [orderItems, setOrderItems] = useState([{ product_id: '', quantity: 1 }]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchDropdownData();
  }, []);

  const fetchOrders = async () => {
    try { const res = await api.get('/orders'); setOrders(res.data); } catch (err) { console.error(err); }
  };

  const fetchDropdownData = async () => {
    try {
      const custRes = await api.get('/customers'); setCustomers(custRes.data);
      const prodRes = await api.get('/products'); setProducts(prodRes.data.filter(p => p.quantity > 0));
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    const items = orderItems
      .filter(item => item.product_id && item.quantity > 0)
      .map(item => ({ product_id: parseInt(item.product_id), quantity: parseInt(item.quantity) }));

    if (items.length === 0) return setError("Please add at least one valid product.");
    if (!selectedCustomerId) return setError("Please select a customer.");

    try {
      await api.post('/orders', { customer_id: parseInt(selectedCustomerId), items });
      setShowForm(false);
      setSelectedCustomerId('');
      setOrderItems([{ product_id: '', quantity: 1 }]);
      setSuccess('Order placed successfully!');
      fetchOrders();
      fetchDropdownData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this order completely?")) {
      try { await api.delete(`/orders/${id}`); fetchOrders(); } catch (err) { console.error(err); }
    }
  };

  const getCustomerName = (id) => {
    const c = customers.find(c => c.id === id);
    return c ? c.full_name : `Customer #${id}`;
  };

  return (
    <PageTransition className="space-y-12 p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-4">Order Fulfillment</h1>
          <p className="text-xl text-gray-400 font-medium">Process orders, deduct stock automatically, and manage revenue from a unified interface.</p>
        </div>
        <Button size="lg" onClick={() => setShowForm(!showForm)} className="rounded-full px-8 shadow-float whitespace-nowrap">
          {showForm ? <><X className="w-5 h-5 mr-2" /> Cancel</> : <><Plus className="w-5 h-5 mr-2" /> Create Order</>}
        </Button>
      </div>

      <AnimatePresence>
        {success && <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="p-4 bg-[#30d158]/10 text-[#30d158] rounded-2xl border border-[#30d158]/20 font-medium">{success}</motion.div>}
        {error && <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="p-4 bg-[#ff453a]/10 text-[#ff453a] rounded-2xl border border-[#ff453a]/20 font-medium">{error}</motion.div>}

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, height: 0 }} className="overflow-hidden">
            <Card className="bg-[#151516] border border-white/10 shadow-float">
              <CardContent className="p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white">Create New Order</h3>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <Label>Select Client</Label>
                    <Select value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)} required>
                      <option value="">Choose a client...</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
                    </Select>
                  </div>

                  <div className="bg-[#1c1c1e] p-6 rounded-3xl border border-white/5">
                    <Label className="mb-4 text-base font-bold text-white">Order Items</Label>
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex gap-4 mb-4 items-center">
                        <div className="flex-1">
                          <Select value={item.product_id} onChange={(e) => {
                            const newItems = [...orderItems];
                            newItems[index].product_id = e.target.value;
                            setOrderItems(newItems);
                          }} required>
                            <option value="">Select a Product...</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name} (${p.price.toFixed(2)}) - {p.quantity} available</option>)}
                          </Select>
                        </div>
                        <div className="w-24">
                          <Input type="number" min="1" placeholder="Qty" value={item.quantity} onChange={(e) => {
                            const newItems = [...orderItems];
                            newItems[index].quantity = e.target.value;
                            setOrderItems(newItems);
                          }} required />
                        </div>
                        <Button type="button" variant="ghost" className="text-[#ff453a] px-2 hover:bg-[#ff453a]/10" onClick={() => setOrderItems(orderItems.filter((_, i) => i !== index))}><X className="w-5 h-5"/></Button>
                      </div>
                    ))}
                    <Button type="button" variant="secondary" size="sm" className="rounded-full px-6 mt-2" onClick={() => setOrderItems([...orderItems, { product_id: '', quantity: 1 }])}>
                      + Add Another Item
                    </Button>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/5">
                    <Button type="submit" size="lg" className="rounded-full px-10 w-full md:w-auto">Confirm Order</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="bg-[#151516] border-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#111111]">
                <th className="px-8 py-5 font-semibold text-gray-400 tracking-wider uppercase text-xs">Order ID</th>
                <th className="px-8 py-5 font-semibold text-gray-400 tracking-wider uppercase text-xs">Client</th>
                <th className="px-8 py-5 font-semibold text-gray-400 tracking-wider uppercase text-xs">Items Summary</th>
                <th className="px-8 py-5 font-semibold text-gray-400 tracking-wider uppercase text-xs">Total</th>
                <th className="px-8 py-5 font-semibold text-gray-400 tracking-wider uppercase text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6 font-mono text-white text-lg">#{o.id.toString().padStart(4, '0')}</td>
                  <td className="px-8 py-6 font-bold text-white text-lg">{getCustomerName(o.customer_id)}</td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                      {o.items.map((i, idx) => (
                        <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#1c1c1e] text-gray-300 border border-white/10">
                          {i.quantity}x Item #{i.product_id}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-[#2997ff] text-lg">${o.total_amount.toFixed(2)}</td>
                  <td className="px-8 py-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="danger" size="sm" onClick={() => handleDelete(o.id)} className="rounded-full bg-[#ff453a]/10 text-[#ff453a] hover:bg-[#ff453a]/20 hover:text-[#ff453a] border-0"><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-0 py-0">
                    <div className="text-center p-20 text-gray-500 overflow-hidden relative w-full">
                      <div className="absolute top-[-50%] left-[20%] w-[60%] h-[200%] bg-[#2997ff]/10 blur-[100px] rounded-full pointer-events-none"></div>
                      <img src="/assets/feature_2.png" alt="No Orders" className="w-64 h-64 mx-auto object-cover rounded-2xl drop-shadow-2xl mb-8 relative z-10" />
                      <h3 className="text-3xl font-bold text-white mb-3 relative z-10">No Orders Placed</h3>
                      <p className="text-gray-400 max-w-lg mx-auto mb-10 relative z-10 text-lg">You haven't received any orders yet. Once a client makes a purchase, it will appear here for tracking.</p>
                      <Button onClick={() => setShowForm(true)} size="lg" className="relative z-10 shadow-float rounded-full px-8">
                        Create First Order <ChevronRight className="w-4 h-4 ml-2 inline-block" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </PageTransition>
  );
}
