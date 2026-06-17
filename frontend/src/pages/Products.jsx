import React, { useState, useEffect } from 'react';
import api from '../api';
import { PageTransition } from '../components/ui/PageTransition';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Plus, Edit2, Trash2, X, Search, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', sku: '', price: '', quantity: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { ...formData, price: parseFloat(formData.price), quantity: parseInt(formData.quantity) };
    try {
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post('/products', payload);
      
      setFormData({ name: '', sku: '', price: '', quantity: '' });
      setShowForm(false);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while saving.');
    }
  };

  const handleEdit = (p) => {
    setFormData({ name: p.name, sku: p.sku, price: p.price, quantity: p.quantity });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try { await api.delete(`/products/${id}`); fetchProducts(); } catch (err) { console.error(err); }
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <PageTransition className="space-y-12 p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-4">Product Catalog</h1>
          <p className="text-xl text-gray-400 font-medium">Manage your inventory, monitor stock levels, and organize your entire catalog with uncompromising clarity.</p>
        </div>
        <Button size="lg" onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: '', sku: '', price: '', quantity: '' }); }} className="rounded-full px-8 shadow-float whitespace-nowrap">
          {showForm ? <><X className="w-5 h-5 mr-2" /> Cancel</> : <><Plus className="w-5 h-5 mr-2" /> Add Product</>}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, height: 0 }} className="overflow-hidden">
            <Card className="bg-[#151516] border border-white/10">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white">{editingId ? 'Edit Product' : 'Create New Product'}</h3>
                  {error && <p className="text-[#ff453a] text-sm mt-2">{error}</p>}
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><Label>Product Name</Label><Input name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. AirPods Pro" /></div>
                  <div><Label>SKU / Code</Label><Input name="sku" value={formData.sku} onChange={handleInputChange} required placeholder="e.g. AP-PRO-01" /></div>
                  <div><Label>Price ($)</Label><Input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required min="0.01" /></div>
                  <div><Label>Initial Quantity</Label><Input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required min="0" /></div>
                  <div className="md:col-span-2 flex justify-end pt-4 border-t border-white/5">
                    <Button type="submit" size="lg" className="rounded-full px-10">{editingId ? 'Save Changes' : 'Create Product'}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="bg-[#151516] border-0 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-[#1c1c1e] flex items-center">
          <Search className="w-5 h-5 text-gray-500 mr-4" />
          <input 
            type="text" 
            placeholder="Search products by name or SKU..." 
            className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-600 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#111111]">
                <th className="px-8 py-5 font-semibold text-gray-400 tracking-wider uppercase text-xs">Name</th>
                <th className="px-8 py-5 font-semibold text-gray-400 tracking-wider uppercase text-xs">SKU</th>
                <th className="px-8 py-5 font-semibold text-gray-400 tracking-wider uppercase text-xs">Price</th>
                <th className="px-8 py-5 font-semibold text-gray-400 tracking-wider uppercase text-xs">Stock</th>
                <th className="px-8 py-5 font-semibold text-gray-400 tracking-wider uppercase text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6 font-bold text-white text-lg">{p.name}</td>
                  <td className="px-8 py-6 text-gray-400 font-mono text-sm">{p.sku}</td>
                  <td className="px-8 py-6 text-white text-lg">${p.price.toFixed(2)}</td>
                  <td className="px-8 py-6">
                    {p.quantity > 5 ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#30d158]/10 text-[#30d158]">
                        {p.quantity} In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#ff453a]/10 text-[#ff453a]">
                        Only {p.quantity} Left
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" onClick={() => handleEdit(p)} className="rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] border-0"><Edit2 className="w-4 h-4" /></Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)} className="rounded-full bg-[#ff453a]/10 text-[#ff453a] hover:bg-[#ff453a]/20 hover:text-[#ff453a] border-0"><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-0 py-0">
                    <div className="text-center p-20 text-gray-500 overflow-hidden relative w-full">
                      <div className="absolute top-[-50%] left-[20%] w-[60%] h-[200%] bg-[#2997ff]/10 blur-[100px] rounded-full pointer-events-none"></div>
                      <img src="/assets/feature_1.png" alt="No Products" className="w-64 h-64 mx-auto object-cover rounded-2xl drop-shadow-2xl mb-8 relative z-10" />
                      <h3 className="text-3xl font-bold text-white mb-3 relative z-10">Your Catalog is Empty</h3>
                      <p className="text-gray-400 max-w-lg mx-auto mb-10 relative z-10 text-lg">Start building your inventory by adding your first product. You can track stock levels, pricing, and SKUs easily.</p>
                      <Button onClick={() => setShowForm(true)} size="lg" className="relative z-10 shadow-float rounded-full px-8">
                        Add Your First Product <ChevronRight className="w-4 h-4 ml-2 inline-block" />
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
