# Inventory & Order Management System

A premium, full-stack containerized SaaS application for managing inventory, tracking orders, and handling clients. 

## Features
- **Advanced Dashboard**: Real-time insights, revenue trends, and stock level tracking powered by Recharts.
- **Inventory Management**: Full CRUD operations with low-stock warnings.
- **Order Processing**: Create orders with automatic inventory deduction and total calculations.
- **Premium UI**: Apple-inspired 3D aesthetic built with React, Vite, Tailwind CSS v4, and Framer Motion.
- **Robust Backend**: Fast and scalable API using Python, FastAPI, and SQLAlchemy.
- **Containerized**: Fully orchestrated with Docker Compose for seamless deployment.

## Getting Started

1. **Prerequisites**: Ensure you have Docker and Docker Compose installed.
2. **Launch**: Run `docker-compose up -d --build` from the root directory.
3. **Access**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`

## Workspace Initialization

When you launch the application for the very first time with an empty database, the backend will automatically initialize your workspace with **starter business records**. This includes a robust catalog of realistic products, initial clients, and recent orders. 

This ensures that your dashboard analytics and data tables look fully populated, professional, and ready for production use immediately without any manual configuration. If you drop the database volume, the starter inventory will automatically reload on the next startup.
