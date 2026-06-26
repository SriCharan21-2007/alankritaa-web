import React from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { buildWhatsAppURL } from '../utils/whatsapp';

/**
 * ArtistCard - Displays profiles of Alankrita's artists with custom badges and direct bookings.
 * 
 * @param {Object} props
 * @param {Object} props.artist - Artist details.
 */
const ArtistCard = ({ artist }) => {
  const { name, specialisation, experience, bio, photoURL, badge } = artist;

  // Extract first name for booking call-to-action button
  const firstName = name ? name.split(' ')[0] : 'Artist';

  // Build personalized WhatsApp booking link
  const bookingMessage = `Hi, I'd like to book ${name} for my event.`;
  const waURL = buildWhatsAppURL(bookingMessage);

  // Determine styling for colored badge pill (Lead: burgundy, Specialist: gold, Junior: rose)
  const getBadgeStyle = (badgeText) => {
    const text = badgeText ? badgeText.toLowerCase() : '';
    if (text.includes('lead')) {
      return 'bg-burgundy text-ivory';
    }
    if (text.includes('specialist')) {
      return 'bg-gold text-burgundy';
    }
    if (text.includes('junior')) {
      return 'bg-rose text-burgundy';
    }
    return 'bg-ivory-dark text-charcoal'; // Fallback
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl p-6 md:p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 border border-gold/10 group h-full">
      
      {/* Circular photo with gold ring border */}
      <div className="w-36 h-36 rounded-full border-2 border-gold p-1 bg-ivory shadow-inner select-none shrink-0 overflow-hidden flex items-center justify-center">
        <img
          src={photoURL}
          alt={name}
          loading="lazy"
          className="w-full h-full rounded-full object-cover object-top bg-rose-100"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://picsum.photos/seed/${artist.id || 'artist'}/300/300`;
          }}
        />
      </div>

      {/* Colored badge pill below photo */}
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide mt-4 mb-2 uppercase ${getBadgeStyle(badge)}`}>
        {badge || 'Stylist'}
      </span>

      {/* Artist Name */}
      <h3 className="text-2xl font-bold font-display text-burgundy mb-1 group-hover:text-gold transition-colors duration-300 leading-snug">
        {name}
      </h3>

      {/* Specialisation in small gold uppercase tracking-wide text */}
      <span className="text-gold text-xs font-bold uppercase tracking-wider font-sans mb-2 block">
        {specialisation}
      </span>

      {/* X Years Experience with star icon in charcoal */}
      <div className="flex items-center gap-1 text-xs text-charcoal font-semibold mb-4 select-none">
        <Star className="w-3.5 h-3.5 text-charcoal fill-current" />
        <span>{experience} Years Experience</span>
      </div>

      {/* Bio paragraph centered */}
      <p className="text-charcoal-light/90 text-sm leading-relaxed mb-6 font-sans font-light max-w-sm">
        {bio}
      </p>

      {/* WhatsApp Action Button */}
      <a
        href={waURL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full mt-auto flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-full transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#25D366]/40 cursor-pointer text-sm font-sans"
      >
        <MessageCircle className="w-4 h-4 shrink-0" />
        Book with {firstName}
      </a>
    </div>
  );
};

export default ArtistCard;
