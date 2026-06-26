import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Sparkles, Star, ChevronRight, Check } from 'lucide-react';
import { mehendiItems, sareeItems, servicesData, artistsData } from '../utils/staticData';
import { buildWhatsAppURL } from '../utils/whatsapp';
import HennaDivider from '../components/HennaDivider';
import ServiceCard from '../components/ServiceCard';
import ArtistCard from '../components/ArtistCard';
import Lightbox from '../components/Lightbox';

/**
 * Home - Populated Landing Page using Unsplash placeholders.
 */
const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const homeRef = useRef(null);

  // Setup static previews
  const previewMehendi = mehendiItems.slice(0, 3);
  const previewSaree = sareeItems.slice(0, 3);
  const combinedPreviews = [
    ...previewMehendi.map(item => ({ ...item, badge: 'Mehendi' })),
    ...previewSaree.map(item => ({ ...item, badge: 'Saree Draping' }))
  ];

  // Setup Scroll Reveal Observer
  useEffect(() => {
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

    const revealItems = homeRef.current?.querySelectorAll('.reveal-item');
    revealItems?.forEach((el) => observer.observe(el));

    return () => {
      revealItems?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const heroWaURL = buildWhatsAppURL("Hi Alankrita, I'd like to book an appointment/enquire about your services.");

  return (
    <div ref={homeRef} className="pt-16 pb-1">
      {/* 1. Hero Section */}
      <header className="relative h-[85vh] sm:h-[90vh] md:h-[95vh] min-h-[550px] max-h-[850px] 3xl:max-h-[1000px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-all duration-700"
          style={{ 
            backgroundImage: "linear-gradient(to bottom, rgba(107, 29, 47, 0.55), rgba(44, 44, 44, 0.9)), url('/images/hero_mehendi.png')" 
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-ivory flex flex-col items-center">
          <span className="text-gold text-xs sm:text-sm font-bold uppercase tracking-[0.25em] mb-4 select-none animate-fade-in block">
            Welcome to Alankrita
          </span>
          
          <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight mb-4 drop-shadow-md">
            Where Art Meets Tradition
          </h1>
          
          <p className="font-sans text-gold text-xs xs:text-sm sm:text-base md:text-xl font-medium uppercase tracking-[0.25em] mb-8 max-w-2xl drop-shadow-sm px-2">
            Premium Mehendi & Saree Draping Services in Hyderabad
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
            {/* View Our Work (gold) */}
            <a
              href="#work-preview"
              className="flex items-center justify-center py-4 px-8 bg-gold hover:bg-gold-dark text-burgundy font-bold rounded-full transition-all duration-300 shadow-lg hover:-translate-y-0.5 cursor-pointer uppercase text-sm font-sans"
            >
              View Our Work
            </a>
            
            {/* Book via WhatsApp (green) */}
            <a
              href={heroWaURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 px-8 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:-translate-y-0.5 cursor-pointer uppercase text-sm font-sans"
            >
              <MessageCircle className="w-5 h-5" /> Book via WhatsApp
            </a>
          </div>
        </div>

        {/* Wave svg divider at bottom */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-[0] z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[50px] text-ivory fill-current">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,93.47,143.21,90,215.39,78.29,252.15,72.28,286.07,64.21,321.39,56.44Z"></path>
          </svg>
        </div>
      </header>

      {/* 2. Intro Section */}
      <section className="py-20 bg-ivory text-charcoal">
        <div className="max-w-4xl mx-auto px-4 text-center reveal-item">
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em] block mb-2 font-sans">
            Our Business
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-burgundy">
            A Master Touch of Indian Elegance
          </h2>
          <p className="text-charcoal-light text-base md:text-lg leading-relaxed font-sans max-w-2xl mx-auto font-light mb-4 text-center">
            Alankrita offers top-tier mehendi art design and professional saree pleating draping across Hyderabad. We provide bespoke bridal and guest styling services that bring classic elegance to life on your special occasions.
          </p>
        </div>
      </section>

      <HennaDivider className="reveal-item" />

      {/* 3. Work Preview Section (6 items) */}
      <section id="work-preview" className="py-16 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal-item">
            <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em] block mb-2 font-sans">
              Handpicked Designs
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-burgundy mb-4">
              Our Work Preview
            </h2>
            <p className="text-charcoal-light text-sm max-w-xl mx-auto font-sans font-light">
              Explore a preview of our premium bridal henna work and regional draping styles.
            </p>
          </div>

          {/* Grid Layout (3 columns desktop, 1 column mobile) */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {combinedPreviews.map((item, index) => {
              const delay = `delay-${((index % 5) + 1) * 100}`;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className={`reveal-item ${delay} group relative aspect-square overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer`}
                >
                  <img
                    src={item.imageURL}
                    alt={item.caption}
                    loading="lazy"
                    className="w-full aspect-square object-cover rounded-xl bg-rose-100 hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://picsum.photos/seed/${item.id}/600/600`;
                    }}
                  />
                  
                  {/* Category badge */}
                  <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-burgundy/90 text-gold text-xs font-semibold rounded-full shadow-md uppercase tracking-wider">
                    {item.badge}
                  </span>

                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy/90 via-burgundy/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                    <span className="text-gold text-xs uppercase tracking-widest font-semibold font-sans mb-1 block">
                      {item.subcategory}
                    </span>
                    <p className="text-ivory text-sm font-medium font-sans leading-snug line-clamp-2">
                      {item.caption}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12 reveal-item">
            <Link
              to="/mehendi"
              className="px-8 py-3 bg-white hover:bg-rose-light/20 border border-gold/30 text-burgundy font-bold rounded-full text-center text-sm tracking-wide transition-all duration-300 shadow-sm"
            >
              View Full Mehendi Gallery
            </Link>
            <Link
              to="/saree"
              className="px-8 py-3 bg-white hover:bg-rose-light/20 border border-gold/30 text-burgundy font-bold rounded-full text-center text-sm tracking-wide transition-all duration-300 shadow-sm"
            >
              View Full Saree Gallery
            </Link>
          </div>
        </div>
      </section>

      <HennaDivider className="reveal-item" />

      {/* 4. Services Teaser Section (first 3 services) */}
      <section className="py-16 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal-item">
            <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em] block mb-2 font-sans">
              Pricing Options
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-burgundy mb-4">
              Featured Packages
            </h2>
            <p className="text-charcoal-light text-sm max-w-xl mx-auto font-sans font-light">
              Check out some of our standard services. Customize packages directly with us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.slice(0, 3).map((service, index) => {
              const delay = `delay-${((index % 3) + 1) * 100}`;
              return (
                <div key={service.id} className={`reveal-item ${delay} h-full`}>
                  <ServiceCard service={service} />
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12 reveal-item">
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 px-8 py-3.5 bg-gold hover:bg-gold-dark text-burgundy font-bold rounded-full text-sm uppercase shadow-md hover:shadow-lg transition-all duration-300"
            >
              View All Services & Pricing <ChevronRight className="w-4.5 h-4.5" />
            </Link>
          </div>
        </div>
      </section>

      <HennaDivider className="reveal-item" />

      {/* 5. Why Choose Us Section */}
      <section className="py-16 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal-item">
            <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em] block mb-2 font-sans">
              Our Qualities
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-burgundy mb-4">
              Why Choose Alankrita
            </h2>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🏆", title: "8+ Years Experience", text: "Trusted by 500+ brides across Hyderabad" },
              { icon: "🌿", title: "Organic Henna Only", text: "100% natural, skin-safe mehendi cones" },
              { icon: "📍", title: "Home Visits Available", text: "We come to your venue, anywhere in Hyderabad" },
              { icon: "⭐", title: "500+ Happy Brides", text: "Rated 5 stars by our customers" }
            ].map((feat, index) => {
              const delay = `delay-${((index % 4) + 1) * 100}`;
              return (
                <div 
                  key={feat.title}
                  className={`reveal-item ${delay} bg-white rounded-xl shadow-md border border-gold/10 p-6 flex flex-col items-center text-center`}
                >
                  <span className="text-4xl mb-4 select-none">{feat.icon}</span>
                  <h4 className="font-display text-lg font-bold text-burgundy mb-2">{feat.title}</h4>
                  <p className="text-charcoal-light text-xs font-sans font-light">{feat.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <HennaDivider className="reveal-item" />

      {/* 6. Artist Teaser Section */}
      <section className="py-16 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal-item">
            <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em] block mb-2 font-sans">
              Our Experts
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-burgundy mb-4">
              Meet Our Specialists
            </h2>
            <p className="text-charcoal-light text-sm max-w-xl mx-auto font-sans font-light">
              Professional artists committed to making you look stunning.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-5xl mx-auto">
            {artistsData.map((artist, index) => {
              const delay = `delay-${((index % 3) + 1) * 100}`;
              return (
                <div key={artist.id} className={`reveal-item ${delay} w-full sm:w-[320px] md:w-[340px] flex-grow-0 shrink-0`}>
                  <ArtistCard artist={artist} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <HennaDivider className="reveal-item" />

      {/* 7. Testimonials Section */}
      <section className="py-16 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal-item">
            <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em] block mb-2 font-sans">
              Testimonials
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-burgundy mb-4">
              Happy Client Reviews
            </h2>
          </div>

          {/* 3 Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sneha Verma",
                event: "Bridal Mehendi",
                stars: 5,
                review: "Priya did an absolutely stunning job on my bridal mehendi. Every detail was perfect and the design lasted over 10 days!"
              },
              {
                name: "Kavitha Rao",
                event: "Saree Draping",
                stars: 5,
                review: "Ananya draped my Kanjivaram so beautifully for my reception. She was professional, quick and the drape stayed perfect all night."
              },
              {
                name: "Divya Nair",
                event: "Function Mehendi",
                stars: 5,
                review: "Booked for my sister's engagement. The Arabic pattern was beautiful and got so many compliments! Excellent service."
              }
            ].map((testi, index) => {
              const delay = `delay-${((index % 3) + 1) * 100}`;
              return (
                <div 
                  key={testi.name}
                  className={`reveal-item ${delay} bg-white rounded-xl shadow-md border border-gold/10 p-6 md:p-8 flex flex-col justify-between`}
                >
                  <p className="text-charcoal-light text-sm italic leading-relaxed mb-6 font-sans font-light">
                    "{testi.review}"
                  </p>
                  <div>
                    <div className="flex items-center gap-1 mb-2 text-gold justify-center">
                      {Array.from({ length: testi.stars }).map((_, s) => (
                        <Star key={s} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="font-display text-lg font-bold text-burgundy leading-tight text-center">
                      {testi.name}
                    </p>
                    <p className="text-xs text-charcoal-light font-sans font-medium text-center">
                      {testi.event}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox for portfolio preview click */}
      <Lightbox item={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
};

export default Home;
