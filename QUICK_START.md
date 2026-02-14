# Enterprise Sales AI - Quick Start Guide

## 5-Minute Setup

### 1. Start Services (3 terminals)

**Terminal 1 - MongoDB:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Terminal 2 - Backend & Frontend:**
```bash
# Install dependencies (first time only)
pnpm install

# Start both services
pnpm dev
```

**Terminal 3 - ML Service:**
```bash
cd apps/ml-service
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### 2. Create Account

1. Open: http://localhost:3000
2. Click "Sign Up"
3. Email: `admin@example.com`
4. Password: `Admin123!`
5. Click "Register"

### 3. Load Sample Data

```bash
# Install requests library
pip install requests

# Run data loader
python load_sample_data.py
```

**Output:**
```
✓ Logged in successfully
✓ Created 10 products
✓ Created 100 sales entries
🎉 Data Load Complete!
```

### 4. Test ML Forecast

1. Go to **Forecast** page
2. Select product: "Dell XPS 15 Laptop"
3. Periods: 30 days
4. Model: Prophet
5. Click **"Generate Forecast"**

**Result:** Chart with predictions for next 30 days

### 5. Test AI (Optional)

**Start Ollama:**
```bash
ollama serve
ollama pull llama2
```

**Ask AI:**
1. Go to **AI Insights** page
2. Ask: "What are my top selling products?"
3. Get intelligent analysis and recommendations

---

## Quick Commands

**Check all services:**
```bash
curl http://localhost:3000  # Frontend
curl http://localhost:3001/api  # Backend
curl http://localhost:8000  # ML Service
```

**View data:**
```bash
# Products count
curl -s http://localhost:3001/api/products | jq length

# Sales count
curl -s http://localhost:3001/api/sales | jq length
```

**Test forecast:**
```bash
# Get first product ID
PRODUCT_ID=$(curl -s http://localhost:3001/api/products | jq -r '.[0]._id')

# Generate forecast
curl -X POST http://localhost:8000/api/v1/predictions/forecast \
  -H "Content-Type: application/json" \
  -d "{\"product_id\":\"$PRODUCT_ID\",\"periods\":30,\"model_type\":\"prophet\"}"
```

---

## Troubleshooting

**Port in use?**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

**MongoDB not running?**
```bash
docker ps | grep mongodb
docker start mongodb
```

**Python errors?**
```bash
# Use virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

---

## What's Next?

📖 **Full Documentation:**
- `USER_MANUAL.md` - Complete user guide
- `PROJECT_ARCHITECTURE.md` - Technical details

🚀 **Try These Features:**
- Generate forecasts with different models
- Ask AI for business insights
- Create custom reports
- Export data to CSV/Excel
- Setup API integrations

💡 **Learn More:**
- API Docs: http://localhost:3001/api/docs
- ML Docs: http://localhost:8000/docs

---

**Need Help?** Check `USER_MANUAL.md` for detailed instructions and troubleshooting.
