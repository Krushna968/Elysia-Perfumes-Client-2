# 🚀 Quick Start Guide - Elysia Perfumes Backend

## ⚠️ Prerequisites Missing

Your system needs Node.js to run the backend. Here's how to set everything up:

## 📦 Step 1: Install Node.js

### Option A: Download from Official Site (Recommended)
1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS version** (Long Term Support)
3. Run the installer and follow the setup wizard
4. **Restart your terminal/PowerShell** after installation

### Option B: Using Chocolatey (if you have it)
```powershell
choco install nodejs
```

### Option C: Using winget (Windows 11)
```powershell
winget install OpenJS.NodeJS
```

## ✅ Step 2: Verify Installation

After installing Node.js, restart your PowerShell and run:
```powershell
node --version
npm --version
```

You should see version numbers like:
```
v18.18.0
9.8.1
```

## 🗄️ Step 3: Set Up Database (Choose One)

### Option A: MongoDB Atlas (Recommended - Cloud)
1. Go to [https://mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `.env` file with your connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elysia-perfumes
   ```

### Option B: Local MongoDB (Development Only)
1. Download MongoDB Community Server from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Install and start MongoDB service
3. Keep the default `.env` setting:
   ```
   MONGODB_URI=mongodb://localhost:27017/elysia-perfumes-dev
   ```

## 🚀 Step 4: Start the Backend

Once Node.js is installed:

```powershell
# Navigate to backend directory
cd "C:\Users\samsung book4\Downloads\Elysia-Perfumes-Client-2\backend"

# Install dependencies
npm install

# Start development server
npm run dev
```

## ✅ Step 5: Test the API

If everything works, you'll see:
```
Server is running on port 5000 in development mode
MongoDB Connected: [your-db-host]
```

Test the API:
```powershell
# In a new PowerShell window
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Elysia Perfumes API is running",
  "timestamp": "2025-01-02T07:55:43.000Z",
  "environment": "development"
}
```

## 🔧 Configuration (Optional)

### For Payment Testing (Razorpay)
1. Sign up at [https://razorpay.com](https://razorpay.com)
2. Get your test keys from dashboard
3. Update `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

### For Email Testing (Gmail)
1. Enable 2-factor authentication on your Gmail
2. Generate an App Password
3. Update `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-digit-app-password
   ```

## 🎯 What You'll Have Running

Once started, your backend will provide:

### 🔐 Authentication APIs
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user

### 🛍️ Product APIs
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Featured products
- `GET /api/products/:slug` - Single product

### 👨‍💼 Admin APIs
- `GET /api/admin/products` - Manage products
- `POST /api/admin/products` - Create product
- `GET /api/admin/dashboard` - Dashboard stats

### 💳 Payment APIs
- `GET /api/payments/methods` - Payment methods
- `POST /api/payments/create-order` - Create order
- `POST /api/payments/verify-payment` - Verify payment

## 🆘 Common Issues

### "npm is not recognized"
- Node.js is not installed or not in PATH
- Restart PowerShell after installing Node.js
- Try: `where node` and `where npm`

### "Cannot connect to MongoDB"
- Check your `MONGODB_URI` in `.env`
- For Atlas: Whitelist your IP address
- For local: Make sure MongoDB service is running

### "Port 5000 is busy"
- Another service is using port 5000
- Change `PORT=5001` in `.env`
- Or stop the other service

### CORS Errors (from frontend)
- Update `FRONTEND_URL` in `.env`
- Make sure it matches your React app URL

## 🎉 Next Steps

1. **Install Node.js** and restart PowerShell
2. **Run `npm install`** in the backend folder
3. **Start the server** with `npm run dev`
4. **Test the health endpoint**
5. **Connect your React frontend** to `http://localhost:5000`

## 📞 Need Help?

If you encounter issues:
1. Check the server logs for error messages
2. Verify all environment variables in `.env`
3. Make sure MongoDB is accessible
4. Try restarting the server

**Your backend is ready to power the Elysia Perfumes e-commerce platform!** 🚀

---

**Once Node.js is installed, simply run:**
```powershell
npm install
npm run dev
```

**And your API will be live at:** `http://localhost:5000` 🎯
