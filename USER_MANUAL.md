# Enterprise Sales AI - Complete User Manual

## Table of Contents
1. [Getting Started](#getting-started)
2. [Initial Setup](#initial-setup)
3. [Loading Sample Data](#loading-sample-data)
4. [Using the Application](#using-the-application)
5. [Testing ML Features](#testing-ml-features)
6. [Testing Agentic AI](#testing-agentic-ai)
7. [Advanced Features](#advanced-features)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites Checklist

Before starting, ensure you have:
- [ ] Node.js 18+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Python 3.10+ installed
- [ ] MongoDB installed or Docker
- [ ] Ollama installed (optional, for AI features)
- [ ] Git installed

### Installation Steps

#### Step 1: Clone and Install Dependencies

```bash
# Navigate to project directory
cd enterprise-sales-ai

# Install all dependencies
pnpm install

# Install Python dependencies
cd apps/ml-service
pip install -r requirements.txt
cd ../..
```

**Expected output:**
```
✓ All dependencies installed successfully
```

#### Step 2: Setup Environment Variables

```bash
# Copy example environment file
copy .env.example .env
```

**Edit `.env` file:**
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/enterprise-sales-ai

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000

# Backend
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d
NODE_ENV=development
PORT=3001

# ML Service
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
AI_MODEL_URL=http://localhost:11434
AI_MODEL_NAME=llama2
```


#### Step 3: Start MongoDB

**Option A - Using Docker (Recommended):**
```bash
# Start MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B - Using Docker Compose:**
```bash
cd infrastructure
docker-compose up -d mongodb
cd ..
```

**Option C - Local MongoDB:**
```bash
# Windows: Start MongoDB service
net start MongoDB

# Mac: Start MongoDB
brew services start mongodb-community

# Linux: Start MongoDB
sudo systemctl start mongod
```

**Verify MongoDB is running:**
```bash
# Test connection
mongosh mongodb://localhost:27017/enterprise-sales-ai
```

You should see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://localhost:27017/enterprise-sales-ai
Using MongoDB: 7.0.x
```

Type `exit` to close mongosh.

#### Step 4: Start Ollama (Optional - for AI features)

**Install Ollama:**
- Windows: Download from [ollama.ai](https://ollama.ai)
- Mac: `brew install ollama`
- Linux: `curl https://ollama.ai/install.sh | sh`

**Start Ollama and pull model:**
```bash
# Start Ollama server (in a new terminal)
ollama serve

# In another terminal, pull Llama 2 model
ollama pull llama2
```

**Verify Ollama is running:**
```bash
curl http://localhost:11434/api/tags
```

You should see a JSON response with available models.


#### Step 5: Start All Services

You need **3 terminals** open:

**Terminal 1 - Frontend:**
```bash
pnpm --filter web dev
```

Wait for:
```
✓ Ready on http://localhost:3000
```

**Terminal 2 - Backend API:**
```bash
pnpm --filter api start:dev
```

Wait for:
```
[Nest] Application successfully started
[Nest] Listening on http://localhost:3001
```

**Terminal 3 - ML Service:**
```bash
cd apps/ml-service
python -m uvicorn main:app --reload --port 8000
```

**Windows alternative:**
```bash
cd apps/ml-service
py -3.12 -m uvicorn main:app --reload --port 8000
```

Wait for:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

#### Step 6: Verify All Services

Open your browser and check:

| Service | URL | Expected Response |
|---------|-----|-------------------|
| Frontend | http://localhost:3000 | Application homepage |
| API | http://localhost:3001/api | API info JSON |
| API Docs | http://localhost:3001/api/docs | Swagger UI |
| ML Service | http://localhost:8000 | ML service info JSON |
| ML Docs | http://localhost:8000/docs | FastAPI docs |

**All services running?** ✅ You're ready to proceed!

---

## Initial Setup

### Step 1: Create Your First User Account

1. Open browser: http://localhost:3000
2. Click **"Sign Up"** or **"Register"**
3. Fill in registration form:
   - **Email:** admin@example.com
   - **Password:** Admin123!
   - **Name:** Admin User
4. Click **"Register"**

**Expected result:** You should be redirected to the dashboard or login page.

### Step 2: Login

1. If not automatically logged in, click **"Login"**
2. Enter credentials:
   - **Email:** admin@example.com
   - **Password:** Admin123!
3. Click **"Login"**

**Expected result:** You should see the main dashboard.


---

## Loading Sample Data

### Method 1: Using API (Recommended)

We'll use the API documentation to load sample data.

#### Step 1: Open API Documentation

Open: http://localhost:3001/api/docs

You should see Swagger UI with all available endpoints.

#### Step 2: Authenticate

1. Click **"Authorize"** button (top right)
2. Login to get JWT token:
   - Go to **POST /auth/login**
   - Click **"Try it out"**
   - Enter:
     ```json
     {
       "email": "admin@example.com",
       "password": "Admin123!"
     }
     ```
   - Click **"Execute"**
   - Copy the `access_token` from response

3. Paste token in Authorization dialog:
   - Format: `Bearer YOUR_TOKEN_HERE`
   - Click **"Authorize"**
   - Click **"Close"**

#### Step 3: Add 10 Products

Go to **POST /products** endpoint and add these products one by one:

**Product 1: Laptop**
```json
{
  "name": "Dell XPS 15 Laptop",
  "description": "High-performance laptop for professionals",
  "price": 1299.99,
  "category": "Electronics",
  "stock": 50
}
```

**Product 2: Wireless Mouse**
```json
{
  "name": "Logitech MX Master 3",
  "description": "Ergonomic wireless mouse",
  "price": 99.99,
  "category": "Electronics",
  "stock": 150
}
```

**Product 3: Office Chair**
```json
{
  "name": "Herman Miller Aeron Chair",
  "description": "Premium ergonomic office chair",
  "price": 1395.00,
  "category": "Furniture",
  "stock": 30
}
```

**Product 4: Desk Lamp**
```json
{
  "name": "BenQ ScreenBar LED Lamp",
  "description": "Monitor-mounted LED desk lamp",
  "price": 109.99,
  "category": "Furniture",
  "stock": 80
}
```

**Product 5: Mechanical Keyboard**
```json
{
  "name": "Keychron K8 Keyboard",
  "description": "Wireless mechanical keyboard",
  "price": 89.99,
  "category": "Electronics",
  "stock": 120
}
```


**Product 6: Monitor**
```json
{
  "name": "LG 27-inch 4K Monitor",
  "description": "4K UHD IPS monitor",
  "price": 449.99,
  "category": "Electronics",
  "stock": 60
}
```

**Product 7: Standing Desk**
```json
{
  "name": "Uplift V2 Standing Desk",
  "description": "Electric height-adjustable desk",
  "price": 799.00,
  "category": "Furniture",
  "stock": 25
}
```

**Product 8: Webcam**
```json
{
  "name": "Logitech C920 HD Webcam",
  "description": "Full HD 1080p webcam",
  "price": 79.99,
  "category": "Electronics",
  "stock": 100
}
```

**Product 9: Headphones**
```json
{
  "name": "Sony WH-1000XM5 Headphones",
  "description": "Noise-cancelling wireless headphones",
  "price": 399.99,
  "category": "Electronics",
  "stock": 75
}
```

**Product 10: Notebook**
```json
{
  "name": "Moleskine Classic Notebook",
  "description": "Large ruled notebook",
  "price": 19.99,
  "category": "Stationery",
  "stock": 200
}
```

**After adding each product:**
- Click **"Try it out"**
- Paste the JSON
- Click **"Execute"**
- Verify response code is **201 Created**
- **Copy the `_id` from each response** - you'll need these for sales entries!

**Save your Product IDs:**
```
Product 1 (Laptop): _id_here
Product 2 (Mouse): _id_here
Product 3 (Chair): _id_here
Product 4 (Lamp): _id_here
Product 5 (Keyboard): _id_here
Product 6 (Monitor): _id_here
Product 7 (Desk): _id_here
Product 8 (Webcam): _id_here
Product 9 (Headphones): _id_here
Product 10 (Notebook): _id_here
```


#### Step 4: Add 100 Sales Entries

Now we'll add sales data spanning the last 90 days to test ML forecasting.

Go to **POST /sales** endpoint and add these sales entries.

**Important:** Replace `PRODUCT_ID_HERE` with actual product IDs from Step 3.

**Sales Entries (Days 1-10):**

```json
{
  "productId": "LAPTOP_ID",
  "productName": "Dell XPS 15 Laptop",
  "quantity": 2,
  "price": 1299.99,
  "totalAmount": 2599.98,
  "saleDate": "2025-11-17T10:30:00Z",
  "customerId": "CUST001",
  "notes": "Corporate order"
}
```

```json
{
  "productId": "MOUSE_ID",
  "productName": "Logitech MX Master 3",
  "quantity": 5,
  "price": 99.99,
  "totalAmount": 499.95,
  "saleDate": "2025-11-17T14:20:00Z",
  "customerId": "CUST002"
}
```

```json
{
  "productId": "CHAIR_ID",
  "productName": "Herman Miller Aeron Chair",
  "quantity": 1,
  "price": 1395.00,
  "totalAmount": 1395.00,
  "saleDate": "2025-11-18T09:15:00Z",
  "customerId": "CUST003"
}
```

```json
{
  "productId": "KEYBOARD_ID",
  "productName": "Keychron K8 Keyboard",
  "quantity": 3,
  "price": 89.99,
  "totalAmount": 269.97,
  "saleDate": "2025-11-18T11:45:00Z",
  "customerId": "CUST004"
}
```

```json
{
  "productId": "MONITOR_ID",
  "productName": "LG 27-inch 4K Monitor",
  "quantity": 2,
  "price": 449.99,
  "totalAmount": 899.98,
  "saleDate": "2025-11-19T13:30:00Z",
  "customerId": "CUST005"
}
```

```json
{
  "productId": "NOTEBOOK_ID",
  "productName": "Moleskine Classic Notebook",
  "quantity": 10,
  "price": 19.99,
  "totalAmount": 199.90,
  "saleDate": "2025-11-19T15:00:00Z",
  "customerId": "CUST006"
}
```

```json
{
  "productId": "WEBCAM_ID",
  "productName": "Logitech C920 HD Webcam",
  "quantity": 4,
  "price": 79.99,
  "totalAmount": 319.96,
  "saleDate": "2025-11-20T10:00:00Z",
  "customerId": "CUST007"
}
```

```json
{
  "productId": "HEADPHONES_ID",
  "productName": "Sony WH-1000XM5 Headphones",
  "quantity": 2,
  "price": 399.99,
  "totalAmount": 799.98,
  "saleDate": "2025-11-20T16:30:00Z",
  "customerId": "CUST008"
}
```

```json
{
  "productId": "LAMP_ID",
  "productName": "BenQ ScreenBar LED Lamp",
  "quantity": 3,
  "price": 109.99,
  "totalAmount": 329.97,
  "saleDate": "2025-11-21T12:00:00Z",
  "customerId": "CUST009"
}
```

```json
{
  "productId": "DESK_ID",
  "productName": "Uplift V2 Standing Desk",
  "quantity": 1,
  "price": 799.00,
  "totalAmount": 799.00,
  "saleDate": "2025-11-21T14:45:00Z",
  "customerId": "CUST010"
}
```


**Continue adding more sales entries with varying dates...**

**Pro Tip:** To speed up data entry, I'll provide a Python script to generate and insert 100 sales entries automatically.

### Method 2: Using Python Script (Faster)

Create a file `load_sample_data.py` in the project root:

```python
import requests
import random
from datetime import datetime, timedelta
import json

# Configuration
API_URL = "http://localhost:3001/api"
EMAIL = "admin@example.com"
PASSWORD = "Admin123!"

# Step 1: Login and get token
def login():
    response = requests.post(f"{API_URL}/auth/login", json={
        "email": EMAIL,
        "password": PASSWORD
    })
    return response.json()["access_token"]

# Step 2: Create products
def create_products(token):
    headers = {"Authorization": f"Bearer {token}"}
    
    products = [
        {"name": "Dell XPS 15 Laptop", "description": "High-performance laptop", "price": 1299.99, "category": "Electronics", "stock": 50},
        {"name": "Logitech MX Master 3", "description": "Ergonomic wireless mouse", "price": 99.99, "category": "Electronics", "stock": 150},
        {"name": "Herman Miller Aeron Chair", "description": "Premium ergonomic chair", "price": 1395.00, "category": "Furniture", "stock": 30},
        {"name": "BenQ ScreenBar LED Lamp", "description": "Monitor-mounted lamp", "price": 109.99, "category": "Furniture", "stock": 80},
        {"name": "Keychron K8 Keyboard", "description": "Wireless mechanical keyboard", "price": 89.99, "category": "Electronics", "stock": 120},
        {"name": "LG 27-inch 4K Monitor", "description": "4K UHD IPS monitor", "price": 449.99, "category": "Electronics", "stock": 60},
        {"name": "Uplift V2 Standing Desk", "description": "Electric height-adjustable desk", "price": 799.00, "category": "Furniture", "stock": 25},
        {"name": "Logitech C920 HD Webcam", "description": "Full HD 1080p webcam", "price": 79.99, "category": "Electronics", "stock": 100},
        {"name": "Sony WH-1000XM5 Headphones", "description": "Noise-cancelling headphones", "price": 399.99, "category": "Electronics", "stock": 75},
        {"name": "Moleskine Classic Notebook", "description": "Large ruled notebook", "price": 19.99, "category": "Stationery", "stock": 200}
    ]
    
    product_ids = []
    for product in products:
        response = requests.post(f"{API_URL}/products", json=product, headers=headers)
        if response.status_code == 201:
            product_data = response.json()
            product_ids.append({
                "id": product_data["_id"],
                "name": product["name"],
                "price": product["price"]
            })
            print(f"✓ Created: {product['name']}")
        else:
            print(f"✗ Failed: {product['name']}")
    
    return product_ids

# Step 3: Create 100 sales entries
def create_sales(token, products):
    headers = {"Authorization": f"Bearer {token}"}
    
    start_date = datetime.now() - timedelta(days=90)
    
    for i in range(100):
        # Random product
        product = random.choice(products)
        
        # Random quantity (weighted towards smaller quantities)
        quantity = random.choices([1, 2, 3, 4, 5, 10], weights=[40, 25, 15, 10, 5, 5])[0]
        
        # Calculate total
        total = round(product["price"] * quantity, 2)
        
        # Random date in last 90 days
        days_ago = random.randint(0, 90)
        sale_date = start_date + timedelta(days=days_ago, hours=random.randint(8, 18))
        
        sale = {
            "productId": product["id"],
            "productName": product["name"],
            "quantity": quantity,
            "price": product["price"],
            "totalAmount": total,
            "saleDate": sale_date.isoformat() + "Z",
            "customerId": f"CUST{str(i+1).zfill(3)}",
            "notes": random.choice(["", "Repeat customer", "Corporate order", "Bulk discount applied", ""])
        }
        
        response = requests.post(f"{API_URL}/sales", json=sale, headers=headers)
        if response.status_code == 201:
            print(f"✓ Sale {i+1}/100: {product['name']} x{quantity} on {sale_date.strftime('%Y-%m-%d')}")
        else:
            print(f"✗ Failed sale {i+1}/100")
    
    print("\n✅ All 100 sales entries created!")

# Main execution
if __name__ == "__main__":
    print("🚀 Starting data load...\n")
    
    print("Step 1: Logging in...")
    token = login()
    print("✓ Logged in successfully\n")
    
    print("Step 2: Creating 10 products...")
    products = create_products(token)
    print(f"✓ Created {len(products)} products\n")
    
    print("Step 3: Creating 100 sales entries...")
    create_sales(token, products)
    
    print("\n🎉 Data load complete!")
    print(f"   - 10 products created")
    print(f"   - 100 sales entries created")
    print(f"   - Date range: Last 90 days")
```

**Run the script:**
```bash
# Install requests library if needed
pip install requests

# Run the script
python load_sample_data.py
```

**Expected output:**
```
🚀 Starting data load...

Step 1: Logging in...
✓ Logged in successfully

Step 2: Creating 10 products...
✓ Created: Dell XPS 15 Laptop
✓ Created: Logitech MX Master 3
...
✓ Created 10 products

Step 3: Creating 100 sales entries...
✓ Sale 1/100: Dell XPS 15 Laptop x2 on 2025-11-17
✓ Sale 2/100: Logitech MX Master 3 x5 on 2025-11-18
...
✓ Sale 100/100: Moleskine Classic Notebook x10 on 2026-02-14

✅ All 100 sales entries created!
```


---

## Using the Application

### Dashboard Overview

After logging in, you'll see the main dashboard with:

1. **Sales Overview**
   - Total sales amount
   - Number of transactions
   - Average order value
   - Sales trend chart

2. **Top Products**
   - Best-selling products
   - Revenue by product
   - Stock levels

3. **Recent Activity**
   - Latest sales transactions
   - Low stock alerts
   - System notifications

### Managing Products

#### View All Products

1. Navigate to **Products** page (sidebar or menu)
2. You'll see a table with all products:
   - Name
   - Category
   - Price
   - Stock level
   - Actions (Edit, Delete)

#### Add New Product

1. Click **"Add Product"** button
2. Fill in the form:
   - **Name:** Product name
   - **Description:** Product details
   - **Price:** Product price (e.g., 99.99)
   - **Category:** Select or enter category
   - **Stock:** Initial stock quantity
3. Click **"Save"**

**Example:**
```
Name: USB-C Hub
Description: 7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader
Price: 49.99
Category: Electronics
Stock: 100
```

#### Edit Product

1. Click **"Edit"** icon next to product
2. Modify fields as needed
3. Click **"Update"**

#### Delete Product

1. Click **"Delete"** icon next to product
2. Confirm deletion
3. Product is removed from database

**Note:** You cannot delete products with existing sales records.


### Managing Sales

#### View Sales History

1. Navigate to **Sales** page
2. You'll see a table with all sales:
   - Date
   - Product name
   - Quantity
   - Price
   - Total amount
   - Customer ID
   - Actions

#### Filter Sales

Use filters to narrow down results:
- **Date range:** Select start and end dates
- **Product:** Filter by specific product
- **Customer:** Filter by customer ID
- **Amount range:** Min and max amount

**Example:**
```
Date range: Last 30 days
Product: Dell XPS 15 Laptop
Amount: $1000 - $5000
```

#### Add New Sale

1. Click **"Record Sale"** button
2. Fill in the form:
   - **Product:** Select from dropdown
   - **Quantity:** Number of units
   - **Customer ID:** Customer identifier (optional)
   - **Notes:** Additional information (optional)
3. Price and total are calculated automatically
4. Click **"Save"**

**Example:**
```
Product: Logitech MX Master 3
Quantity: 3
Customer ID: CUST123
Notes: Bulk order for office
```

#### Export Sales Data

1. Click **"Export"** button
2. Choose format:
   - CSV
   - Excel
   - PDF
3. File downloads automatically

### Inventory Management

#### View Inventory

1. Navigate to **Inventory** page
2. See current stock levels for all products
3. Color-coded alerts:
   - 🟢 Green: Healthy stock (>50 units)
   - 🟡 Yellow: Low stock (10-50 units)
   - 🔴 Red: Critical stock (<10 units)

#### Update Stock

1. Click **"Adjust Stock"** next to product
2. Enter adjustment:
   - **Add stock:** Positive number (e.g., +50)
   - **Remove stock:** Negative number (e.g., -10)
3. Add reason (optional)
4. Click **"Update"**

**Example:**
```
Product: Keychron K8 Keyboard
Adjustment: +100
Reason: New shipment received
```

#### Set Reorder Points

1. Click **"Settings"** icon next to product
2. Set **Reorder Point:** Minimum stock level
3. Set **Reorder Quantity:** How many to order
4. Enable **Auto-alert:** Get notified when stock is low
5. Click **"Save"**

**Example:**
```
Product: Logitech MX Master 3
Reorder Point: 20 units
Reorder Quantity: 100 units
Auto-alert: Enabled
```


---

## Testing ML Features

Now let's test the Machine Learning forecasting capabilities!

### Sales Forecasting

#### Step 1: Navigate to Forecast Page

1. Click **"Forecast"** in the sidebar/menu
2. You'll see the forecasting interface

#### Step 2: Generate Forecast

**Option A - Using the UI:**

1. Select **Product:** Choose "Dell XPS 15 Laptop"
2. Select **Forecast Period:** 30 days
3. Select **Model:** Prophet (recommended for time series)
4. Click **"Generate Forecast"**

**What happens:**
- Frontend sends request to Backend API
- Backend forwards to ML Service
- ML Service:
  1. Fetches historical sales data from MongoDB
  2. Preprocesses data (cleaning, feature engineering)
  3. Trains Prophet model on historical data
  4. Generates predictions for next 30 days
  5. Returns forecast with confidence intervals
- Results displayed in UI

**Expected output:**
- Line chart showing:
  - Historical sales (blue line)
  - Predicted sales (green line)
  - Confidence interval (shaded area)
- Table with daily predictions:
  - Date
  - Predicted quantity
  - Lower bound (pessimistic)
  - Upper bound (optimistic)
  - Confidence level

**Example forecast:**
```
Date         Predicted  Lower   Upper   Confidence
2026-02-16   2.3        1.8     2.8     95%
2026-02-17   2.5        2.0     3.0     95%
2026-02-18   2.1        1.6     2.6     95%
...
```


**Option B - Using API Directly:**

Open: http://localhost:8000/docs

1. Find **POST /api/v1/predictions/forecast**
2. Click **"Try it out"**
3. Enter request body:

```json
{
  "product_id": "YOUR_LAPTOP_PRODUCT_ID",
  "product_name": "Dell XPS 15 Laptop",
  "periods": 30,
  "model_type": "prophet"
}
```

4. Click **"Execute"**

**Expected response:**
```json
{
  "predictions": [
    {
      "date": "2026-02-16",
      "value": 2.3,
      "lower_bound": 1.8,
      "upper_bound": 2.8
    },
    {
      "date": "2026-02-17",
      "value": 2.5,
      "lower_bound": 2.0,
      "upper_bound": 3.0
    }
    // ... more predictions
  ],
  "model_type": "prophet",
  "confidence": 0.95,
  "metrics": {
    "mae": 0.45,
    "rmse": 0.62,
    "mape": 12.3
  }
}
```

#### Step 3: Interpret Results

**Understanding the forecast:**

1. **Predicted Value:** Most likely sales quantity
2. **Lower Bound:** Pessimistic scenario (5th percentile)
3. **Upper Bound:** Optimistic scenario (95th percentile)
4. **Confidence:** How confident the model is (95% = very confident)

**Metrics explained:**
- **MAE (Mean Absolute Error):** Average prediction error (lower is better)
- **RMSE (Root Mean Square Error):** Prediction accuracy (lower is better)
- **MAPE (Mean Absolute Percentage Error):** Error as percentage (lower is better)

**Good forecast indicators:**
- MAPE < 20%: Excellent
- MAPE 20-50%: Good
- MAPE > 50%: Poor (need more data)

#### Step 4: Test Different Models

Try different ML models to compare:

**Prophet Model:**
- Best for: Business time series with seasonality
- Strengths: Handles missing data, detects patterns
- Use when: You have at least 2-3 months of data

**XGBoost Model:**
- Best for: Complex patterns, multiple features
- Strengths: High accuracy, feature importance
- Use when: You have additional features (price, promotions, etc.)

**LSTM Model:**
- Best for: Long-term dependencies
- Strengths: Learns complex patterns
- Use when: You have lots of data (6+ months)

**To test XGBoost:**
```json
{
  "product_id": "YOUR_PRODUCT_ID",
  "product_name": "Product Name",
  "periods": 30,
  "model_type": "xgboost"
}
```


### Demand Prediction

#### Step 1: Navigate to Demand Prediction

1. Go to **Analytics** → **Demand Prediction**
2. Or use API: **POST /api/v1/predictions/demand**

#### Step 2: Predict Demand

**Using API:**

```json
{
  "product_id": "YOUR_PRODUCT_ID",
  "features": {
    "price": 99.99,
    "day_of_week": 1,
    "month": 2,
    "is_weekend": 0,
    "promotion": 0,
    "season": "winter"
  }
}
```

**Expected response:**
```json
{
  "predicted_demand": 3.2,
  "confidence": 0.87,
  "feature_importance": {
    "price": 0.35,
    "day_of_week": 0.15,
    "month": 0.25,
    "promotion": 0.20,
    "season": 0.05
  }
}
```

**Interpretation:**
- **Predicted demand:** 3.2 units expected to sell
- **Confidence:** 87% confident in prediction
- **Feature importance:** Price has biggest impact (35%)

#### Step 3: Batch Predictions

Predict demand for multiple products at once:

**Using API: POST /api/v1/predictions/batch**

```json
{
  "products": [
    {
      "product_id": "LAPTOP_ID",
      "features": {"price": 1299.99, "day_of_week": 1}
    },
    {
      "product_id": "MOUSE_ID",
      "features": {"price": 99.99, "day_of_week": 1}
    }
  ]
}
```

**Expected response:**
```json
{
  "predictions": [
    {
      "product_id": "LAPTOP_ID",
      "product_name": "Dell XPS 15 Laptop",
      "predicted_demand": 2.1
    },
    {
      "product_id": "MOUSE_ID",
      "product_name": "Logitech MX Master 3",
      "predicted_demand": 4.5
    }
  ]
}
```

### Model Training

#### Step 1: Train Custom Model

**Using API: POST /api/v1/training/train**

```json
{
  "model_type": "prophet",
  "product_id": "YOUR_PRODUCT_ID",
  "training_params": {
    "test_size": 0.2,
    "validation_split": 0.1
  }
}
```

**What happens:**
1. Fetches all historical data for product
2. Splits into training (80%) and test (20%) sets
3. Trains model on training data
4. Evaluates on test data
5. Saves model if performance is good
6. Returns metrics

**Expected response:**
```json
{
  "model_id": "model_abc123",
  "model_type": "prophet",
  "training_metrics": {
    "mae": 0.42,
    "rmse": 0.58,
    "mape": 11.5,
    "r2_score": 0.89
  },
  "test_metrics": {
    "mae": 0.45,
    "rmse": 0.62,
    "mape": 12.3,
    "r2_score": 0.87
  },
  "training_time": "2.3s",
  "status": "success"
}
```

**Good model indicators:**
- R² score > 0.8: Excellent
- R² score 0.6-0.8: Good
- R² score < 0.6: Poor (need more data or different model)


#### Step 2: Evaluate Model Performance

**Using API: GET /api/v1/training/evaluate/{model_id}**

```bash
curl http://localhost:8000/api/v1/training/evaluate/model_abc123
```

**Expected response:**
```json
{
  "model_id": "model_abc123",
  "model_type": "prophet",
  "metrics": {
    "accuracy": 0.87,
    "precision": 0.85,
    "recall": 0.89,
    "f1_score": 0.87
  },
  "confusion_matrix": [[45, 5], [3, 47]],
  "feature_importance": {
    "trend": 0.45,
    "seasonality": 0.35,
    "holidays": 0.20
  }
}
```

### Understanding ML Results

#### Forecast Accuracy

**How to know if forecast is good:**

1. **Visual inspection:**
   - Does the forecast follow historical trends?
   - Are there unrealistic spikes or drops?
   - Does seasonality make sense?

2. **Metrics:**
   - MAPE < 10%: Excellent
   - MAPE 10-20%: Good
   - MAPE 20-50%: Acceptable
   - MAPE > 50%: Poor

3. **Confidence intervals:**
   - Narrow intervals = more confident
   - Wide intervals = less confident
   - Check if actual values fall within intervals

#### Common Issues

**Issue 1: Poor accuracy (MAPE > 50%)**
- **Cause:** Not enough data
- **Solution:** Collect more historical data (at least 60 days)

**Issue 2: Unrealistic predictions**
- **Cause:** Outliers in data
- **Solution:** Clean data, remove anomalies

**Issue 3: Model takes too long**
- **Cause:** Too much data or complex model
- **Solution:** Use simpler model or reduce data size

**Issue 4: Predictions are flat**
- **Cause:** No patterns in data
- **Solution:** Check if data has trends/seasonality


---

## Testing Agentic AI

Now let's test the AI agent that can reason and provide insights!

### Prerequisites

**Ensure Ollama is running:**
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not running, start it
ollama serve

# Verify model is available
ollama list
```

You should see `llama2` in the list.

### AI Query Interface

#### Step 1: Navigate to AI Insights

1. Click **"AI Insights"** in the sidebar/menu
2. You'll see a chat-like interface

#### Step 2: Ask Questions

The AI agent can answer questions about your sales data and provide recommendations.

**Example Query 1: Sales Forecast**

**You ask:**
```
What will be the sales forecast for Dell XPS 15 Laptop for the next month?
```

**What happens:**
1. Frontend sends query to Backend API
2. Backend forwards to ML Service AI endpoint
3. AI Agent:
   - Classifies intent: "forecast"
   - Selects Forecast Tool
   - Fetches historical data
   - Runs Prophet model
   - Generates forecast
   - Uses LLM to explain results
4. Returns natural language response

**AI responds:**
```
Based on historical sales data analysis, here's the forecast for Dell XPS 15 Laptop 
for the next 30 days:

📊 Forecast Summary:
- Average daily sales: 2.3 units
- Total monthly sales: ~69 units
- Trend: Slightly increasing (+5%)

📈 Key Insights:
1. Sales peak on Mondays and Tuesdays (corporate purchases)
2. Weekend sales are 40% lower
3. End-of-month spike expected (budget cycles)

💡 Recommendations:
1. Maintain stock of at least 80 units to handle demand
2. Consider promotions on weekends to boost sales
3. Prepare for 15% increase in last week of month

⚠️ Risk Factors:
- New competitor product launch may impact sales
- Economic uncertainty could reduce corporate spending

Confidence Level: 87%
Model Used: Prophet
Data Range: Last 90 days
```


**Example Query 2: Sales Analysis**

**You ask:**
```
Analyze my sales performance for the last month. What products are doing well?
```

**AI responds:**
```
📊 Sales Performance Analysis (Last 30 Days)

🏆 Top Performers:
1. Dell XPS 15 Laptop - $25,999.80 (20 units)
   - 35% of total revenue
   - Average order: 2 units
   - Trend: ↗️ Growing (+12%)

2. Herman Miller Aeron Chair - $13,950.00 (10 units)
   - 23% of total revenue
   - High-value item
   - Trend: → Stable

3. Sony WH-1000XM5 Headphones - $7,999.80 (20 units)
   - 13% of total revenue
   - Popular accessory
   - Trend: ↗️ Growing (+8%)

📉 Underperformers:
1. Uplift V2 Standing Desk - $2,397.00 (3 units)
   - Only 4% of revenue
   - High price may be barrier
   - Recommendation: Consider promotion

2. BenQ ScreenBar LED Lamp - $1,099.90 (10 units)
   - Low volume despite good price
   - Recommendation: Bundle with monitors

💰 Financial Summary:
- Total Revenue: $74,523.50
- Average Order Value: $745.24
- Total Transactions: 100
- Growth vs Previous Month: +15%

🎯 Key Insights:
1. Electronics dominate (78% of revenue)
2. Corporate customers drive laptop sales
3. Accessory bundles perform well
4. Weekend sales need improvement

💡 Actionable Recommendations:
1. Create laptop + accessories bundle (save 10%)
2. Launch weekend promotion campaign
3. Increase standing desk visibility
4. Stock up on top 3 products
5. Consider loyalty program for repeat customers

Would you like me to dive deeper into any specific product or metric?
```

**Example Query 3: Inventory Recommendations**

**You ask:**
```
Which products should I restock and how much?
```

**AI responds:**
```
📦 Inventory Restock Recommendations

🔴 URGENT - Restock Immediately:

1. Herman Miller Aeron Chair
   - Current Stock: 20 units
   - Reorder Point: 30 units
   - Recommended Order: 50 units
   - Reason: High-value item, 10 units sold last month
   - Lead Time: 2-3 weeks
   - Priority: HIGH

2. Logitech MX Master 3
   - Current Stock: 125 units
   - Reorder Point: 150 units
   - Recommended Order: 100 units
   - Reason: Fast-moving item, 25 units sold last month
   - Lead Time: 1 week
   - Priority: MEDIUM

🟡 MONITOR - Restock Soon:

3. Dell XPS 15 Laptop
   - Current Stock: 30 units
   - Reorder Point: 50 units
   - Recommended Order: 40 units
   - Reason: Top seller, maintain buffer stock
   - Lead Time: 1-2 weeks
   - Priority: MEDIUM

4. Sony WH-1000XM5 Headphones
   - Current Stock: 55 units
   - Reorder Point: 75 units
   - Recommended Order: 50 units
   - Reason: Growing demand, seasonal trend
   - Lead Time: 1 week
   - Priority: LOW

🟢 HEALTHY - No Action Needed:

5. Moleskine Classic Notebook - 190 units (Excellent)
6. Logitech C920 HD Webcam - 96 units (Good)
7. Keychron K8 Keyboard - 117 units (Good)

📊 Restock Summary:
- Total Investment Needed: ~$72,000
- Expected ROI: 35% over 3 months
- Risk Level: Low (based on historical demand)

💡 Smart Ordering Strategy:
1. Order urgent items today
2. Negotiate bulk discount (10%+ for $50k+ order)
3. Stagger deliveries to manage cash flow
4. Set up auto-reorder for fast-moving items

Would you like me to generate a purchase order?
```


**Example Query 4: Pricing Strategy**

**You ask:**
```
Should I adjust prices for any products? What's the optimal pricing?
```

**AI responds:**
```
💰 Pricing Strategy Analysis

📊 Current Pricing Performance:

OVERPRICED (Consider Reduction):
1. Uplift V2 Standing Desk - $799.00
   - Market Average: $699
   - Sales Velocity: Low (3 units/month)
   - Recommendation: Reduce to $749 (-6%)
   - Expected Impact: +40% sales volume
   - Revenue Impact: +26% overall

UNDERPRICED (Opportunity):
2. Logitech MX Master 3 - $99.99
   - Market Average: $109
   - Sales Velocity: High (25 units/month)
   - Recommendation: Increase to $104.99 (+5%)
   - Expected Impact: -5% sales volume
   - Revenue Impact: +0% (neutral, but higher margin)

3. Sony WH-1000XM5 Headphones - $399.99
   - Market Average: $419
   - Sales Velocity: Good (20 units/month)
   - Recommendation: Increase to $409.99 (+2.5%)
   - Expected Impact: -2% sales volume
   - Revenue Impact: +0.5%

OPTIMALLY PRICED:
4. Dell XPS 15 Laptop - $1,299.99 ✓
5. Herman Miller Aeron Chair - $1,395.00 ✓
6. Keychron K8 Keyboard - $89.99 ✓

💡 Dynamic Pricing Recommendations:

1. Weekend Discounts:
   - Offer 5-10% off on Saturdays/Sundays
   - Target: Laptops, Monitors, Keyboards
   - Expected: +30% weekend sales

2. Bundle Pricing:
   - Laptop + Mouse + Keyboard: $1,449 (save $40)
   - Monitor + Lamp: $529 (save $30)
   - Expected: +15% bundle sales

3. Volume Discounts:
   - 3+ units: 5% off
   - 5+ units: 10% off
   - 10+ units: 15% off
   - Target: Corporate customers

4. Seasonal Adjustments:
   - Q1 (Jan-Mar): +5% on office furniture (tax season)
   - Q4 (Oct-Dec): -10% on electronics (holiday sales)

📈 Projected Impact:
- Revenue Increase: +12% annually
- Profit Margin: +3%
- Customer Satisfaction: +8%
- Competitive Position: Improved

⚠️ Important Considerations:
1. Monitor competitor pricing weekly
2. Test price changes on 1-2 products first
3. Communicate value, not just price
4. Maintain premium positioning for high-end items

Would you like me to create a detailed pricing plan for a specific product?
```


### Using AI via API

**Direct API access for AI queries:**

**Endpoint:** `POST http://localhost:8000/api/v1/ai/query`

**Request:**
```json
{
  "query": "What products should I focus on to maximize revenue?",
  "context": {
    "time_period": "last_30_days",
    "include_forecast": true
  }
}
```

**Response:**
```json
{
  "response": "Based on your sales data analysis...",
  "intent": "revenue_optimization",
  "tool_used": "data_analysis",
  "reasoning": "Agent analyzed sales patterns and identified high-margin opportunities",
  "confidence": 0.89,
  "recommendations": [
    {
      "action": "increase_stock",
      "product": "Dell XPS 15 Laptop",
      "reason": "High demand, high margin",
      "priority": "high"
    }
  ]
}
```

### AI Agent Capabilities

The AI agent can help with:

1. **Sales Forecasting**
   - Predict future sales
   - Identify trends
   - Seasonal patterns

2. **Data Analysis**
   - Sales performance
   - Product comparisons
   - Customer behavior

3. **Inventory Management**
   - Restock recommendations
   - Optimal stock levels
   - Dead stock identification

4. **Pricing Strategy**
   - Price optimization
   - Competitive analysis
   - Discount strategies

5. **Business Insights**
   - Revenue opportunities
   - Cost reduction
   - Growth strategies

6. **Anomaly Detection**
   - Unusual sales patterns
   - Fraud detection
   - Quality issues

### AI Agent Limitations

**What the AI cannot do:**

1. **Access external data** - Only uses your database
2. **Make actual changes** - Only provides recommendations
3. **Guarantee accuracy** - Predictions are probabilistic
4. **Real-time data** - Uses historical data only
5. **Complex reasoning** - Limited by model capabilities

**Best practices:**

1. **Be specific** - "Forecast laptop sales for March" vs "Tell me about sales"
2. **Provide context** - Include time periods, products, metrics
3. **Verify recommendations** - Always review AI suggestions
4. **Iterate** - Ask follow-up questions for clarity
5. **Combine with human judgment** - AI assists, you decide


---

## Advanced Features

### Custom Reports

#### Create Custom Report

1. Navigate to **Reports** → **Custom Reports**
2. Click **"Create Report"**
3. Configure report:
   - **Name:** Monthly Sales Summary
   - **Type:** Sales Analysis
   - **Date Range:** Last 30 days
   - **Metrics:** Revenue, Units Sold, Average Order Value
   - **Group By:** Product Category
   - **Filters:** None
4. Click **"Generate"**

**Example report output:**
```
Monthly Sales Summary - January 2026

Category: Electronics
- Revenue: $58,423.50 (78%)
- Units Sold: 78
- AOV: $749.02

Category: Furniture
- Revenue: $15,100.00 (20%)
- Units Sold: 14
- AOV: $1,078.57

Category: Stationery
- Revenue: $1,000.00 (2%)
- Units Sold: 50
- AOV: $20.00

Total Revenue: $74,523.50
Total Units: 142
Overall AOV: $524.80
```

#### Schedule Reports

1. Click **"Schedule"** on any report
2. Configure schedule:
   - **Frequency:** Daily, Weekly, Monthly
   - **Time:** 9:00 AM
   - **Recipients:** admin@example.com
   - **Format:** PDF, Excel, CSV
3. Click **"Save Schedule"**

Reports will be automatically generated and emailed.

### API Integration

#### Get API Key

1. Navigate to **Settings** → **API Keys**
2. Click **"Generate New Key"**
3. Enter key name: "Mobile App"
4. Set permissions:
   - Read Products: ✓
   - Write Products: ✗
   - Read Sales: ✓
   - Write Sales: ✓
5. Click **"Generate"**
6. Copy API key (shown only once!)

**Example API key:**
```
api_key_EXAMPLE_NOT_REAL_abc123def456ghi789
```

#### Use API Key

**In your application:**
```javascript
const axios = require('axios');

const API_URL = 'http://localhost:3001/api';
const API_KEY = 'api_key_EXAMPLE_NOT_REAL_abc123def456ghi789';

// Get all products
const products = await axios.get(`${API_URL}/products`, {
  headers: {
    'Authorization': `Bearer ${API_KEY}`
  }
});

console.log(products.data);
```

**In curl:**
```bash
curl -H "Authorization: Bearer api_key_EXAMPLE_NOT_REAL_abc123def456ghi789" \
  http://localhost:3001/api/products
```


### Webhooks

#### Setup Webhook

1. Navigate to **Settings** → **Webhooks**
2. Click **"Add Webhook"**
3. Configure:
   - **URL:** https://your-app.com/webhook
   - **Events:** 
     - ✓ sale.created
     - ✓ product.low_stock
     - ✓ forecast.completed
   - **Secret:** Generate or enter custom secret
4. Click **"Save"**

**Webhook payload example:**
```json
{
  "event": "sale.created",
  "timestamp": "2026-02-15T10:30:00Z",
  "data": {
    "sale_id": "sale_abc123",
    "product_id": "prod_xyz789",
    "product_name": "Dell XPS 15 Laptop",
    "quantity": 2,
    "total_amount": 2599.98,
    "customer_id": "CUST001"
  },
  "signature": "sha256=abc123..."
}
```

**Verify webhook signature:**
```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}
```

### Data Export/Import

#### Export Data

1. Navigate to **Settings** → **Data Management**
2. Click **"Export Data"**
3. Select data to export:
   - ✓ Products
   - ✓ Sales
   - ✓ Inventory
   - ✗ Users (privacy)
4. Choose format: CSV, JSON, Excel
5. Click **"Export"**

**Files downloaded:**
- `products_2026-02-15.csv`
- `sales_2026-02-15.csv`
- `inventory_2026-02-15.csv`

#### Import Data

1. Navigate to **Settings** → **Data Management**
2. Click **"Import Data"**
3. Select file type: Products, Sales, Inventory
4. Upload CSV/Excel file
5. Map columns:
   - File Column → Database Field
   - Name → name
   - Price → price
   - Stock → stock
6. Preview import (first 10 rows)
7. Click **"Import"**

**Import validation:**
- Checks for required fields
- Validates data types
- Detects duplicates
- Shows errors before import

### Backup & Restore

#### Create Backup

1. Navigate to **Settings** → **Backup**
2. Click **"Create Backup"**
3. Select what to backup:
   - ✓ Database (MongoDB)
   - ✓ ML Models
   - ✓ Configuration
4. Click **"Create"**

**Backup file:**
```
backup_2026-02-15_10-30-00.tar.gz
```

#### Restore from Backup

1. Navigate to **Settings** → **Backup**
2. Click **"Restore"**
3. Upload backup file
4. Confirm restoration (⚠️ This will overwrite current data!)
5. Click **"Restore"**

**Restoration process:**
- Stops services
- Restores database
- Restores ML models
- Restores configuration
- Restarts services


---

## Troubleshooting

### Common Issues

#### Issue 1: Cannot Login

**Symptoms:**
- "Invalid credentials" error
- Login button doesn't work
- Redirected back to login page

**Solutions:**

1. **Check credentials:**
   ```
   Email: admin@example.com
   Password: Admin123!
   ```

2. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete
   - Select "Cookies and other site data"
   - Click "Clear data"

3. **Check backend is running:**
   ```bash
   curl http://localhost:3001/api
   ```
   Should return JSON response.

4. **Reset password:**
   - Click "Forgot Password"
   - Enter email
   - Check email for reset link

5. **Create new user:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
   ```

#### Issue 2: Forecast Not Working

**Symptoms:**
- "Error generating forecast"
- Forecast shows no data
- ML service timeout

**Solutions:**

1. **Check ML service is running:**
   ```bash
   curl http://localhost:8000/health
   ```
   Should return `{"status": "healthy"}`

2. **Check you have enough data:**
   - Need at least 30 sales entries
   - Data should span at least 30 days
   - Run: `curl http://localhost:3001/api/sales | jq length`

3. **Check ML service logs:**
   ```bash
   # In ML service terminal, look for errors
   ```

4. **Test ML service directly:**
   ```bash
   curl -X POST http://localhost:8000/api/v1/predictions/forecast \
     -H "Content-Type: application/json" \
     -d '{"product_id":"YOUR_ID","periods":30,"model_type":"prophet"}'
   ```

5. **Restart ML service:**
   ```bash
   # Stop ML service (Ctrl+C)
   # Start again
   cd apps/ml-service
   python -m uvicorn main:app --reload --port 8000
   ```


#### Issue 3: AI Not Responding

**Symptoms:**
- AI query times out
- "Error connecting to AI model"
- No response from AI

**Solutions:**

1. **Check Ollama is running:**
   ```bash
   curl http://localhost:11434/api/tags
   ```
   Should return list of models.

2. **Start Ollama:**
   ```bash
   ollama serve
   ```

3. **Check model is downloaded:**
   ```bash
   ollama list
   ```
   Should show `llama2` in list.

4. **Pull model if missing:**
   ```bash
   ollama pull llama2
   ```

5. **Test Ollama directly:**
   ```bash
   curl -X POST http://localhost:11434/api/generate \
     -H "Content-Type: application/json" \
     -d '{"model":"llama2","prompt":"Hello","stream":false}'
   ```

6. **Check environment variables:**
   ```bash
   # In apps/ml-service/.env
   AI_MODEL_URL=http://localhost:11434
   AI_MODEL_NAME=llama2
   ```

7. **Use alternative AI (if Ollama doesn't work):**
   - Update `apps/ml-service/app/agentic_ai/llm_client.py`
   - Use OpenAI API instead
   - Or disable AI features temporarily

#### Issue 4: Database Connection Failed

**Symptoms:**
- "Cannot connect to MongoDB"
- "Connection timeout"
- Backend crashes on startup

**Solutions:**

1. **Check MongoDB is running:**
   ```bash
   # Docker
   docker ps | grep mongodb
   
   # Windows service
   net start MongoDB
   
   # Mac
   brew services list | grep mongodb
   ```

2. **Start MongoDB:**
   ```bash
   # Docker
   docker start mongodb
   
   # Or
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

3. **Check connection string:**
   ```bash
   # In .env
   MONGODB_URI=mongodb://localhost:27017/enterprise-sales-ai
   ```

4. **Test connection:**
   ```bash
   mongosh mongodb://localhost:27017/enterprise-sales-ai
   ```

5. **Check port is not in use:**
   ```bash
   # Windows
   netstat -ano | findstr :27017
   
   # Mac/Linux
   lsof -i :27017
   ```

6. **Reset MongoDB:**
   ```bash
   # Stop MongoDB
   docker stop mongodb
   docker rm mongodb
   
   # Start fresh
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```


#### Issue 5: Port Already in Use

**Symptoms:**
- "Port 3000 is already in use"
- "EADDRINUSE: address already in use"
- Service won't start

**Solutions:**

1. **Find process using port:**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Mac/Linux
   lsof -i :3000
   ```

2. **Kill process:**
   ```bash
   # Windows (replace PID with actual process ID)
   taskkill /PID 1234 /F
   
   # Mac/Linux
   kill -9 1234
   ```

3. **Use different port:**
   ```bash
   # Frontend
   PORT=3001 pnpm --filter web dev
   
   # Backend
   PORT=3002 pnpm --filter api start:dev
   
   # ML Service
   python -m uvicorn main:app --reload --port 8001
   ```

4. **Update environment variables:**
   ```bash
   # .env
   NEXT_PUBLIC_API_URL=http://localhost:3002
   NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8001
   ```

#### Issue 6: Python Dependencies Failed

**Symptoms:**
- "ModuleNotFoundError: No module named 'fastapi'"
- "pip install failed"
- Import errors in ML service

**Solutions:**

1. **Use correct Python version:**
   ```bash
   # Check Python version
   python --version  # Should be 3.10+
   
   # Windows - use specific version
   py -3.12 -m pip install -r requirements.txt
   ```

2. **Create virtual environment:**
   ```bash
   cd apps/ml-service
   python -m venv venv
   
   # Activate
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Install dependencies one by one:**
   ```bash
   pip install fastapi
   pip install uvicorn
   pip install pydantic
   # ... etc
   ```

4. **Upgrade pip:**
   ```bash
   python -m pip install --upgrade pip
   ```

5. **Use conda (alternative):**
   ```bash
   conda create -n sales-ai python=3.11
   conda activate sales-ai
   pip install -r requirements.txt
   ```


### Performance Issues

#### Slow Forecast Generation

**Symptoms:**
- Forecast takes >30 seconds
- Timeout errors
- High CPU usage

**Solutions:**

1. **Reduce forecast period:**
   - Use 7 days instead of 30 days
   - Use 30 days instead of 90 days

2. **Use simpler model:**
   - Use Prophet instead of LSTM
   - Use XGBoost instead of Prophet

3. **Limit historical data:**
   - Use last 90 days instead of all data
   - Aggregate daily data to weekly

4. **Increase timeout:**
   ```python
   # In ML service
   timeout=120.0  # Increase from 60 to 120 seconds
   ```

5. **Use caching:**
   - Cache forecast results for 1 hour
   - Reuse cached results for same query

#### Slow Page Load

**Symptoms:**
- Pages take >5 seconds to load
- Blank screen on navigation
- Slow API responses

**Solutions:**

1. **Check network:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Identify slow requests

2. **Optimize queries:**
   - Add pagination (limit 50 items per page)
   - Add indexes to MongoDB
   - Use projection (select only needed fields)

3. **Enable caching:**
   - Cache product list for 5 minutes
   - Cache sales data for 1 minute
   - Use Redis for caching (optional)

4. **Optimize frontend:**
   - Use lazy loading for images
   - Code splitting for routes
   - Minimize bundle size

### Data Issues

#### Missing Sales Data

**Symptoms:**
- Sales not showing in list
- Forecast shows "not enough data"
- Empty charts

**Solutions:**

1. **Check database:**
   ```bash
   mongosh mongodb://localhost:27017/enterprise-sales-ai
   db.sales.count()  # Should return number of sales
   db.sales.find().limit(5)  # Show first 5 sales
   ```

2. **Reload sample data:**
   ```bash
   python load_sample_data.py
   ```

3. **Check date filters:**
   - Remove date filters
   - Use "All time" option
   - Check timezone settings

4. **Verify API response:**
   ```bash
   curl http://localhost:3001/api/sales
   ```


---

## Complete Testing Workflow

### End-to-End Test Scenario

Follow this complete workflow to test all features:

#### Phase 1: Setup (15 minutes)

1. ✅ Start all services (MongoDB, Frontend, Backend, ML Service, Ollama)
2. ✅ Create user account and login
3. ✅ Load sample data (10 products, 100 sales)
4. ✅ Verify data in UI

#### Phase 2: Basic Features (10 minutes)

1. ✅ View products list
2. ✅ Add new product manually
3. ✅ Edit existing product
4. ✅ View sales history
5. ✅ Filter sales by date range
6. ✅ Record new sale
7. ✅ Check inventory levels

#### Phase 3: ML Features (15 minutes)

1. ✅ Generate forecast for Laptop (30 days, Prophet model)
2. ✅ Verify forecast chart displays
3. ✅ Check forecast metrics (MAPE, RMSE)
4. ✅ Generate forecast for Mouse (7 days, XGBoost model)
5. ✅ Compare different models
6. ✅ Test batch predictions
7. ✅ Train custom model
8. ✅ Evaluate model performance

#### Phase 4: AI Features (15 minutes)

1. ✅ Ask: "What will be the sales forecast for next month?"
2. ✅ Ask: "Analyze my sales performance"
3. ✅ Ask: "Which products should I restock?"
4. ✅ Ask: "Should I adjust prices?"
5. ✅ Ask: "What products should I focus on?"
6. ✅ Test follow-up questions
7. ✅ Verify AI reasoning and recommendations

#### Phase 5: Advanced Features (10 minutes)

1. ✅ Create custom report
2. ✅ Export data (CSV)
3. ✅ Generate API key
4. ✅ Test API with curl/Postman
5. ✅ Setup webhook (optional)
6. ✅ Create backup

#### Phase 6: Verification (5 minutes)

1. ✅ Check all services are running
2. ✅ Verify data integrity
3. ✅ Test logout and login again
4. ✅ Check browser console for errors
5. ✅ Review service logs

**Total Time: ~70 minutes**


### Quick Test Commands

**Test all services are running:**
```bash
# Frontend
curl http://localhost:3000

# Backend API
curl http://localhost:3001/api

# ML Service
curl http://localhost:8000

# MongoDB
mongosh mongodb://localhost:27017/enterprise-sales-ai --eval "db.stats()"

# Ollama
curl http://localhost:11434/api/tags
```

**Test authentication:**
```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

**Test ML forecast:**
```bash
# Get product ID first
PRODUCT_ID=$(curl -s http://localhost:3001/api/products | jq -r '.[0]._id')

# Generate forecast
curl -X POST http://localhost:8000/api/v1/predictions/forecast \
  -H "Content-Type: application/json" \
  -d "{\"product_id\":\"$PRODUCT_ID\",\"periods\":30,\"model_type\":\"prophet\"}"
```

**Test AI query:**
```bash
curl -X POST http://localhost:8000/api/v1/ai/query \
  -H "Content-Type: application/json" \
  -d '{"query":"What are my top selling products?","context":{}}'
```

**Check data counts:**
```bash
# Products
curl -s http://localhost:3001/api/products | jq 'length'

# Sales
curl -s http://localhost:3001/api/sales | jq 'length'
```

---

## FAQ

### General Questions

**Q: Do I need to install Ollama for the app to work?**
A: No, Ollama is optional. The app works without it, but AI features won't be available. You can use the ML forecasting features without Ollama.

**Q: Can I use this in production?**
A: Yes, but you should:
- Use strong JWT secrets
- Enable HTTPS
- Use MongoDB Atlas (cloud)
- Set up proper authentication
- Monitor performance
- Regular backups

**Q: How much data do I need for accurate forecasts?**
A: Minimum 30 days of data, but 90+ days is recommended for better accuracy.

**Q: Can I use different AI models?**
A: Yes, you can use:
- Ollama with different models (Mistral, CodeLlama, etc.)
- OpenAI API (GPT-3.5, GPT-4)
- Anthropic Claude
- Google Gemini
- Any LLM with API

**Q: Is my data secure?**
A: When using Ollama, all data stays local. No data is sent to external services. For cloud deployment, use encryption and secure connections.


### ML Questions

**Q: Which ML model should I use?**
A: 
- **Prophet**: Best for most cases, handles seasonality well
- **XGBoost**: Better for complex patterns with multiple features
- **LSTM**: Best for long sequences, requires more data

**Q: Why is my forecast inaccurate?**
A: Common reasons:
- Not enough historical data (need 60+ days)
- Irregular sales patterns
- Outliers in data
- Sudden market changes
- Wrong model choice

**Q: How often should I retrain models?**
A: 
- Weekly for fast-changing products
- Monthly for stable products
- After major events (promotions, holidays)

**Q: Can I forecast multiple products at once?**
A: Yes, use the batch prediction endpoint or create a custom script.

**Q: What's a good MAPE score?**
A:
- <10%: Excellent
- 10-20%: Good
- 20-50%: Acceptable
- >50%: Poor (need more data or different approach)

### AI Questions

**Q: Why is AI response slow?**
A: 
- Ollama needs good CPU/GPU
- Large models (70B) are slower
- Use smaller models (7B) for faster responses
- Consider cloud AI APIs for production

**Q: Can AI make mistakes?**
A: Yes, AI can:
- Misinterpret queries
- Provide incorrect recommendations
- Hallucinate facts
- Always verify AI suggestions

**Q: How do I improve AI responses?**
A:
- Be specific in queries
- Provide context
- Use follow-up questions
- Fine-tune prompts
- Use better models

**Q: Can I customize AI behavior?**
A: Yes, edit prompt templates in:
- `apps/ml-service/app/prompts/sales_prompts.py`
- `apps/ml-service/app/prompts/forecast_prompts.py`

### Technical Questions

**Q: Can I use PostgreSQL instead of MongoDB?**
A: Yes, but you'll need to:
- Update backend to use TypeORM
- Rewrite schemas
- Update queries
- Test thoroughly

**Q: Can I deploy without Docker?**
A: Yes, install services directly:
- MongoDB locally
- Node.js apps with PM2
- Python app with systemd/supervisor

**Q: How do I scale the application?**
A: 
- Use load balancer for frontend
- Run multiple backend instances
- Separate ML service on GPU instance
- Use MongoDB replica set
- Add Redis for caching

**Q: Can I add more features?**
A: Yes! The architecture is modular. See PROJECT_ARCHITECTURE.md for guidance on adding:
- New routes
- New ML models
- New AI tools
- New integrations

---

## Support & Resources

### Documentation

- **Project Architecture:** `PROJECT_ARCHITECTURE.md`
- **User Manual:** `USER_MANUAL.md` (this file)
- **API Documentation:** http://localhost:3001/api/docs
- **ML API Documentation:** http://localhost:8000/docs

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Prophet Documentation](https://facebook.github.io/prophet/)
- [Ollama Documentation](https://ollama.ai/docs)

### Getting Help

1. **Check logs:**
   - Frontend: Browser console (F12)
   - Backend: Terminal output
   - ML Service: Terminal output
   - MongoDB: `mongosh` logs

2. **Search documentation:**
   - Use Ctrl+F in this manual
   - Check PROJECT_ARCHITECTURE.md
   - Review API docs

3. **Test in isolation:**
   - Test each service separately
   - Use curl/Postman for API testing
   - Check database directly with mongosh

4. **Common solutions:**
   - Restart services
   - Clear browser cache
   - Check environment variables
   - Verify all services are running

---

## Conclusion

Congratulations! You now know how to:

✅ Setup and run the Enterprise Sales AI application
✅ Load and manage sample data
✅ Use all core features (products, sales, inventory)
✅ Generate ML forecasts with different models
✅ Interact with the AI agent for insights
✅ Use advanced features (reports, API, webhooks)
✅ Troubleshoot common issues

**Next Steps:**

1. **Customize for your business:**
   - Add your actual products
   - Import historical sales data
   - Configure settings

2. **Explore advanced features:**
   - Create custom reports
   - Setup automated workflows
   - Integrate with other systems

3. **Optimize performance:**
   - Fine-tune ML models
   - Customize AI prompts
   - Add caching

4. **Deploy to production:**
   - Follow deployment guide
   - Setup monitoring
   - Configure backups

**Happy forecasting! 🚀📊🤖**

---

**Document Version:** 1.0.0  
**Last Updated:** February 15, 2026  
**For Application Version:** 1.0.0
