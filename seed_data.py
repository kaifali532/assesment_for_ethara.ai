import requests
import random

BASE_URL = 'http://localhost:8000'

def seed():
    # 1. Add realistic products
    products = [
        {"name": "MacBook Pro 16-inch (M3 Max)", "description": "12-core CPU, 38-core GPU, 36GB Unified Memory, 1TB SSD Storage", "price": 3499.00, "quantity": 42},
        {"name": "iPhone 15 Pro Max", "description": "Titanium design, A17 Pro chip, 48MP main camera, 256GB Storage", "price": 1199.00, "quantity": 125},
        {"name": "iPad Pro 12.9-inch", "description": "M2 chip, Liquid Retina XDR display, 256GB Storage", "price": 1099.00, "quantity": 8},
        {"name": "Apple Watch Ultra 2", "description": "Titanium Case with Alpine Loop, S9 SiP", "price": 799.00, "quantity": 56},
        {"name": "AirPods Pro (2nd gen)", "description": "Active Noise Cancellation, MagSafe Charging Case", "price": 249.00, "quantity": 210},
        {"name": "Mac Studio", "description": "M2 Ultra, 24-core CPU, 60-core GPU, 64GB Memory", "price": 3999.00, "quantity": 15},
        {"name": "Studio Display", "description": "27-inch 5K Retina display, Nano-texture glass", "price": 1899.00, "quantity": 22},
        {"name": "Magic Keyboard", "description": "Wireless, rechargeable, Touch ID", "price": 149.00, "quantity": 89},
        {"name": "Magic Mouse", "description": "Wireless, rechargeable, Multi-Touch surface", "price": 79.00, "quantity": 142},
        {"name": "Apple TV 4K", "description": "Wi-Fi + Ethernet, 128GB storage", "price": 149.00, "quantity": 67},
        {"name": "AirTag (4 Pack)", "description": "Keep track of your keys, wallet, luggage, and more", "price": 99.00, "quantity": 180},
        {"name": "HomePod", "description": "High-fidelity audio, intelligent assistant", "price": 299.00, "quantity": 34},
        {"name": "Pro Display XDR", "description": "32-inch Retina 6K display, Nano-texture glass", "price": 5999.00, "quantity": 5},
        {"name": "Mac mini", "description": "M2 Pro, 10-core CPU, 16-core GPU, 16GB Memory", "price": 1299.00, "quantity": 45},
        {"name": "iPhone 15", "description": "A16 Bionic chip, 48MP main camera, 128GB Storage", "price": 799.00, "quantity": 150},
        {"name": "iPad Air", "description": "M1 chip, 10.9-inch Liquid Retina display, 64GB Storage", "price": 599.00, "quantity": 78},
        {"name": "Apple Pencil (2nd gen)", "description": "Pixel-perfect precision, wireless pairing and charging", "price": 129.00, "quantity": 110},
        {"name": "MagSafe Charger", "description": "Fast wireless charging up to 15W", "price": 39.00, "quantity": 300},
        {"name": "AirPods Max", "description": "High-fidelity audio, Active Noise Cancellation", "price": 549.00, "quantity": 25},
        {"name": "iMac 24-inch", "description": "M3 chip, 8-core CPU, 10-core GPU, 256GB storage", "price": 1499.00, "quantity": 38}
    ]

    prod_ids = []
    print("Creating products...")
    for p in products:
        res = requests.post(f"{BASE_URL}/products", json=p)
        if res.status_code == 200:
            prod_ids.append(res.json()['id'])

    # 2. Add realistic customers
    customers = [
        {"full_name": "Tim Cook", "email": "tcook@apple.com", "phone": "555-0101"},
        {"full_name": "Craig Federighi", "email": "craig@apple.com", "phone": "555-0102"},
        {"full_name": "Greg Joswiak", "email": "joz@apple.com", "phone": "555-0103"},
        {"full_name": "Eddy Cue", "email": "ecue@apple.com", "phone": "555-0104"},
        {"full_name": "Deirdre O'Brien", "email": "deirdre@apple.com", "phone": "555-0105"},
        {"full_name": "John Ternus", "email": "jternus@apple.com", "phone": "555-0106"},
        {"full_name": "Johny Srouji", "email": "jsrouji@apple.com", "phone": "555-0107"},
        {"full_name": "Sabih Khan", "email": "skhan@apple.com", "phone": "555-0108"},
        {"full_name": "Arthur Levinson", "email": "alevinson@apple.com", "phone": "555-0109"},
        {"full_name": "Luca Maestri", "email": "lmaestri@apple.com", "phone": "555-0110"}
    ]

    cust_ids = []
    print("Creating customers...")
    for c in customers:
        res = requests.post(f"{BASE_URL}/customers", json=c)
        if res.status_code == 200:
            cust_ids.append(res.json()['id'])

    # 3. Add realistic orders to generate the Revenue flow chart
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
        
        requests.post(f"{BASE_URL}/orders", json={"customer_id": c_id, "items": final_items})

    print("Seeding complete!")

if __name__ == '__main__':
    seed()
