import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

/**
 * Navbar - Sticky header navigation with hamburger menu.
 * Uses burgundy background, ivory links, and gold italic brand logo.
 */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle scroll shadow and transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/mehendi', label: 'Mehendi Gallery' },
    { path: '/saree', label: 'Saree Draping' },
    { path: '/services', label: 'Services & Pricing' },
    { path: '/artists', label: 'Our Artists' },
    { path: '/contact', label: 'Bookings & Contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
      scrolled ? 'bg-burgundy shadow-lg py-3' : 'bg-burgundy/95 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo Section */}
          <Link to="/" className="flex flex-col">
            <span className="font-display italic text-2xl xs:text-3xl font-bold text-gold tracking-wider hover:text-gold-light transition-colors duration-200">
              Alankrita
            </span>
            <span className="text-[9px] xs:text-[10px] uppercase tracking-[0.25em] text-ivory/60 font-sans -mt-1 pl-1">
              Mehendi & Saree
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-1 lg:space-x-4 items-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium tracking-wide transition-all duration-300 font-sans ${
                    isActive
                      ? 'text-gold border-b-2 border-gold rounded-none'
                      : 'text-ivory/95 hover:text-gold hover:translate-y-[-1px]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            
            <NavLink
              to="/admin/login"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-bold tracking-wide transition-all duration-300 font-sans text-gold hover:text-gold-light hover:translate-y-[-1px] flex items-center gap-1`
              }
            >
              🔒 Admin
            </NavLink>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-ivory hover:text-gold hover:bg-burgundy-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gold transition-all duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      <div
        className={`md:hidden absolute w-full left-0 bg-burgundy transition-all duration-300 ease-in-out border-t border-burgundy-light overflow-hidden ${
          isOpen ? 'max-h-[450px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        id="mobile-menu"
      >
        <div className="px-4 pt-3 pb-6 space-y-2 shadow-2xl flex flex-col items-start bg-burgundy">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block w-full px-4 py-3 rounded-md text-base font-semibold tracking-wide transition-colors duration-200 font-sans ${
                  isActive
                    ? 'text-gold bg-burgundy-dark/50 border-l-4 border-gold pl-3'
                    : 'text-ivory hover:text-gold hover:bg-burgundy-light'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <NavLink
            to="/admin/login"
            className={({ isActive }) =>
              `block w-full px-4 py-3 rounded-md text-base font-bold tracking-wide transition-colors duration-200 font-sans text-gold hover:bg-burgundy-light border-t border-gold/10 mt-2 pt-4`
            }
          >
            🔒 Admin Login
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
