import React, { useState } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import CategoryFilter from '../components/CategoryFilter';
import GalleryGrid from '../components/GalleryGrid';
import Lightbox from '../components/Lightbox';

/**
 * MehendiGallery - Displays mehendi portfolio designs.
 * Performs client-side exact match filtering on subcategories.
 */
const MehendiGallery = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Load local static mehendi portfolio items
  const { items, loading, error } = usePortfolio('mehendi');

  const tabs = ['All', 'Bridal', 'Function', 'Casual', 'Arabic'];

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
            Mehendi Designs
          </h1>
          <p className="text-charcoal-light text-sm md:text-base max-w-xl mx-auto font-sans font-light leading-relaxed">
            Discover a gallery of beautiful henna designs, ranging from elaborate bridal layouts to modern Arabic patterns.
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

export default MehendiGallery;
