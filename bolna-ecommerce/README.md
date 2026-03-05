# Bolna AI E-Commerce Platform

A full-stack e-commerce web application featuring AI integration via [Bolna AI](https://bolna.dev/) for intelligent conversational agents, automated outbound calls from the Orders page, and an AI-powered customer support chatbot.

## 🚀 Features

- **Storefront & Product Catalog**: Browse products with a modern React UI.
- **Order Management**: End-to-end checkout and order tracking.
- **Bolna AI Integration**: 
  - Automated outbound AI calls to customers upon order updates.
  - Interactive customer support chatbot built directly into the UI.
  - Webhooks for Bolna AI to fetch order details and context.
- **Authentication**: secure JWT-based authentication combined with bcrypt for password hashing.
- **Email Notifications**: Seamless email updates via Nodemailer.
- **Responsive UI**: Built with React, Tailwind CSS, and Lucide Icons.

## 🛠️ Technology Stack

**Frontend**
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios

**Backend**
- Node.js & Express
- MongoDB (with Mongoose)
- JSON Web Tokens (JWT) & bcrypt
- Nodemailer
- Axios & Bolna API

## 📁 Project Structure

```text
bolna-ecommerce/
├── backend/            # Express.js REST API
│   ├── models/         # Mongoose Data Models
│   ├── routes/         # API Route Controllers
│   ├── middleware/     # Custom Express Middlewares (e.g., auth)
│   ├── utils/          # Utility functions
│   └── server.js       # Main server entrypoint
│
└── frontend/           # React + Vite Client
    ├── public/         # Static assets
    ├── src/            # React components, pages, and context
    └── vite.config.js  # Vite configurations
```

## ⚙️ Prerequisites

- Node.js (v16 or higher)
- MongoDB instance (Local or Atlas URL)
- [Bolna AI](https://bolna.dev/) account with appropriate API keys & Agent IDs

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd bolna-ecommerce
```

### 2. Set up the Backend

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/bolnaDB
JWT_SECRET=your_super_secret_jwt_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL=http://localhost:5173
BOLNA_API_KEY=your_bolna_api_key
BOLNA_AGENT_ID=your_bolna_agent_id
```

Run the backend server:

```bash
# Production mode
npm start

# Development mode (nodemon)
npm run dev
```

### 3. Set up the Frontend

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Run the React development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## 🤖 Bolna AI Webhooks

Ensure your application is accessible publicly (using a tool like ngrok) if you are testing Bolna AI webhooks locally, as the AI agent needs to be able to reach your locally running backend endpoints.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
