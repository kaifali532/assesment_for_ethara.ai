import React, { useEffect, useState, useMemo } from 'react';
import api from '../api';
import { PageTransition } from '../components/ui/PageTransition';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Package, Users, ShoppingCart, Activity, Database, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#2997ff', '#5e5ce6', '#ff2d55', '#ff9f0a', '#30d158', '#64d2ff', '#bf5af2'];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({ summary: null, products: [], orders: [] });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, productsRes, ordersRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/products'),
        api.get('/orders')
      ]);
      
      setData({
        summary: summaryRes.data,
        products: productsRes.data,
        orders: ordersRes.data
      });
    } catch (err) {
      setError('Failed to fetch dashboard analytics. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const insights = useMemo(() => {
    if (!data.products.length) return { totalValue: 0, highestStock: null, lowestStock: null };
    
    let totalValue = 0;
    let highestStock = data.products[0];
    let lowestStock = data.products[0];

    data.products.forEach(p => {
      totalValue += (p.price * p.quantity);
      if (p.quantity > highestStock.quantity) highestStock = p;
      if (p.quantity < lowestStock.quantity) lowestStock = p;
    });

    return { totalValue, highestStock, lowestStock };
  }, [data.products]);

  const stockChartData = useMemo(() => {
    return data.products.map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      stock: p.quantity,
      fill: p.quantity <= 5 ? '#ff453a' : '#2997ff' // apple red for low stock
    })).sort((a, b) => b.stock - a.stock).slice(0, 10);
  }, [data.products]);

  const valueDistributionData = useMemo(() => {
    return data.products.map(p => ({
      name: p.name,
      value: parseFloat((p.price * p.quantity).toFixed(2))
    })).filter(p => p.value > 0).sort((a, b) => b.value - a.value).slice(0, 6);
  }, [data.products]);

  const ordersTrendData = useMemo(() => {
    return data.orders.map((o, index) => ({
      name: `Order #${o.id}`,
      amount: o.total_amount
    })).slice(-15);
  }, [data.orders]);

  if (error) return (
    <PageTransition className="p-6">
      <Card className="bg-[#1c1c1e] border border-white/5"><CardContent className="p-6 text-[#ff453a]">{error}</CardContent></Card>
    </PageTransition>
  );

  if (loading || !data.summary) return (
    <PageTransition className="p-6 flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center text-gray-500">
        <Activity className="w-8 h-8 animate-spin mb-4 text-[#2997ff]" />
        <p>Loading overview...</p>
      </div>
    </PageTransition>
  );

  const { summary } = data;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1c1c1e] border border-white/10 p-3 rounded-xl shadow-float">
          <p className="text-white font-medium mb-1">{label}</p>
          <p className="text-[#2997ff] font-bold">
            {payload[0].name === 'amount' || payload[0].name === 'value' ? '$' : ''}{payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <PageTransition className="space-y-16 p-4 md:p-8 max-w-7xl mx-auto">
      
      {/* Cinematic Hero Section */}
      <section className="text-center pt-8 pb-12">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Inventory. <span className="text-gray-500">Mastered.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 font-medium">
          A premium command center for your entire catalog. Track products, fulfill orders, and build customer relationships with uncompromising clarity.
        </p>
        <div className="flex justify-center gap-6">
          <Link to="/products">
            <Button size="lg" className="rounded-full px-8 text-lg font-semibold shadow-float">
              Manage Products
            </Button>
          </Link>
          <Link to="/orders">
            <Button variant="link" className="text-lg font-semibold group">
              View Orders <ChevronRight className="w-4 h-4 ml-1 inline-block transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Apple Developer Style Feature Cards */}
      <section>
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight text-white">Dive deep into your system</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link to="/products" className="block group">
            <Card hover className="h-full bg-[#151516] border-0">
              <div className="h-64 w-full bg-black overflow-hidden relative">
                <img src="/assets/feature_1.png" alt="Products" className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
              </div>
              <CardContent className="p-8">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Module overview</p>
                <h3 className="text-2xl font-bold text-white mb-3">Product Catalog</h3>
                <p className="text-gray-400 mb-6 line-clamp-3">
                  Build your catalog, monitor stock levels, and organize your entire inventory with powerful tools designed for scale.
                </p>
                <span className="text-[#2997ff] font-medium flex items-center">
                  View overview <ChevronRight className="w-4 h-4 ml-1" />
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link to="/orders" className="block group">
            <Card hover className="h-full bg-[#151516] border-0">
              <div className="h-64 w-full bg-black overflow-hidden relative">
                <img src="/assets/feature_2.png" alt="Orders" className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
              </div>
              <CardContent className="p-8">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Module overview</p>
                <h3 className="text-2xl font-bold text-white mb-3">Order Fulfillment</h3>
                <p className="text-gray-400 mb-6 line-clamp-3">
                  Deliver fantastic purchasing experiences by processing orders seamlessly, deducting stock automatically, and tracking revenue.
                </p>
                <span className="text-[#2997ff] font-medium flex items-center">
                  View overview <ChevronRight className="w-4 h-4 ml-1" />
                </span>
              </CardContent>
            </Card>
          </Link>

          <Link to="/customers" className="block group">
            <Card hover className="h-full bg-[#151516] border-0">
              <div className="h-64 w-full bg-black overflow-hidden relative">
                <img src="/assets/feature_3.png" alt="Customers" className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100" />
              </div>
              <CardContent className="p-8">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Module overview</p>
                <h3 className="text-2xl font-bold text-white mb-3">Client Management</h3>
                <p className="text-gray-400 mb-6 line-clamp-3">
                  Create comprehensive profiles for your buyers. Track contact details, order history, and build long-lasting relationships.
                </p>
                <span className="text-[#2997ff] font-medium flex items-center">
                  View overview <ChevronRight className="w-4 h-4 ml-1" />
                </span>
              </CardContent>
            </Card>
          </Link>

        </div>
      </section>

      {/* High-Impact Stat Metrics */}
      <section>
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight text-white">Metrics at a glance</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Products", value: summary.total_products, icon: Package },
            { title: "Total Customers", value: summary.total_customers, icon: Users },
            { title: "Total Orders", value: summary.total_orders, icon: ShoppingCart },
            { title: "Inventory Value", value: `$${insights.totalValue.toLocaleString()}`, icon: Database },
          ].map((stat, i) => (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={stat.title}>
              <Card hover className="h-full bg-[#151516] border-0 p-8 flex flex-col items-center text-center">
                <stat.icon className="w-8 h-8 text-[#2997ff] mb-6" />
                <h3 className="text-4xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Advanced Analytics Charts */}
      <section>
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight text-white">Visual intelligence</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Stock Levels */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
            <Card className="h-full flex flex-col bg-[#151516] border-0 p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Stock Distribution</h3>
                <p className="text-gray-500">Top 10 highest inventory counts across your catalog</p>
              </div>
              <div className="flex-1 min-h-[350px]">
                {stockChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stockChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333336" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#86868b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#86868b', fontSize: 12}} />
                      <RechartsTooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                      <Bar dataKey="stock" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-600">
                    <Package className="w-12 h-12 mb-4 opacity-20" />
                    <p>No product data available</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Chart 3: Value Distribution (Donut) */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <Card className="h-full flex flex-col bg-[#151516] border-0 p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Value Share</h3>
                <p className="text-gray-500">Asset distribution by product value</p>
              </div>
              <div className="flex-1 min-h-[350px] flex items-center justify-center">
                {valueDistributionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={valueDistributionData}
                        cx="50%"
                        cy="45%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {valueDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px', color: '#86868b', paddingTop: '20px'}} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-600">
                    <Activity className="w-12 h-12 mb-4 opacity-20" />
                    <p>Insufficient data</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Chart 2: Orders Trend */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="lg:col-span-3">
            <Card className="flex flex-col bg-[#151516] border-0 p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Revenue Flow</h3>
                <p className="text-gray-500">Trend of order totals over the recent period</p>
              </div>
              <div className="w-full mt-4">
                {ordersTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={ordersTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2997ff" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#2997ff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333336" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#86868b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#86868b', fontSize: 12}} />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="amount" stroke="#2997ff" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" activeDot={{ r: 6, fill: '#2997ff', stroke: '#000', strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[350px] text-gray-600">
                    <Activity className="w-12 h-12 mb-4 opacity-20" />
                    <p>No order history to display</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

        </div>
      </section>

    </PageTransition>
  );
}
