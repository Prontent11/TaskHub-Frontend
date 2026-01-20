# Frontend Repository

A modern frontend application built with React and Vite.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** ≥ 18.x
- **npm** (comes with Node.js)
- **Backend API** - Ensure the backend is set up and running. See [Backend Repository](https://github.com/Prontent11/Multi-Tenant-SaaS-Backend)

## 🔐 Login Access

### Super Admin Login
- **URL:** `http://localhost:5173/`
- **Email:** admin@platform.com  
- **Password:** admin123

### Organization Login
- **URL:** `http://localhost:5173/org/login`
- Use organization-specific credentials

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Prontent11/TaskHub-Frontend.git
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure API Base URL**

Create a `.env` file in the root directory and add:
```dotenv
VITE_BASE_URL=http://localhost:3000/api
```
Then update the API configuration to use the environment variable:
```typescript
// src/api/axios.ts
baseURL: import.meta.env.VITE_BASE_URL
```
4. **Start the development server**
```bash
npm run dev
```

The application will be available at:
```
http://localhost:5173
```

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🛠️ Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Axios** - HTTP client

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Backend Integration

Ensure your backend API is running on `http://localhost:3000` before starting the frontend. Update the `baseURL` in `src/api/axios.ts` if your backend runs on a different port.

## 📝 Development

### Project Structure
```
frontend/
├── src/
│   ├── api/          # API configuration
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── auth/         # Authentication components
│   └── App.tsx       # Main app component
├── public/           # Static assets
└── package.json      # Dependencies
```


### API Connection Issues

Verify that:
- Backend server is running on `http://localhost:3000`
- CORS is properly configured on the backend
- API base URL is correctly set in `src/api/axios.ts`
