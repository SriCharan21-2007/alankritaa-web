import React, { useEffect, useRef } from 'react';
import { useArtists } from '../hooks/useArtists';
import ArtistCard from '../components/ArtistCard';
import HennaDivider from '../components/HennaDivider';
import { Award, Heart, ShieldCheck } from 'lucide-react';

/**
 * Artists - Team page.
 * Loads and displays professional bios and images of Alankrita's artist team.
 */
const Artists = () => {
  const { artists, loading, error } = useArtists();
  const pageRef = useRef(null);

  // Setup Scroll Reveal Observer
  useEffect(() => {
    if (loading || artists.length === 0) return;

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
  }, [artists, loading]);

  return (
    <div ref={pageRef} className="pt-24 pb-20 bg-ivory min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center mb-16 reveal-item">
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.25em] block mb-2">
            Our Stylists
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-burgundy mb-4">
            Meet Our Master Artists
          </h1>
          <p className="text-charcoal-light text-sm md:text-base max-w-xl mx-auto font-sans font-light leading-relaxed">
            The creative minds behind the intricate patterns and perfect drapes. With decades of cumulative experience, we bring artistic vision to your doorstep.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="flex flex-wrap justify-center gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="shimmer-loading rounded-xl h-96 w-full sm:w-[320px] md:w-[340px] flex-grow-0 shrink-0" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-rose-light/35 rounded-xl border border-rose-dark/10 max-w-lg mx-auto px-6 reveal-item">
            <h4 className="text-xl font-semibold text-burgundy mb-2">Error Loading Artists</h4>
            <p className="text-charcoal-light text-sm mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-gold hover:bg-gold-dark text-burgundy font-semibold rounded-full text-sm transition-all duration-300 shadow-md"
            >
              Retry
            </button>
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-20 bg-ivory-dark/30 rounded-xl border border-gold/10 max-w-md mx-auto px-6 reveal-item">
            <h4 className="text-lg font-display text-burgundy font-bold mb-1">No artists profiles uploaded</h4>
            <p className="text-charcoal-light text-sm">We are preparing our artist profile views. Check back shortly!</p>
          </div>
        ) : (
          /* Artist Card Grid (3 columns desktop, 1 column mobile) */
          <div className="flex flex-wrap justify-center gap-8">
            {artists.map((artist, index) => {
              const delay = `delay-${((index % 3) + 1) * 100}`;
              return (
                <div key={artist.id} className={`reveal-item ${delay} w-full sm:w-[320px] md:w-[340px] flex-grow-0 shrink-0`}>
                  <ArtistCard artist={artist} />
                </div>
              );
            })}
          </div>
        )}

        <HennaDivider className="reveal-item" />

        {/* Extra Brand Badges under Artists */}
        <div className="reveal-item grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto text-center border border-gold/10 rounded-xl bg-white p-8 shadow-md">
          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 rounded-full bg-rose-light/50 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-burgundy" />
            </div>
            <h4 className="font-display text-xl font-bold text-burgundy mb-2">Heritage Artistry</h4>
            <p className="text-charcoal-light text-xs leading-relaxed font-sans font-light">
              We specialize in authentic Marwari, Arabic, Mandala, and traditional regional saree styles passed down through generations.
            </p>
          </div>

          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 rounded-full bg-rose-light/50 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-burgundy" />
            </div>
            <h4 className="font-display text-xl font-bold text-burgundy mb-2">100% Organic Henna</h4>
            <p className="text-charcoal-light text-xs leading-relaxed font-sans font-light">
              We prepare our own organic henna cones from triple-sifted Sojat mehndi leaves and pure essential oils for a safe, dark maroon stain.
            </p>
          </div>

          <div className="flex flex-col items-center p-4">
            <div className="w-12 h-12 rounded-full bg-rose-light/50 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-burgundy" />
            </div>
            <h4 className="font-display text-xl font-bold text-burgundy mb-2">Professional Hygiene</h4>
            <p className="text-charcoal-light text-xs leading-relaxed font-sans font-light">
              Our artists prioritize client comfort, cleanliness, and precise timing. We ensure a stress-free and seamless styling experience.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Artists;
