# Quick Start Guide - 5 Minutes to First Sale

## 🚀 Setup in 5 Steps

### Step 1: Start the Application (2 minutes)

```bash
# Terminal 1 - Start Backend API
cd apps/api
npm install
npm start

# Terminal 2 - Start Frontend
cd apps/web
npm install
npm run dev
```

Access: `http://localhost:3000`

---

### Step 2: Add Master Data (1 minute)

Go to **Settings** page:

```
Categories:
- Electronics
- Groceries
- Clothing

Companies:
- Samsung
- LG
- Nike

Distributors:
- ABC Wholesale
- XYZ Suppliers
```

---

### Step 3: Add Your First Product (1 minute)

Go to **Products** page → Click **Add Product**:

```
Name: Samsung Galaxy S24
SKU: SAM-S24-128
Barcode: 8801234567890
Cost Price: ₹45,000
Sale Price: ₹52,000
MRP: ₹55,000
Category: Electronics
Company: Samsung
Distributor: ABC Wholesale
```

Click **Save**

---

### Step 4: Add Inventory (30 seconds)

Go to **Inventory** page → Click **Add Inventory**:

```
Product: Samsung Galaxy S24
Quantity: 10
Location: Main Store
Reorder Level: 2
```

Click **Save**

---

### Step 5: Make Your First Sale (30 seconds)

Go to **Sales** page → Click **Add Sale**:

```
1. Click "Add Product"
2. Select: Samsung Galaxy S24
3. Quantity: 1
4. Payment Method: Cash
5. Click "Create Sale"
```

✅ **Done!** Your first sale is recorded.

---

## 📱 Daily Workflow

### Morning Routine
```
1. Check Dashboard for overview
2. Review Low Stock alerts
3. Check pending orders (if any)
```

### During Business Hours
```
1. Record sales as they happen
2. Update inventory when stock arrives
3. Add new products if needed
```

### End of Day
```
1. Review today's sales
2. Export sales report
3. Reconcile cash
4. Plan tomorrow's restocking
```

---

## 🎯 Common Tasks

### Record a Cash Sale
```
Sales → Add Sale → Select Products → Payment: Cash → Create
```

### Record a Card Payment
```
Sales → Add Sale → Select Products → Payment: Card → Create
```

### Add Customer Details
```
Sales → Add Sale → Fill Customer Info → Select Products → Create
```

### Check Stock Level
```
Inventory → Search Product → View Quantity
```

### Restock Product
```
Inventory → Find Product → Edit → Increase Quantity → Save
```

### View Today's Sales
```
Dashboard → Recent Sales
OR
Sales → Filter by Today's Date
```

### Export Sales Report
```
Sales → Set Date Range → Click "Export to Excel"
```

---

## ⚡ Keyboard Shortcuts (Future Feature)

```
Ctrl + N : New Sale
Ctrl + P : New Product
Ctrl + I : View Inventory
Ctrl + S : Save
Esc : Close Modal
```

---

## 🔍 Search Tips

### Products Page
- Search by name, SKU, or barcode
- Filter by category, company, or distributor
- Use date range for products added in specific period

### Sales Page
- Search by product name, customer name, or payment method
- Filter by date range
- Sort by amount or date

### Inventory Page
- Filter: All / Low Stock / In Stock
- Search by product name
- Sort by quantity or value

---

## 💡 Pro Tips

1. **Use SKU codes**: Make them meaningful (e.g., SAM-S24-128 = Samsung S24 128GB)
2. **Set reorder levels**: Get alerts before running out
3. **Add customer info**: Build customer database for future marketing
4. **Regular backups**: Export data weekly
5. **Check dashboard daily**: Spot trends early

---

## ⚠️ Important Rules

1. **Always check stock** before promising delivery
2. **Record sales immediately** - don't wait till end of day
3. **Update inventory** when new stock arrives
4. **Verify prices** before making sale
5. **Keep customer data private** - follow data protection laws

---

## 🆘 Troubleshooting

### "Insufficient stock" error
```
→ Check Inventory page
→ Verify actual physical stock
→ Update inventory if needed
→ Or inform customer of stockout
```

### Product not showing in dropdown
```
→ Check if product is added in Products page
→ Verify product is active
→ Refresh the page
```

### Sale not saving
```
→ Check all required fields are filled
→ Verify stock is available
→ Check internet connection
→ Check browser console for errors
```

### Wrong sale entry
```
→ Go to Sales page
→ Find the sale
→ Click Edit or Delete
→ Inventory auto-adjusts
```

---

## 📊 Understanding the Dashboard

### Key Metrics

**Total Revenue**: Sum of all sales amounts
**Total Sales**: Number of transactions
**Total Products**: Unique products in catalog
**Low Stock Items**: Products below reorder level

### Charts (Future)
- Sales trend over time
- Top selling products
- Revenue by category
- Payment method breakdown

---

## 🎓 Next Steps

After mastering basics:

1. **Week 1**: Master daily operations
2. **Week 2**: Explore reports and analytics
3. **Week 3**: Optimize inventory levels
4. **Week 4**: Add advanced features (GST, invoices, etc.)

---

## 📞 Need Help?

1. Check `docs/USER_GUIDE.md` for detailed explanations
2. Review `docs/` folder for technical documentation
3. Check error messages carefully
4. Contact system administrator

---

**Remember**: Start simple, practice daily, master one feature at a time. You'll be an expert in no time! 🚀
