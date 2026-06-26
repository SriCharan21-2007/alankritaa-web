import React from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppURL } from '../utils/whatsapp';

/**
 * WhatsAppCTA - Floating action button in the bottom-right corner.
 * Hidden on the Contact page. Styled with green background and pulse animation.
 */
const WhatsAppCTA = () => {
  const location = useLocation();

  // Hide the floating CTA button on the Contact page
  if (location.pathname === '/contact') {
    return null;
  }

  const defaultMessage = "Hi Alankrita, I'd like to book services/enquire about pricing.";
  const waURL = buildWhatsAppURL(defaultMessage);

  return (
    <a
      href={waURL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer animate-whatsapp-pulse"
      title="Chat with us on WhatsApp"
      aria-label="Chat with us on WhatsApp"
    >
      {/* WhatsApp SVG Icon */}
      <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:rotate-12" />
      
      {/* Tooltip showing on hover */}
      <span className="absolute right-16 bg-charcoal text-ivory text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 shadow-md border border-gold/20">
        WhatsApp Us
      </span>
    </a>
  );
};

export default WhatsAppCTA;
