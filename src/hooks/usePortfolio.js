import { useState, useEffect } from 'react';

// Static portfolio items with fully-formed, non-truncated verified Unsplash URLs showing actual mehndi and sarees
const ALL_PORTFOLIO_ITEMS = [
  // 12 MEHENDI ITEMS
  // BRIDAL
  { 
    id: "m1", 
    category: "mehendi", 
    subcategory: "Bridal", 
    caption: "Royal Full Hand Bridal Mehendi", 
    imageURL: "https://images.unsplash.com/photo-1525135850648-b42365991054?w=600&q=80&fit=crop&auto=format" 
  },
  { 
    id: "m2", 
    category: "mehendi", 
    subcategory: "Bridal", 
    caption: "Dulhan Elaborate Bridal Pattern", 
    imageURL: "https://images.unsplash.com/photo-1702378154233-9b870ff8f1b3?w=600&q=80&fit=crop&auto=format" 
  },
  { 
    id: "m3", 
    category: "mehendi", 
    subcategory: "Bridal", 
    caption: "Rajasthani Peacock Bridal Design", 
    imageURL: "https://images.unsplash.com/photo-1530082625928-db66d39c5a21?w=600&q=80&fit=crop&auto=format" 
  },
  { 
    id: "m4", 
    category: "mehendi", 
    subcategory: "Bridal", 
    caption: "Heavy Mughal Inspired Bridal", 
    imageURL: "https://images.unsplash.com/photo-1684814070823-97e0b9e99c69?w=600&q=80&fit=crop&auto=format" 
  },

  // ARABIC
  { 
    id: "m5", 
    category: "mehendi", 
    subcategory: "Arabic", 
    caption: "Modern Arabic Floral Pattern", 
    imageURL: "https://images.unsplash.com/photo-1583878544826-8f8c418033ed?w=600&q=80&fit=crop&auto=format" 
  },
  { 
    id: "m6", 
    category: "mehendi", 
    subcategory: "Arabic", 
    caption: "Gulf Style Arabic Design", 
    imageURL: "https://images.unsplash.com/photo-1628834556809-fd4d8acad67c?w=600&q=80&fit=crop&auto=format" 
  },
  { 
    id: "m7", 
    category: "mehendi", 
    subcategory: "Arabic", 
    caption: "Minimalist Arabic Vine Design", 
    imageURL: "https://images.unsplash.com/photo-1619734089700-842e56497353?w=600&q=80&fit=crop&auto=format" 
  },

  // FUNCTION
  { 
    id: "m8", 
    category: "mehendi", 
    subcategory: "Function", 
    caption: "Engagement Ceremony Special", 
    imageURL: "https://images.unsplash.com/photo-1619733839322-1e28cdb928a0?w=600&q=80&fit=crop&auto=format" 
  },
  { 
    id: "m9", 
    category: "mehendi", 
    subcategory: "Function", 
    caption: "Baby Shower Mehendi Design", 
    imageURL: "https://images.unsplash.com/photo-1684813270065-73dce8b31b92?w=600&q=80&fit=crop&auto=format" 
  },
  { 
    id: "m10", 
    category: "mehendi", 
    subcategory: "Function", 
    caption: "Festival Special Mehendi", 
    imageURL: "https://images.unsplash.com/photo-1730003873829-09b4b16444c1?w=600&q=80&fit=crop&auto=format" 
  },

  // CASUAL
  { 
    id: "m11", 
    category: "mehendi", 
    subcategory: "Casual", 
    caption: "Simple Everyday Back Hand", 
    imageURL: "https://images.unsplash.com/photo-1610313898119-bfb803225bce?w=600&q=80&fit=crop&auto=format" 
  },
  { 
    id: "m12", 
    category: "mehendi", 
    subcategory: "Casual", 
    caption: "Minimalist Finger Design", 
    imageURL: "https://images.unsplash.com/photo-1525135927526-a01d9e5e9484?w=600&q=80&fit=crop&auto=format" 
  },

  // 10 SAREE ITEMS
  // NIVI STYLE
  { 
    id: "s1", 
    category: "saree", 
    subcategory: "Nivi", 
    caption: "Classic Nivi Silk Drape", 
    imageURL: "https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?w=600&q=80&fit=crop&auto=format" 
  },
  { 
    id: "s2", 
    category: "saree", 
    subcategory: "Nivi", 
    caption: "Kanjivaram Nivi Style", 
    imageURL: "https://images.unsplash.com/photo-1679006831648-7c9ea12e5807?w=600&q=80&fit=crop&auto=format" 
  },
  { 
    id: "s3", 
    category: "saree", 
    subcategory: "Nivi", 
    caption: "Contemporary Nivi Drape", 
    imageURL: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80&fit=crop&auto=format" 
  },

  // BENGALI STYLE
  { 
    id: "s4", 
    category: "saree", 
    subcategory: "Bengali", 
    caption: "Traditional Bengali Bridal Drape", 
    imageURL: "/images/saree/bengali_bridal_drape.png" 
  },
  { 
    id: "s5", 
    category: "saree", 
    subcategory: "Bengali", 
    caption: "Aath Poure Bengali Style", 
    imageURL: "/images/saree/bengali_aath_poure.png" 
  },

  // GUJARATI STYLE
  { 
    id: "s6", 
    category: "saree", 
    subcategory: "Gujarati", 
    caption: "Gujarati Seedha Pallu Style", 
    imageURL: "/images/saree/gujarati_seedha_pallu.png" 
  },
  { 
    id: "s7", 
    category: "saree", 
    subcategory: "Gujarati", 
    caption: "Gujarati Wedding Drape", 
    imageURL: "/images/saree/gujarati_wedding_drape.png" 
  },

  // LEHENGA STYLE
  { 
    id: "s8", 
    category: "saree", 
    subcategory: "Lehenga Style", 
    caption: "Modern Lehenga Saree Drape", 
    imageURL: "/images/saree/lehenga_saree_drape.png" 
  },
  { 
    id: "s9", 
    category: "saree", 
    subcategory: "Lehenga Style", 
    caption: "Bridal Lehenga Style Draping", 
    imageURL: "/images/saree/bridal_lehenga_drape.png" 
  },
  { 
    id: "s10", 
    category: "saree", 
    subcategory: "Lehenga Style", 
    caption: "Indo-Western Lehenga Drape", 
    imageURL: "/images/saree/indo_western_lehenga_drape.png" 
  }
];

/**
 * usePortfolio - Loads local static mehendi and saree data.
 * 
 * @param {string} category - The category to fetch ('mehendi' | 'saree').
 * @returns {Object} { items, loading, error: null }
 */
export const usePortfolio = (category) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate async network loading
    const timer = setTimeout(() => {
      const filtered = ALL_PORTFOLIO_ITEMS.filter(
        item => item.category === category
      );
      setItems(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [category]);

  return { items, loading, error: null };
};

export default usePortfolio;
