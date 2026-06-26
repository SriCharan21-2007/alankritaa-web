import React, { useState } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import CategoryFilter from '../components/CategoryFilter';
import GalleryGrid from '../components/GalleryGrid';
import Lightbox from '../components/Lightbox';

/**
 * SareeDrapingGallery - Displays saree portfolio designs.
 * Performs client-side exact match filtering on draping styles.
 */
const SareeDrapingGallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  // Load local static saree portfolio items
  const { items, loading, error } = usePortfolio('saree');

  const tabs = ['All', 'Nivi', 'Bengali', 'Gujarati', 'Lehenga Style'];

  // Case-sensitive exact filtering
  const filteredItems = activeFilter === 'All'
    ? items
    : items.filter(item => item.subcategory === activeFilter);

  return (
    <div className="pt-24 pb-20 bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.25em] block mb-2">
            Portfolio
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-burgundy mb-4">
            Saree Draping Styles
          </h1>
          <p className="text-charcoal-light text-sm md:text-base max-w-xl mx-auto font-sans font-light leading-relaxed">
            Witness the beauty of structured sarees draped in regional variations and contemporary styling.
          </p>
        </div>

        {/* Category Filters */}
        <CategoryFilter
          tabs={tabs}
          activeTab={activeFilter}
          onTabChange={setActiveFilter}
        />

        {/* Gallery Grid */}
        <GalleryGrid
          items={filteredItems}
          loading={loading}
          error={error}
          onImageClick={setSelectedImage}
        />
      </div>

      {/* Fullscreen Lightbox Overlay */}
      <Lightbox
        item={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default SareeDrapingGallery;
