import requests
import random
import uuid

BASE_URL = 'http://localhost:8000'

def seed():
    # 1. Fetch or create products
    res = requests.get(f"{BASE_URL}/products")
    products = res.json()
    
    if not products:
        print("No products found, creating some...")
        new_products = [
            {"name": "MacBook Pro 16", "sku": str(uuid.uuid4())[:8], "price": 3499.00, "quantity": 42},
            {"name": "iPhone 15 Pro", "sku": str(uuid.uuid4())[:8], "price": 1199.00, "quantity": 125},
            {"name": "iPad Pro", "sku": str(uuid.uuid4())[:8], "price": 1099.00, "quantity": 8},
        ]
        for p in new_products:
            requests.post(f"{BASE_URL}/products", json=p)
        res = requests.get(f"{BASE_URL}/products")
        products = res.json()

    prod_ids = [p['id'] for p in products]

    # 2. Fetch or create customers
    res = requests.get(f"{BASE_URL}/customers")
    customers = res.json()
    
    if not customers:
        print("No customers found, creating some...")
        new_customers = [
            {"full_name": "Tim Cook", "email": f"tcook_{uuid.uuid4().hex[:4]}@apple.com", "phone": "555-0101"},
            {"full_name": "Craig Federighi", "email": f"craig_{uuid.uuid4().hex[:4]}@apple.com", "phone": "555-0102"},
        ]
        for c in new_customers:
            requests.post(f"{BASE_URL}/customers", json=c)
        res = requests.get(f"{BASE_URL}/customers")
        customers = res.json()

    cust_ids = [c['id'] for c in customers]

    if not prod_ids or not cust_ids:
        print("Still missing products or customers. Cannot create orders.")
        return

    # 3. Add realistic orders
    print("Creating orders...")
    for _ in range(25):
        c_id = random.choice(cust_ids)
        num_items = random.randint(1, 4)
        items = []
        for _ in range(num_items):
            p_id = random.choice(prod_ids)
            qty = random.randint(1, 5)
            items.append({"product_id": p_id, "quantity": qty})
        
        unique_items_dict = {}
        for item in items:
            pid = item['product_id']
            unique_items_dict[pid] = unique_items_dict.get(pid, 0) + item['quantity']
            
        final_items = [{"product_id": k, "quantity": v} for k, v in unique_items_dict.items()]
        
        req = requests.post(f"{BASE_URL}/orders", json={"customer_id": c_id, "items": final_items})
        if req.status_code != 200:
            print("Failed to create order:", req.text)

    print("Seeding complete!")

if __name__ == '__main__':
    seed()
