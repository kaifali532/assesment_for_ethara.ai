import React, { useState, useEffect } from 'react';
import api from '../api';
import { PageTransition } from '../components/ui/PageTransition';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Plus, Edit2, Trash2, X, Search, User as UserIcon, Mail, Phone, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) { console.error(err); }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await api.put(`/customers/${editingId}`, formData);
      else await api.post('/customers', formData);
      
      setFormData({ full_name: '', email: '', phone: '' });
      setShowForm(false);
      setEditingId(null);
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while saving.');
    }
  };

  const handleEdit = (c) => {
    setFormData({ full_name: c.full_name, email: c.email, phone: c.phone || '' });
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try { await api.delete(`/customers/${id}`); fetchCustomers(); } catch (err) { console.error(err); }
    }
  };

  const filteredCustomers = customers.filter(c => c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <PageTransition className="space-y-12 p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-4">Client Management</h1>
          <p className="text-xl text-gray-400 font-medium">Build long-lasting relationships by organizing contact details and tracking order histories.</p>
        </div>
        <Button size="lg" onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ full_name: '', email: '', phone: '' }); }} className="rounded-full px-8 shadow-float whitespace-nowrap">
          {showForm ? <><X className="w-5 h-5 mr-2" /> Cancel</> : <><Plus className="w-5 h-5 mr-2" /> Add Client</>}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, height: 0 }} className="overflow-hidden">
            <Card className="bg-[#151516] border border-white/10">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white">{editingId ? 'Edit Client' : 'Create New Client'}</h3>
                  {error && <p className="text-[#ff453a] text-sm mt-2">{error}</p>}
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><Label>Full Name</Label><Input name="full_name" value={formData.full_name} onChange={handleInputChange} required placeholder="e.g. Tim Cook" /></div>
                  <div><Label>Email Address</Label><Input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="e.g. tim@apple.com" /></div>
                  <div><Label>Phone Number (Optional)</Label><Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="e.g. +1 555 0199" /></div>
                  <div className="md:col-span-2 flex justify-end pt-4 border-t border-white/5">
                    <Button type="submit" size="lg" className="rounded-full px-10">{editingId ? 'Save Changes' : 'Create Client'}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center mb-6 max-w-md">
        <div className="relative w-full">
          <Search className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <Input 
            type="text" 
            placeholder="Search clients by name or email..." 
            className="pl-12 bg-[#1c1c1e] border-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(c => (
          <Card key={c.id} hover className="bg-[#151516] border border-white/5 p-6 group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2997ff]/20 to-[#bf5af2]/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{c.full_name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(c)} className="rounded-full bg-[#2c2c2e] hover:bg-[#3a3a3c] border-0 px-3 h-8"><Edit2 className="w-3.5 h-3.5" /></Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(c.id)} className="rounded-full bg-[#ff453a]/10 text-[#ff453a] hover:bg-[#ff453a]/20 hover:text-[#ff453a] border-0 px-3 h-8"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{c.full_name}</h3>
              <div className="space-y-3 mt-4 text-gray-400">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-gray-500" />
                  <span className="truncate">{c.email}</span>
                </div>
                {c.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-gray-500" />
                    <span>{c.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {customers.length === 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="text-center p-20 text-gray-500 overflow-hidden relative border-0 bg-[#151516]">
            <div className="absolute top-[-50%] left-[20%] w-[60%] h-[200%] bg-[#bf5af2]/10 blur-[100px] rounded-full pointer-events-none"></div>
            <img src="/assets/feature_3.png" alt="No Customers" className="w-64 h-64 mx-auto object-cover rounded-2xl drop-shadow-2xl mb-8 relative z-10" />
            <h3 className="text-3xl font-bold text-white mb-3 relative z-10">No Clients Yet</h3>
            <p className="text-gray-400 max-w-lg mx-auto mb-10 relative z-10 text-lg">Your client database is currently empty. Add your first customer to start tracking orders and building relationships.</p>
            <Button onClick={() => setShowForm(true)} size="lg" className="relative z-10 shadow-float rounded-full px-8">
              Add Your First Client <ChevronRight className="w-4 h-4 ml-2 inline-block" />
            </Button>
          </Card>
        </motion.div>
      )}
    </PageTransition>
  );
}
