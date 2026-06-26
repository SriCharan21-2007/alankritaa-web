import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppCTA from './components/WhatsAppCTA';
import Home from './pages/Home';
import MehendiGallery from './pages/MehendiGallery';
import SareeDrapingGallery from './pages/SareeDrapingGallery';
import Services from './pages/Services';
import Artists from './pages/Artists';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { AdminProvider } from './context/AdminContext';

/**
 * ScrollToTop - Helper component to force scroll to the top of the viewport 
 * on route/pathname navigation.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Instant scroll avoids jittery transitions
    });
  }, [pathname]);

  return null;
};

/**
 * App - Root application component that wires layout, routes, and hooks together.
 */
function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <AdminProvider>
      <div className="flex flex-col min-h-screen bg-ivory text-charcoal">
        {/* Scroll Helper */}
        <ScrollToTop />

        {/* Navigation - Hidden on admin routes */}
        {!isAdminPage && <Navbar />}

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mehendi" element={<MehendiGallery />} />
            <Route path="/saree" element={<SareeDrapingGallery />} />
            <Route path="/services" element={<Services />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Portal Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Fallback route back to home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Floating Sticky Actions - Hidden on admin routes */}
        {!isAdminPage && <WhatsAppCTA />}

        {/* Footer - Hidden on admin routes */}
        {!isAdminPage && <Footer />}
      </div>
    </AdminProvider>
  );
}

export default App;
