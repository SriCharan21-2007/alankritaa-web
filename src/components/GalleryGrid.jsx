import React from 'react';

/**
 * GalleryGrid - Displays a responsive portfolio grid.
 * It is completely stateless regarding fetching and relies on the parent's filtered items.
 * 
 * @param {Object} props
 * @param {Array} props.items - Filtered list of mehendi or saree portfolio items.
 * @param {boolean} props.loading - Parent loading state.
 * @param {string} props.error - Parent error message.
 * @param {function} props.onImageClick - Image zoom selection trigger.
 */
const GalleryGrid = ({ items, loading, error, onImageClick }) => {
  
  // Loading skeleton boxes
  if (loading) {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 3xl:grid-cols-4 gap-6 md:gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="overflow-hidden aspect-square rounded-xl shimmer-loading bg-rose-100/50 w-full" />
        ))}
      </div>
    );
  }

  // Error boundary
  if (error) {
    return (
      <div className="text-center py-12 max-w-md mx-auto">
        <p className="text-rose-dark text-sm font-semibold mb-2">Error Loading Gallery</p>
        <p className="text-charcoal-light text-xs font-light">{error}</p>
      </div>
    );
  }

  // Empty state fallback
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16 bg-ivory-dark/30 rounded-xl border border-gold/10 max-w-md mx-auto px-6">
        <h4 className="text-lg font-display text-burgundy font-bold mb-1">No items found</h4>
        <p className="text-charcoal-light text-sm">Please try selecting another filter tab.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 3xl:grid-cols-4 gap-6 md:gap-8">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onImageClick && onImageClick(item)}
          className="overflow-hidden aspect-square rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group relative cursor-pointer"
        >
          {/* Main Image with onError fallback, lazy, anonymous CORS, and background rose-100 */}
          <img
            src={item.imageURL}
            alt={item.caption || 'Alankrita design'}
            loading="lazy"
            className="w-full aspect-square object-cover rounded-xl bg-rose-100 hover:scale-105 transition-transform duration-300 cursor-pointer"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://picsum.photos/seed/${item.id}/600/600`;
            }}
          />

          {/* Hover Overlay Caption */}
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy/90 via-burgundy/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 select-none pointer-events-none">
            <span className="text-gold text-xs uppercase tracking-widest font-semibold font-sans mb-1 block">
              {item.subcategory}
            </span>
            <p className="text-ivory text-sm font-medium font-sans leading-snug line-clamp-2">
              {item.caption || 'Exquisite Artistry'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
