/**
 * Firestore Database Seeder Script
 * Run with: node seedFirestore.js
 * 
 * Manually parses the project's .env file to configure Firebase, 
 * then uploads sample portfolio items, services, and artists.
 */

const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  writeBatch, 
  doc, 
  getDocs,
  deleteDoc,
  serverTimestamp 
} = require('firebase/firestore');

// 1. Manually parse .env variables to keep scripts lightweight
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error("❌ Error: .env file not found. Please create one in the root of 'alankrita-web'.");
  process.exit(1);
}

const env = {};
const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
envLines.forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value.trim();
  }
});

// Validate configuration
const missing = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_PROJECT_ID'].filter(k => !env[k] || env[k].includes('your_'));
if (missing.length > 0) {
  console.error("❌ Error: Missing or default Firebase keys in .env. Setup those variables first.");
  process.exit(1);
}

// 2. Initialize Firebase Client
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. Define Seed Data
const portfolioItems = [
  // 8 Mehendi Items
  {
    category: 'mehendi',
    subcategory: 'Bridal',
    imageURL: 'https://picsum.photos/600/600?random=11',
    caption: 'Full-hand Rajasthani bridal layout showing traditional floral motifs and elephant designs.',
    featured: true,
    displayOrder: 1
  },
  {
    category: 'mehendi',
    subcategory: 'Bridal',
    imageURL: 'https://picsum.photos/600/600?random=12',
    caption: 'Detailed peacock and mandala bridal design spreading from fingertips to elbows.',
    featured: true,
    displayOrder: 2
  },
  {
    category: 'mehendi',
    subcategory: 'Bridal',
    imageURL: 'https://picsum.photos/600/600?random=13',
    caption: 'Exquisite modern grid-patterned bridal mehendi with negative space floral elements.',
    featured: false,
    displayOrder: 3
  },
  {
    category: 'mehendi',
    subcategory: 'Arabic',
    imageURL: 'https://picsum.photos/600/600?random=14',
    caption: 'Sleek diagonal flow Arabic trail mehendi featuring shaded rose vines.',
    featured: true,
    displayOrder: 4
  },
  {
    category: 'mehendi',
    subcategory: 'Arabic',
    imageURL: 'https://picsum.photos/600/600?random=15',
    caption: 'Contemporary bold Arabic design with heavy outlines and leaf clusters.',
    featured: false,
    displayOrder: 5
  },
  {
    category: 'mehendi',
    subcategory: 'Function',
    imageURL: 'https://picsum.photos/600/600?random=16',
    caption: 'Intricate circle mandala back-hand mehendi for pre-wedding functions.',
    featured: false,
    displayOrder: 6
  },
  {
    category: 'mehendi',
    subcategory: 'Casual',
    imageURL: 'https://picsum.photos/600/600?random=17',
    caption: 'Simple minimalist finger vines and wrist band pattern for festive wear.',
    featured: false,
    displayOrder: 7
  },
  {
    category: 'mehendi',
    subcategory: 'Casual',
    imageURL: 'https://picsum.photos/600/600?random=18',
    caption: 'Delicate botanical branch elements applied on the palms.',
    featured: false,
    displayOrder: 8
  },

  // 6 Saree Items
  {
    category: 'saree',
    subcategory: 'Nivi',
    imageURL: 'https://images.unsplash.com/photo-1618901185975-d59f7091bcfe?w=600&q=80&fit=crop&auto=format',
    caption: 'Classic Nivi style drape with clean front pleats and side shoulder cowl on gold silk.',
    featured: true,
    displayOrder: 9
  },
  {
    category: 'saree',
    subcategory: 'Bengali',
    imageURL: '/images/saree/bengali_bridal_drape.png',
    caption: 'Traditional Bengali style drape in red-and-white Garad silk, complete with single large box pleats.',
    featured: true,
    displayOrder: 10
  },
  {
    category: 'saree',
    subcategory: 'Gujarati',
    imageURL: '/images/saree/gujarati_seedha_pallu.png',
    caption: 'Gujarati Seedha Pallu style draping showcasing detailed border embroidery on the front chest.',
    featured: true,
    displayOrder: 11
  },
  {
    category: 'saree',
    subcategory: 'Lehenga Style',
    imageURL: '/images/saree/lehenga_saree_drape.png',
    caption: 'Contemporary Lehenga style pleating with double-pallu accent for modern wedding parties.',
    featured: false,
    displayOrder: 12
  },
  {
    category: 'saree',
    subcategory: 'Nivi',
    imageURL: 'https://images.unsplash.com/photo-1679006831648-7c9ea12e5807?w=600&q=80&fit=crop&auto=format',
    caption: 'Structured premium silk Nivi style with high waist pleats and pinned sleek shoulder trail.',
    featured: false,
    displayOrder: 13
  },
  {
    category: 'saree',
    subcategory: 'Lehenga Style',
    imageURL: '/images/saree/bridal_lehenga_drape.png',
    caption: 'Festive Lehenga style drape using a lightweight organza saree.',
    featured: false,
    displayOrder: 14
  }
];

const services = [
  {
    name: 'Royal Bridal Mehendi',
    description: 'Immaculate, highly-detailed bridal henna. Features custom figures (bride/groom portrait, elephant, doli), dense filler shading, and customized patterns trailing up to the elbows.',
    startingPrice: 8500,
    packageOptions: [
      'Full hand application up to elbows (both sides)',
      'Detailed feet application up to ankles',
      'Organic Sojat henna cones with rich essential oils',
      'Free post-stain aftercare oil and instructions sheet'
    ],
    whatsappMessage: 'Hi Alankrita, I would like to book the Royal Bridal Mehendi package for my upcoming wedding.',
    displayOrder: 1
  },
  {
    name: 'Celebration Guest Mehendi',
    description: 'Perfect for sangeet functions, baby showers, or bridal guest styling. Quick yet beautiful traditional and Arabic patterns designed to accommodate multiple guests efficiently.',
    startingPrice: 3500,
    packageOptions: [
      'Up to 10 guests styled (single-sided palm trails)',
      'Experienced artist team deployed based on guest counts',
      'Fast, high-quality application under 10 minutes per hand',
      'Flexible addition of guests at pro-rated pricing'
    ],
    whatsappMessage: 'Hi Alankrita, I would like to enquire about the Celebration Guest Mehendi package for my pre-wedding event.',
    displayOrder: 2
  },
  {
    name: 'Premium Saree Draping',
    description: 'Immaculate saree pleating and styling in regional variations. Ensure a stress-free and flawless look with structural security that stays in place all day.',
    startingPrice: 1500,
    packageOptions: [
      'Classic Nivi, Bengali, Gujarati, or Lehenga styles',
      'On-the-spot ironing and preset safety pinning',
      'Draping support for heavy silks and designer fabrications',
      'Includes placement of jewelry/waist-belts'
    ],
    whatsappMessage: 'Hi Alankrita, I want to book the Premium Saree Draping package for my event.',
    displayOrder: 3
  },
  {
    name: 'Bridal Styling Combo',
    description: 'The ultimate styling combo. Combines our signature royal bridal mehendi application with premium saree draping for the wedding and reception events.',
    startingPrice: 12000,
    packageOptions: [
      'Full hand + feet Royal Bridal Mehendi application',
      'Two separate saree draping sessions (Wedding + Reception)',
      'Priority booking slots and founder-led deployment',
      'Includes drape styling for up to 3 bridal bridesmaids'
    ],
    whatsappMessage: 'Hi Alankrita, I would like to book the complete Bridal Styling Combo package for my wedding.',
    displayOrder: 4
  }
];

const artists = [
  {
    name: 'Alankrita Sharma',
    specialisation: 'Master Henna Artist & Founder',
    experience: 12,
    bio: 'Founder of Alankrita, Alankrita is a pioneer in Rajasthani and Marwari bridal henna design. Known for her micro-detailed figure sketches, portrait drawings, and deep understanding of natural henna stains.',
    photoURL: 'https://picsum.photos/300/300?random=51',
    displayOrder: 1
  },
  {
    name: 'Radha Reddy',
    specialisation: 'Senior Saree Stylist',
    experience: 8,
    bio: 'Radha has styled over 400 brides across South India. She is an expert in draping heavy Kanjeevarams, Banarasis, and handling complex bridal lehenga style drapes, prioritizing comfort and structural precision.',
    photoURL: 'https://picsum.photos/300/300?random=52',
    displayOrder: 2
  }
];

const inquiries = [
  {
    name: 'Sample Inquiry',
    phone: '9876543210',
    eventDate: '2026-10-15',
    serviceType: 'Royal Bridal Mehendi',
    message: 'This is a sample inquiry to verify database write functionality. Please delete.',
    status: 'new'
  }
];

// Helper to delete existing items in a collection to avoid duplicates
const clearCollection = async (collectionName) => {
  const colRef = collection(db, collectionName);
  const snapshot = await getDocs(colRef);
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  console.log(`🧹 Cleared old records from: ${collectionName}`);
};

// 4. Executing Seeder
const seed = async () => {
  console.log("🌱 Starting database seeding process...");
  try {
    // Clear collections first
    await clearCollection('portfolio_items');
    await clearCollection('services');
    await clearCollection('artists');
    await clearCollection('inquiries');

    const batch = writeBatch(db);

    // Seed Portfolio Items
    portfolioItems.forEach(item => {
      const docRef = doc(collection(db, 'portfolio_items'));
      batch.set(docRef, {
        ...item,
        uploadedAt: serverTimestamp()
      });
    });

    // Seed Services
    services.forEach(svc => {
      const docRef = doc(collection(db, 'services'));
      batch.set(docRef, svc);
    });

    // Seed Artists
    artists.forEach(art => {
      const docRef = doc(collection(db, 'artists'));
      batch.set(docRef, art);
    });

    // Seed sample inquiry
    inquiries.forEach(inq => {
      const docRef = doc(collection(db, 'inquiries'));
      batch.set(docRef, {
        ...inq,
        submittedAt: serverTimestamp()
      });
    });

    // Commit changes
    await batch.commit();
    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
