import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Lightbox - Fullscreen image overlay overlay.
 * Dismisses on outside-click, ESC key, or X close button.
 * 
 * @param {Object} props
 * @param {Object} props.item - The portfolio item object containing imageURL and caption.
 * @param {function} props.onClose - Callback to trigger modal close.
 */
const Lightbox = ({ item, onClose }) => {
  const closeButtonRef = useRef(null);

  // Manage body scroll lock and focus restore/capture
  useEffect(() => {
    if (!item) return;

    // Prevent background scrolling when lightbox is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Store the element that was focused before opening
    const previousActiveElement = document.activeElement;

    // Focus the close button for accessibility & immediate keyboard focus
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      
      // Return focus to the previously active element
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [item, onClose]);

  if (!item) return null;

  // Handle click on the backdrop overlay itself
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[10000] bg-black/95 flex flex-col justify-center items-center p-4 animate-fade-in"
    >
      {/* Close Button */}
      <button 
        ref={closeButtonRef}
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 p-2 bg-charcoal-dark/50 hover:bg-gold hover:text-burgundy rounded-full text-ivory hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {/* Main Container */}
      <div className="flex flex-col items-center max-w-5xl w-full animate-zoom-in">
        {/* Centered Image */}
        <div className="relative flex items-center justify-center">
          <img 
            src={item.imageURL || 'https://picsum.photos/1000/1000'} 
            alt={item.caption || 'Alankrita Portfolio Work'} 
            loading="lazy"
            className="max-w-[90vw] max-h-[60vh] xs:max-h-[65vh] sm:max-h-[70vh] md:max-h-[75vh] object-contain rounded-lg shadow-2xl border border-gold/15 select-none bg-rose-100"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://picsum.photos/seed/${item.id || 'lightbox'}/600/600`;
            }}
            onClick={(e) => e.stopPropagation()} // Stop click propagation to background
          />
        </div>

        {/* Caption Card */}
        {item.caption && (
          <div className="text-center mt-4 px-4 sm:px-6 max-w-xl">
            <span className="text-gold text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold block mb-1">
              {item.subcategory}
            </span>
            <p className="text-ivory font-serif text-sm sm:text-base md:text-lg leading-relaxed select-text font-light">
              {item.caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lightbox;
