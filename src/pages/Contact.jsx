import React from 'react';
import InquiryForm from '../components/InquiryForm';
import { buildWhatsAppURL } from '../utils/whatsapp';
import { MessageCircle, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

/**
 * Contact - Contact & Booking page.
 * Left: InquiryForm (inputs + Firestore write + EmailJS trigger).
 * Right: Business details, maps/location info, and direct WhatsApp chat links.
 */
const Contact = () => {
  const directWaURL = buildWhatsAppURL("Hi Alankrita, I want to book styling services for my event.");
  const supportWaURL = buildWhatsAppURL("Hi Alankrita, I have an inquiry regarding a booking.");

  return (
    <div className="pt-24 pb-20 bg-ivory min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.25em] block mb-2">
            Reservations
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-burgundy mb-4">
            Book Your Date
          </h1>
          <p className="text-charcoal-light text-sm md:text-base max-w-xl mx-auto font-sans font-light leading-relaxed">
            Fill out our inquiry form to check availability, or message us directly via WhatsApp for urgent bookings.
          </p>
        </div>

        {/* Two Column Layout (Stacked on Mobile, side-by-side on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xs:gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Form (7 columns on large desktop) */}
          <div className="lg:col-span-7">
            <InquiryForm />
          </div>

          {/* Right Column: Info & WhatsApp (5 columns on large desktop) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Quick Chat Card */}
            <div className="bg-white rounded-lg shadow-md border border-gold/10 p-6 md:p-8">
              <h3 className="font-display text-2xl text-burgundy font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
                Direct Chat
              </h3>
              <p className="text-charcoal-light text-sm leading-relaxed mb-6 font-light">
                Prefer chatting directly? Message us on WhatsApp to discuss your mehendi and draping requirements, share design references, or receive immediate answers.
              </p>
              
              <div className="space-y-3">
                <a
                  href={directWaURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-full transition-all duration-300 shadow-md text-sm font-sans"
                >
                  <MessageCircle className="w-5 h-5 shrink-0" />
                  Chat for Bookings
                </a>
                <a
                  href={supportWaURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-rose-light/10 text-burgundy border border-gold/30 font-bold rounded-full transition-all duration-300 shadow-sm text-sm font-sans"
                >
                  General Support Chat
                </a>
              </div>
            </div>

            {/* Studio Info Card */}
            <div className="bg-white rounded-lg shadow-md border border-gold/10 p-6 md:p-8 space-y-5">
              <h3 className="font-display text-2xl text-burgundy font-bold mb-4">
                Booking Information
              </h3>
              
              <ul className="space-y-4">
                
                {/* Location */}
                <li className="flex items-start gap-3.5 text-sm">
                  <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-charcoal block">Location Coverage</span>
                    <span className="text-charcoal-light font-light text-xs">Serving Hyderabad, Telangana (Home visits available for bridal events).</span>
                  </div>
                </li>

                {/* Telephone */}
                <li className="flex items-start gap-3.5 text-sm">
                  <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-charcoal block">Phone Number</span>
                    <a href={`tel:${import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'}`} className="text-charcoal-light hover:text-gold transition-colors duration-200 font-light text-xs">
                      +{import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'}
                    </a>
                  </div>
                </li>

                {/* Email */}
                <li className="flex items-start gap-3.5 text-sm">
                  <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-charcoal block">Email Address</span>
                    <a href="mailto:info@alankrita.com" className="text-charcoal-light hover:text-gold transition-colors duration-200 font-light text-xs">
                      info@alankrita.com
                    </a>
                  </div>
                </li>

                {/* Business Hours */}
                <li className="flex items-start gap-3.5 text-sm">
                  <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-charcoal block">Operating Hours</span>
                    <span className="text-charcoal-light font-light text-xs">Monday - Sunday: 9:00 AM - 8:00 PM (IST)</span>
                  </div>
                </li>

              </ul>
            </div>

            {/* Verification/Note banner */}
            <div className="bg-rose-light/20 rounded-lg p-5 border border-gold/10 text-center flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-gold shrink-0" />
              <p className="text-xs text-burgundy text-left leading-normal font-sans font-medium">
                Note: Standard bridal appointments must be booked at least 2-4 weeks in advance to ensure artist availability.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
