import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import BolnaChatbot from './components/BolnaChatbot';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </main>
          <footer className="bg-gray-800 text-white text-center py-4">
            <p>© 2026 AI-Ready E-Commerce Platform. All rights reserved.</p>
          </footer>
          <BolnaChatbot />
        </div>
      </CartProvider>
    </Router>
    
  );
}
console.log("API URL:", import.meta.env.VITE_BACKEND_URL);
export default App;
