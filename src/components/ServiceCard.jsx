import React from 'react';
import { MessageCircle, Check } from 'lucide-react';
import { buildWhatsAppURL, getServiceBookingMessage } from '../utils/whatsapp';

/**
 * ServiceCard - Displays services with name, description, price, and WhatsApp booking action.
 * Shows a large emoji at the top, a gold border that appears on hover, and custom tick marks.
 * 
 * @param {Object} props
 * @param {Object} props.service - The service details from staticData.
 */
const ServiceCard = ({ service }) => {
  const { name, description, startingPrice, packageOptions, whatsappMessage, icon } = service;
  
  // Build WhatsApp inquiry URL
  const bookingText = whatsappMessage || getServiceBookingMessage(name);
  const waURL = buildWhatsAppURL(bookingText);

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl border-t-[3px] border-transparent hover:border-gold p-6 md:p-8 flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1 group">
      <div>
        {/* Large emoji icon centered at top */}
        {icon && (
          <div className="text-5xl text-center mb-5 transform group-hover:scale-110 transition-transform duration-300 select-none">
            {icon}
          </div>
        )}

        {/* Service Name */}
        <h3 className="text-2xl font-bold font-display text-burgundy text-center mb-3 group-hover:text-gold transition-colors duration-300 leading-tight">
          {name}
        </h3>

        {/* Starting Price in gold bold text */}
        <div className="text-center mb-5">
          <span className="text-xs uppercase tracking-wider text-charcoal-light block mb-0.5">Investment</span>
          <span className="text-2xl font-bold text-gold font-sans">Starting from {formatPrice(startingPrice)}</span>
        </div>

        {/* Description */}
        <p className="text-charcoal-light text-sm leading-relaxed text-center mb-6 font-light">
          {description}
        </p>

        {/* Package Options Checklist */}
        {packageOptions && packageOptions.length > 0 && (
          <div className="space-y-3 mb-8 w-full max-w-sm mx-auto">
            <ul className="space-y-2.5">
              {packageOptions.map((option, idx) => (
                <li key={idx} className="flex items-start text-sm text-charcoal text-left">
                  <span className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5 mr-2.5">
                    <Check className="w-3.5 h-3.5 text-gold-dark font-bold" />
                  </span>
                  <span className="leading-snug font-sans font-light">{option}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* WhatsApp CTA Button */}
      <a
        href={waURL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-full transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 cursor-pointer text-sm font-sans"
      >
        <MessageCircle className="w-5 h-5 shrink-0" />
        Enquire on WhatsApp
      </a>
    </div>
  );
};

export default ServiceCard;
