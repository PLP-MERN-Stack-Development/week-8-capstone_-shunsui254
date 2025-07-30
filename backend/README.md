# MyBudgeteer Backend API

A robust Express.js API server with MongoDB integration for the MyBudgeteer financial management application.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/mybudgeteer
   JWT_SECRET=your-secret-key
   CLIENT_URL=http://localhost:8082
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 🏗️ Database Setup Options

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service: `mongod`
3. Use connection string: `mongodb://localhost:27017/mybudgeteer`

### Option 2: MongoDB Atlas (Recommended for production)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Get connection string from Atlas dashboard
4. Update `MONGODB_URI` in `.env`

Example Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mybudgeteer
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/demo` - Demo account access

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Health Check
- `GET /api/health` - Server health status

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Express-validator for data sanitization
- **CORS Protection**: Configured for frontend domain
- **Helmet**: Security headers protection

## 🗃️ Database Schema

### User Model
```javascript
{
  firstName: String (required),
  surname: String (required),
  otherName: String (optional),
  email: String (required, unique),
  password: String (required, hashed),
  phoneNumber: String (optional),
  preferredCurrency: String (default: 'USD'),
  profilePicture: String,
  preferences: {
    budgetType: String,
    budgetPeriod: String,
    emailNotifications: Boolean,
    pushNotifications: Boolean,
    language: String,
    theme: String
  },
  lastLogin: Date,
  loginCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Development

### Project Structure
```
backend/
├── src/
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API route handlers
│   ├── middleware/     # Custom middleware
│   └── server.js       # Main server file
├── .env.example        # Environment template
├── .gitignore
└── package.json
```

### Adding New Features
1. Create model in `src/models/`
2. Add routes in `src/routes/`
3. Add middleware if needed
4. Update server.js to include new routes

## 🚀 Deployment

### Environment Setup
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-secret
CLIENT_URL=https://yourdomain.com
```

### Recommended Platforms
- **Heroku**: Easy deployment with MongoDB Atlas
- **Railway**: Modern deployment platform
- **DigitalOcean App Platform**: Scalable hosting
- **AWS/Azure/GCP**: Enterprise-grade hosting

## 📞 Support

For issues or questions about the backend implementation, please check:
- MongoDB connection string format
- Environment variable configuration
- CORS settings for frontend integration
- JWT secret generation

## 🔄 Integration with Frontend

The frontend will need to be updated to:
1. Replace localStorage auth with API calls
2. Include JWT tokens in requests
3. Handle API responses properly
4. Update authentication flow

This backend provides a solid foundation for scaling your MyBudgeteer application!
