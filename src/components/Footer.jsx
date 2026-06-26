import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { buildWhatsAppURL } from '../utils/whatsapp';

/**
 * Footer - Brand information, quick links, contacts, and social links.
 * Styled in dark charcoal/burgundy with gold accents.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const waURL = buildWhatsAppURL("Hi Alankrita, I'd like to ask a question.");

  return (
    <footer className="bg-charcoal text-ivory/80 pt-16 pb-8 border-t border-gold/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info Column */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display italic text-3xl font-bold text-gold tracking-wider">
                Alankrita
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-ivory/50 font-sans -mt-1 pl-1">
                Mehendi & Saree
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-ivory/70">
              Exquisite bridal mehendi artistry and premium saree draping styles designed to make you shine on your most memorable days. Serving clients across Hyderabad.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-charcoal-light flex items-center justify-center hover:bg-gold hover:text-burgundy transition-all duration-300 shadow-md"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-charcoal-light flex items-center justify-center hover:bg-gold hover:text-burgundy transition-all duration-300 shadow-md"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href={waURL}
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-charcoal-light flex items-center justify-center hover:bg-gold hover:text-burgundy transition-all duration-300 shadow-md text-emerald-400 hover:text-burgundy"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-display text-xl text-gold font-semibold tracking-wide mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-gold">
              Quick Links
            </h3>
          <ul className="space-y-3">
            {[
              { to: '/', label: 'Home' },
              { to: '/mehendi', label: 'Mehendi Gallery' },
              { to: '/saree', label: 'Saree Draping Gallery' },
              { to: '/services', label: 'Services & Pricing' },
              { to: '/artists', label: 'Our Artists' },
              { to: '/contact', label: 'Bookings & Contact' }
            ].map((link) => (
              <li key={link.label}>
                <Link 
                  to={link.to} 
                  className="text-sm hover:text-gold hover:pl-2 transition-all duration-300 inline-block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Details Column */}
        <div>
          <h3 className="font-display text-xl text-gold font-semibold tracking-wide mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-gold">
            Get in Touch
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3 text-sm">
              <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <span className="text-ivory/70">Jubilee Hills, Gachibowli, & all areas in Hyderabad, Telangana</span>
            </li>
            <li className="flex items-center space-x-3 text-sm">
              <Phone className="w-5 h-5 text-gold shrink-0" />
              <a href={`tel:${import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'}`} className="hover:text-gold transition-colors duration-200">
                +{import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'}
              </a>
            </li>
            <li className="flex items-center space-x-3 text-sm">
              <Mail className="w-5 h-5 text-gold shrink-0" />
              <a href="mailto:info@alankrita.com" className="hover:text-gold transition-colors duration-200">
                info@alankrita.com
              </a>
            </li>
          </ul>
        </div>

        {/* Business Hours Column */}
        <div>
          <h3 className="font-display text-xl text-gold font-semibold tracking-wide mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-[2px] after:bg-gold">
            Business Hours
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3 text-sm">
              <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div className="text-ivory/70">
                <p className="font-semibold">Monday - Sunday</p>
                <p className="text-xs mt-1">9:00 AM - 8:00 PM (IST)</p>
                <p className="text-[11px] text-rose/50 mt-2">Prior appointment recommended for bridal mehendi bookings.</p>
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold/10 mt-12 pt-8 text-center text-xs text-ivory/40">
        <p>
          &copy; {currentYear} Alankrita. All Rights Reserved. Designed for elegance.
        </p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
