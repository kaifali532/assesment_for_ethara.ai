import random
from sqlalchemy.orm import Session
import models
import schemas
import crud

# Starter data definitions
PRODUCTS = [
    {"name": "MacBook Pro 14", "sku": "APP-MBP14-001", "price": 1999.00, "quantity": 45},
    {"name": "iPad Air", "sku": "APP-IPA-002", "price": 599.00, "quantity": 120},
    {"name": "Dell UltraSharp Monitor", "sku": "DEL-USM-003", "price": 850.00, "quantity": 30},
    {"name": "Logitech MX Master 3S", "sku": "LOG-MX3S-004", "price": 99.99, "quantity": 85},
    {"name": "Sony WH-1000XM5 Headphones", "sku": "SON-WH5-005", "price": 398.00, "quantity": 60},
    {"name": "Samsung Portable SSD", "sku": "SAM-SSD-006", "price": 129.99, "quantity": 150},
    {"name": "Office Desk Chair", "sku": "FURN-CHR-007", "price": 250.00, "quantity": 25},
    {"name": "Wireless Barcode Scanner", "sku": "HW-WBS-008", "price": 145.00, "quantity": 40},
    {"name": "USB-C Docking Station", "sku": "ACC-DOCK-009", "price": 199.00, "quantity": 75},
    {"name": "Epson Receipt Printer", "sku": "EPS-RPR-010", "price": 220.00, "quantity": 3}, # Low stock
    {"name": "Canon Laser Printer", "sku": "CAN-LPR-011", "price": 450.00, "quantity": 15},
    {"name": "Lenovo ThinkPad X1 Carbon", "sku": "LEN-TPX1-012", "price": 1550.00, "quantity": 20},
    {"name": "HP EliteBook 840", "sku": "HP-EB840-013", "price": 1350.00, "quantity": 18},
    {"name": "Apple Magic Keyboard", "sku": "APP-MKB-014", "price": 99.00, "quantity": 110},
    {"name": "Apple Magic Mouse", "sku": "APP-MMS-015", "price": 79.00, "quantity": 140},
    {"name": "Samsung Galaxy Tab", "sku": "SAM-GTB-016", "price": 650.00, "quantity": 55},
    {"name": "Zebra Label Printer", "sku": "ZEB-LPR-017", "price": 320.00, "quantity": 4},  # Low stock
    {"name": "Inventory Storage Rack", "sku": "FURN-RCK-018", "price": 550.00, "quantity": 12},
    {"name": "POS Terminal", "sku": "HW-POS-019", "price": 890.00, "quantity": 2},       # Low stock
    {"name": "Network Router", "sku": "NET-RTR-020", "price": 180.00, "quantity": 45},
]

CUSTOMERS = [
    {"full_name": "Aarav Sharma", "email": "aarav.sharma@example.com", "phone": "+1-555-0101"},
    {"full_name": "Priya Mehta", "email": "priya.mehta@example.com", "phone": "+1-555-0102"},
    {"full_name": "Rohan Verma", "email": "rohan.verma@example.com", "phone": "+1-555-0103"},
    {"full_name": "Neha Kapoor", "email": "neha.kapoor@example.com", "phone": "+1-555-0104"},
    {"full_name": "Aditya Rao", "email": "aditya.rao@example.com", "phone": "+1-555-0105"},
    {"full_name": "Ananya Iyer", "email": "ananya.iyer@example.com", "phone": "+1-555-0106"},
    {"full_name": "Kabir Malhotra", "email": "kabir.malhotra@example.com", "phone": "+1-555-0107"},
    {"full_name": "Sneha Nair", "email": "sneha.nair@example.com", "phone": "+1-555-0108"},
    {"full_name": "Vikram Singh", "email": "vikram.singh@example.com", "phone": "+1-555-0109"},
    {"full_name": "Meera Joshi", "email": "meera.joshi@example.com", "phone": "+1-555-0110"},
]

def seed_database(db: Session):
    # Check if we already have data
    if db.query(models.Product).first() is not None:
        print("Database already populated. Skipping workspace initialization.")
        return

    print("Initializing workspace with starter inventory records...")

    # 1. Create Products
    created_products = []
    for p_data in PRODUCTS:
        product = schemas.ProductCreate(**p_data)
        db_product = crud.create_product(db, product)
        created_products.append(db_product)

    # 2. Create Customers
    created_customers = []
    for c_data in CUSTOMERS:
        customer = schemas.CustomerCreate(**c_data)
        db_customer = crud.create_customer(db, customer)
        created_customers.append(db_customer)

    # 3. Create Orders
    # Create 15 realistic business orders
    for i in range(15):
        # Pick a random customer
        customer = random.choice(created_customers)
        
        # Pick 1 to 3 random products for the order
        num_items = random.randint(1, 3)
        order_items = []
        
        selected_products = random.sample(created_products, num_items)
        
        for product in selected_products:
            # Pick a quantity between 1 and 3 (make sure we don't pick more than available stock)
            qty = random.randint(1, min(3, max(1, product.quantity)))
            if qty > 0 and product.quantity >= qty:
                order_items.append(schemas.OrderItemCreate(
                    product_id=product.id,
                    quantity=qty
                ))
        
        if order_items:
            order_create = schemas.OrderCreate(
                customer_id=customer.id,
                items=order_items
            )
            # The crud.create_order method automatically handles stock reduction
            # and calculates total_amount
            try:
                crud.create_order(db, order_create)
            except Exception as e:
                print(f"Failed to create order: {e}")

    print("Workspace initialized successfully.")
