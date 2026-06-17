import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart } from 'lucide-react';
import { cn } from './ui/Button';
import { motion } from 'framer-motion';

export function Sidebar() {
  const links = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/products", icon: Package, label: "Products" },
    { to: "/customers", icon: Users, label: "Customers" },
    { to: "/orders", icon: ShoppingCart, label: "Orders" },
  ];

  return (
    <aside className="w-72 h-full flex-shrink-0 flex flex-col border-r border-white/10 bg-[#0a0a0a] z-20 relative">
      <Link to="/" className="flex items-center px-6 py-8 hover:opacity-80 transition-opacity">
        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(41,151,255,0.2)] flex items-center justify-center mr-4 bg-black border border-white/10">
          <img src="/assets/logo.png" alt="InventoryPro Logo" className="w-full h-full object-cover scale-[1.3]" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white leading-tight">InventoryPro</h1>
          <p className="text-xs text-[#2997ff] font-medium tracking-wide">COMMAND CENTER</p>
        </div>
      </Link>
      
      <div className="px-4 mb-4">
        <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Main Menu</p>
        <nav className="flex-1 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => cn(
                "flex items-center px-3 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "bg-[#1c1c1e] text-[#2997ff] shadow-sm border border-white/5" 
                  : "text-gray-400 hover:bg-[#151516] hover:text-white"
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active-pill"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[#2997ff] rounded-r-full"
                    />
                  )}
                  <link.icon className={cn("w-5 h-5 mr-3 transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                  <span className="relative z-10">{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-white/5">
        <div className="flex items-center p-3 rounded-2xl hover:bg-[#151516] transition-colors cursor-pointer border border-transparent hover:border-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center mr-3 border border-white/10">
            <span className="text-sm font-bold text-white">AD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@inventorypro.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
