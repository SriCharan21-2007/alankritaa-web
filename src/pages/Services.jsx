import React, { useEffect, useRef } from 'react';
import { useServices } from '../hooks/useServices';
import ServiceCard from '../components/ServiceCard';
import HennaDivider from '../components/HennaDivider';
import { Sparkles, MessageCircle } from 'lucide-react';
import { buildWhatsAppURL } from '../utils/whatsapp';

/**
 * Services - Services & pricing page.
 * Loads and displays service options from Firestore with responsive spacing and layouts.
 */
const Services = () => {
  const { services, loading, error } = useServices();
  const pageRef = useRef(null);

  // Setup Scroll Reveal Observer
  useEffect(() => {
    if (loading || services.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    const revealItems = pageRef.current?.querySelectorAll('.reveal-item');
    revealItems?.forEach((el) => observer.observe(el));

    return () => {
      revealItems?.forEach((el) => observer.unobserve(el));
    };
  }, [services, loading]);

  const generalInquiryWa = buildWhatsAppURL("Hi Alankrita, I'd like to ask about customizing a package for my wedding.");

  return (
    <div ref={pageRef} className="pt-24 pb-20 bg-ivory min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-16 reveal-item">
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.25em] block mb-2">
            Services & Pricing
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-burgundy mb-4">
            Bespoke Styling Packages
          </h1>
          <p className="text-charcoal-light text-sm md:text-base max-w-xl mx-auto font-sans font-light leading-relaxed">
            Choose from our premium packages below or get in touch for custom pricing tailored for large group bookings and destination weddings.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="shimmer-loading rounded-xl h-96 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-rose-light/35 rounded-xl border border-rose-dark/10 max-w-lg mx-auto px-6 reveal-item">
            <h4 className="text-xl font-semibold text-burgundy mb-2">Error Loading Services</h4>
            <p className="text-charcoal-light text-sm mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-gold hover:bg-gold-dark text-burgundy font-semibold rounded-full text-sm transition-all duration-300 shadow-md"
            >
              Retry
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-ivory-dark/30 rounded-xl border border-gold/10 max-w-md mx-auto px-6 reveal-item">
            <h4 className="text-lg font-display text-burgundy font-bold mb-1">No services listed</h4>
            <p className="text-charcoal-light text-sm">Services are currently being updated. Please consult us directly on WhatsApp.</p>
          </div>
        ) : (
          /* Responsive service cards grid (2 columns desktop, 1 column mobile) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => {
              const delay = `delay-${((index % 4) + 1) * 100}`;
              return (
                <div key={service.id} className={`reveal-item ${delay} h-full`}>
                  <ServiceCard service={service} />
                </div>
              );
            })}
          </div>
        )}

        <HennaDivider className="reveal-item" />

        {/* Custom inquiry CTA card below services */}
        <div className="reveal-item max-w-3xl mx-auto mt-16 bg-white rounded-xl shadow-lg border border-gold/10 p-6 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-15">
            <Sparkles className="w-16 h-16 text-gold" />
          </div>
          
          <h3 className="font-display text-2xl md:text-3xl font-bold text-burgundy mb-3">
            Looking for Custom Group Packages?
          </h3>
          <p className="text-charcoal-light text-sm leading-relaxed max-w-xl mx-auto mb-6 font-light">
            We offer attractive combined packages for guest mehendi, large wedding parties, and saree draping for family members. Reach out to discuss details.
          </p>
          <a
            href={generalInquiryWa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 py-3.5 px-8 bg-burgundy hover:bg-burgundy-dark text-gold hover:text-white font-bold rounded-full text-sm uppercase shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 shrink-0" />
            Discuss Group Customization
          </a>
        </div>

      </div>
    </div>
  );
};

export default Services;
