# Quick Setup Guide

## Step 1: Environment Configuration

Create a `.env` file in the root directory with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/project-management-tool

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRE=7d
```

**Quick Command (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**Or create manually:**
1. Copy `.env.example` to `.env`
2. Update values if needed

---

## Step 2: Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```powershell
# If MongoDB is installed as a service
net start MongoDB

# Or run manually
mongod
```

**Mac/Linux:**
```bash
# If installed via Homebrew (Mac)
brew services start mongodb-community

# Or run manually
mongod --dbpath /path/to/data
```

**Using Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## Step 3: Install Dependencies

```bash
npm install
```

---

## Step 4: Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running in development mode on port 5000
```

---

## Step 5: Test the API

### Quick Health Check
```bash
curl http://localhost:5000/api/health
```

### Or open in browser:
```
http://localhost:5000/api/health
```

---

## Step 6: Start Testing

Use any of these methods:

### Option 1: VS Code REST Client
1. Install "REST Client" extension
2. Open `test.http`
3. Click "Send Request" above each request

### Option 2: Postman
1. Import `API_TESTING.md`
2. Create environment variables
3. Start testing

### Option 3: cURL
See examples in `API_TESTING.md`

---

## 🎯 Quick Start Workflow

1. **Register an Admin user**
2. **Login and copy the token**
3. **Create a project**
4. **Create tasks in the project**
5. **Add comments to tasks**
6. **Check project analytics**

---

## 📁 Project Structure

```
project-management-tool/
├── src/
│   ├── config/          # Database configuration
│   ├── models/          # Mongoose models
│   ├── middleware/      # Auth, authorization, error handling
│   ├── controllers/     # Business logic
│   ├── routes/          # API routes
│   └── utils/           # Helper functions
├── .env                 # Environment variables (create this!)
├── .env.example         # Environment template
├── server.js            # Entry point
├── package.json         # Dependencies
├── README.md            # Full documentation
├── API_TESTING.md       # API testing guide
└── test.http            # REST Client tests
```

---

## ⚠️ Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check if port 27017 is available
- Verify MONGODB_URI in `.env`

### Port Already in Use
- Change PORT in `.env` to another port (e.g., 5001)
- Or kill the process using port 5000

### Module Not Found
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

---

## 🚀 You're All Set!

Your Project Management Tool backend is ready to use. Check the `README.md` for detailed API documentation.

**Happy Coding! 🎉**
