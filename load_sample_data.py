#!/usr/bin/env python3
"""
Sample Data Loader for Enterprise Sales AI
Loads 10 products and 100 sales entries for testing ML and AI features
"""

import requests
import random
from datetime import datetime, timedelta
import json
import sys

# Configuration
API_URL = "http://localhost:3001/api"
EMAIL = "admin@example.com"
PASSWORD = "Admin123!"

# ANSI color codes for pretty output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_success(message):
    print(f"{GREEN}✓{RESET} {message}")

def print_error(message):
    print(f"{RED}✗{RESET} {message}")

def print_info(message):
    print(f"{BLUE}ℹ{RESET} {message}")

def print_warning(message):
    print(f"{YELLOW}⚠{RESET} {message}")

def login():
    """Login and get JWT token"""
    try:
        response = requests.post(f"{API_URL}/auth/login", json={
            "email": EMAIL,
            "password": PASSWORD
        }, timeout=10)
        
        if response.status_code == 200:
            return response.json()["access_token"]
        else:
            print_error(f"Login failed: {response.status_code}")
            print_info("Make sure you've created a user account first!")
            print_info(f"Email: {EMAIL}, Password: {PASSWORD}")
            sys.exit(1)
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to API. Is the backend running?")
        print_info("Start backend with: pnpm --filter api start:dev")
        sys.exit(1)
    except Exception as e:
        print_error(f"Login error: {str(e)}")
        sys.exit(1)

def create_products(token):
    """Create 10 sample products"""
    headers = {"Authorization": f"Bearer {token}"}
    
    products = [
        {
            "name": "Dell XPS 15 Laptop",
            "description": "High-performance laptop for professionals with Intel i7, 16GB RAM, 512GB SSD",
            "price": 1299.99,
            "category": "Electronics",
            "stock": 50
        },
        {
            "name": "Logitech MX Master 3",
            "description": "Ergonomic wireless mouse with precision scrolling and customizable buttons",
            "price": 99.99,
            "category": "Electronics",
            "stock": 150
        },
        {
            "name": "Herman Miller Aeron Chair",
            "description": "Premium ergonomic office chair with lumbar support and adjustable features",
            "price": 1395.00,
            "category": "Furniture",
            "stock": 30
        },
        {
            "name": "BenQ ScreenBar LED Lamp",
            "description": "Monitor-mounted LED desk lamp with auto-dimming and color temperature control",
            "price": 109.99,
            "category": "Furniture",
            "stock": 80
        },
        {
            "name": "Keychron K8 Keyboard",
            "description": "Wireless mechanical keyboard with hot-swappable switches and RGB backlight",
            "price": 89.99,
            "category": "Electronics",
            "stock": 120
        },
        {
            "name": "LG 27-inch 4K Monitor",
            "description": "4K UHD IPS monitor with HDR10 support and USB-C connectivity",
            "price": 449.99,
            "category": "Electronics",
            "stock": 60
        },
        {
            "name": "Uplift V2 Standing Desk",
            "description": "Electric height-adjustable standing desk with memory presets",
            "price": 799.00,
            "category": "Furniture",
            "stock": 25
        },
        {
            "name": "Logitech C920 HD Webcam",
            "description": "Full HD 1080p webcam with auto-focus and stereo audio",
            "price": 79.99,
            "category": "Electronics",
            "stock": 100
        },
        {
            "name": "Sony WH-1000XM5 Headphones",
            "description": "Industry-leading noise-cancelling wireless headphones with 30-hour battery",
            "price": 399.99,
            "category": "Electronics",
            "stock": 75
        },
        {
            "name": "Moleskine Classic Notebook",
            "description": "Large ruled notebook with elastic closure and ribbon bookmark",
            "price": 19.99,
            "category": "Stationery",
            "stock": 200
        }
    ]
    
    product_ids = []
    print_info(f"Creating {len(products)} products...")
    
    for i, product in enumerate(products, 1):
        try:
            response = requests.post(
                f"{API_URL}/products",
                json=product,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 201:
                product_data = response.json()
                product_ids.append({
                    "id": product_data["_id"],
                    "name": product["name"],
                    "price": product["price"]
                })
                print_success(f"[{i}/{len(products)}] {product['name']}")
            else:
                print_error(f"[{i}/{len(products)}] Failed: {product['name']} - {response.status_code}")
        except Exception as e:
            print_error(f"[{i}/{len(products)}] Error: {product['name']} - {str(e)}")
    
    return product_ids

def create_sales(token, products):
    """Create 100 sample sales entries spanning last 90 days"""
    headers = {"Authorization": f"Bearer {token}"}
    
    start_date = datetime.now() - timedelta(days=90)
    
    print_info(f"Creating 100 sales entries (last 90 days)...")
    
    success_count = 0
    
    for i in range(100):
        # Random product (weighted towards electronics)
        if random.random() < 0.7:  # 70% electronics
            product = random.choice([p for p in products if "Electronics" in p.get("category", "")])
        else:
            product = random.choice(products)
        
        # Random quantity (weighted towards smaller quantities)
        quantity = random.choices(
            [1, 2, 3, 4, 5, 10],
            weights=[40, 25, 15, 10, 5, 5]
        )[0]
        
        # Calculate total
        total = round(product["price"] * quantity, 2)
        
        # Random date in last 90 days (weighted towards recent dates)
        days_ago = int(random.triangular(0, 90, 10))  # More recent sales
        sale_date = start_date + timedelta(
            days=days_ago,
            hours=random.randint(8, 18),
            minutes=random.randint(0, 59)
        )
        
        # Random customer notes
        notes_options = [
            "",
            "Repeat customer",
            "Corporate order",
            "Bulk discount applied",
            "Express shipping",
            "Gift wrap requested",
            "First-time buyer",
            "Referral customer"
        ]
        
        sale = {
            "productId": product["id"],
            "productName": product["name"],
            "quantity": quantity,
            "price": product["price"],
            "totalAmount": total,
            "saleDate": sale_date.isoformat() + "Z",
            "customerId": f"CUST{str(random.randint(1, 50)).zfill(3)}",
            "notes": random.choice(notes_options)
        }
        
        try:
            response = requests.post(
                f"{API_URL}/sales",
                json=sale,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 201:
                success_count += 1
                if (i + 1) % 10 == 0:  # Print every 10 sales
                    print_success(f"[{i+1}/100] Created {success_count} sales entries")
            else:
                print_error(f"[{i+1}/100] Failed - {response.status_code}")
        except Exception as e:
            print_error(f"[{i+1}/100] Error - {str(e)}")
    
    return success_count

def verify_data(token):
    """Verify data was loaded correctly"""
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # Check products
        products_response = requests.get(f"{API_URL}/products", headers=headers, timeout=10)
        products_count = len(products_response.json()) if products_response.status_code == 200 else 0
        
        # Check sales
        sales_response = requests.get(f"{API_URL}/sales", headers=headers, timeout=10)
        sales_count = len(sales_response.json()) if sales_response.status_code == 200 else 0
        
        return products_count, sales_count
    except Exception as e:
        print_warning(f"Could not verify data: {str(e)}")
        return 0, 0

def main():
    """Main execution"""
    print("\n" + "="*60)
    print("  Enterprise Sales AI - Sample Data Loader")
    print("="*60 + "\n")
    
    print_info("This script will load:")
    print("  • 10 products (Electronics, Furniture, Stationery)")
    print("  • 100 sales entries (spanning last 90 days)")
    print()
    
    # Step 1: Login
    print("Step 1: Authenticating...")
    token = login()
    print_success("Logged in successfully\n")
    
    # Step 2: Create products
    print("Step 2: Creating products...")
    products = create_products(token)
    print_success(f"Created {len(products)} products\n")
    
    if len(products) == 0:
        print_error("No products created. Exiting.")
        sys.exit(1)
    
    # Step 3: Create sales
    print("Step 3: Creating sales entries...")
    sales_count = create_sales(token, products)
    print_success(f"Created {sales_count} sales entries\n")
    
    # Step 4: Verify
    print("Step 4: Verifying data...")
    products_count, sales_count_verify = verify_data(token)
    print_success(f"Database contains {products_count} products and {sales_count_verify} sales\n")
    
    # Summary
    print("="*60)
    print("  🎉 Data Load Complete!")
    print("="*60)
    print(f"  Products: {products_count}")
    print(f"  Sales: {sales_count_verify}")
    print(f"  Date Range: Last 90 days")
    print("="*60 + "\n")
    
    print_info("Next steps:")
    print("  1. Open http://localhost:3000")
    print("  2. Login with your credentials")
    print("  3. Navigate to Forecast page")
    print("  4. Generate forecast for any product")
    print("  5. Try AI insights: 'Analyze my sales performance'")
    print()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n")
        print_warning("Interrupted by user")
        sys.exit(0)
    except Exception as e:
        print("\n")
        print_error(f"Unexpected error: {str(e)}")
        sys.exit(1)
