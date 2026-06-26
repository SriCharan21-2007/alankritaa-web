# AlankritaWeb

AlankritaWeb is a production-ready, full-stack website built for **Alankrita** — a premium mehendi artistry and saree draping business based in Hyderabad. The platform provides a dynamic showcase of design portfolios, pricing details, and artist bios, along with an interactive inquiry form that writes data to Firestore and alerts administrative staff via EmailJS.

---

## ═══════════════════════════════════════════
## Tech Stack
## ═══════════════════════════════════════════

- **Frontend Core**: React.js + Vite (for lightning-fast bundling)
- **Styling**: Tailwind CSS (custom config containing brand color tokens & typography)
- **Routing**: React Router v6
- **Database / Storage / Hosting**: Firebase (Firestore, Cloud Storage, Hosting)
- **Email Notifications**: EmailJS Integration
- **Iconography**: Lucide React
- **Typography**: Google Fonts (Cormorant Garamond & DM Sans)

---

## ═══════════════════════════════════════════
## Prerequisites
## ═══════════════════════════════════════════

Ensure the following tools are installed on your development system:
- [Node.js](https://nodejs.org/) (Version 18.x or later recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- [Firebase CLI](https://firebase.google.com/docs/cli) (installed globally via `npm install -g firebase-tools`)

---

## ═══════════════════════════════════════════
## Folder Structure
## ═══════════════════════════════════════════

```text
alankrita-web/
├── public/
│   └── favicon.ico               # Transparent icon placeholder
├── src/
│   ├── assets/
│   │   └── henna-divider.svg     # Decorative brand SVG separator
│   ├── components/
│   │   ├── Navbar.jsx            # Sticky navigation with mobile hamburger
│   │   ├── Footer.jsx            # Links, details, social redirects
│   │   ├── WhatsAppCTA.jsx       # Floating green chat widget
│   │   ├── GalleryGrid.jsx       # Grid layouts with loading skeletons
│   │   ├── CategoryFilter.jsx    # Client-side filtering subcategory tabs
│   │   ├── Lightbox.jsx          # Overlay for zooming portfolio work
│   │   ├── ServiceCard.jsx       # Pricing detail and booking triggers
│   │   ├── ArtistCard.jsx        # Stylist profiles and specialization badges
│   │   ├── InquiryForm.jsx       # Full contact forms with EmailJS bindings
│   │   └── HennaDivider.jsx      # Component wrapper around signature SVG
│   ├── pages/
│   │   ├── Home.jsx              # Landing showcasing intro, work & service teasers
│   │   ├── MehendiGallery.jsx    # Mehendi gallery with subcategory filters
│   │   ├── SareeDrapingGallery.jsx # Saree gallery with subcategory filters
│   │   ├── Services.jsx          # Services details and pricing packages
│   │   ├── Artists.jsx           # Stylist profiles
│   │   └── Contact.jsx           # Form + direct WhatsApp cards
│   ├── firebase/
│   │   ├── config.js             # Firebase SDK instance initializes
│   │   ├── portfolio.js          # Firestore portfolio items collection reads
│   │   ├── services.js           # Firestore service collection reads
│   │   ├── artists.js            # Firestore artists collection reads
│   │   └── inquiries.js          # Firestore inquiry writes
│   ├── hooks/
│   │   ├── usePortfolio.js       # Hook managing portfolio items state
│   │   ├── useServices.js        # Hook managing services listings state
│   │   └── useArtists.js         # Hook managing artist profile state
│   ├── utils/
│   │   └── whatsapp.js           # Click-to-chat link encoder & builder
│   ├── App.jsx                   # Layout container and routing tables
│   ├── main.jsx                  # Vite mount entry point
│   └── index.css                 # CSS entry importing Google fonts & tailwind
├── .env                          # Local environment variables
├── .env.example                  # Variables template
├── firebase.json                 # Firebase configuration directives
├── .firebaserc                   # Targeted project definition
├── firestore.rules               # Firestore security access rules
├── storage.rules                 # Cloud Storage security access rules
├── firestore.indexes.json        # Composite indexes configuration
├── tailwind.config.js            # Tailwind custom colors and font configurations
├── vite.config.js                # React-Vite compiler configuration
├── package.json                  # Dependencies manifest
└── README.md                     # Current documentation file
```

---

## ═══════════════════════════════════════════
## Environment Variables (`.env`)
## ═══════════════════════════════════════════

Create a `.env` file in the project root containing your live project credentials. (Refer to `.env.example` as a template):

```ini
# Firebase Credentials (Vite requires VITE_ prefixes)
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Target WhatsApp Phone Number (Must include Country Code, e.g. 91 for India, digits only)
VITE_WHATSAPP_NUMBER=919999999999

# EmailJS Service Credentials for automated form notifications
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

---

## ═══════════════════════════════════════════
## Firebase Setup Steps
## ═══════════════════════════════════════════

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named **AlankritaWeb** (or select an existing project).
3. Under **Build**, select **Firestore Database** and click **Create Database**. Choose your region and start in test mode (or production mode, as we will deploy rules directly).
4. Under **Build**, select **Storage** and click **Get Started**. Configure regions and initial access.
5. Under **Project Settings** (gear icon), click **Add App** & select **Web (`</>`)** to register your application. Copy the configuration fields and paste them into your local `.env` file.
6. Initialize Firebase CLI locally by running:
   ```bash
   firebase login
   firebase use --add [YOUR_FIREBASE_PROJECT_ID]
   ```
7. Apply our security rules and composite indexes:
   ```bash
   firebase deploy --only firestore:rules,storage:rules,firestore:indexes
   ```

---

## ═══════════════════════════════════════════
## EmailJS Setup Steps
## ═══════════════════════════════════════════

1. Register an account at [EmailJS](https://www.emailjs.com/).
2. Add a new **Email Service** (e.g., connect Gmail or another SMTP host). Copy your `Service ID`.
3. Create a new **Email Template**. Configure the email template subject and content using double curly braces to receive parameters. Match these variables:
   - `{{from_name}}` (Inquirer's Name)
   - `{{from_phone}}` (Inquirer's Contact Number)
   - `{{event_date}}` (Date of event)
   - `{{service_type}}` (Requested styling service package)
   - `{{message}}` (Custom requirements)
4. Save the template and copy your `Template ID`.
5. Under **Account / Integration**, copy your `Public Key`.
6. Insert these keys into your local `.env` file.

---

## ═══════════════════════════════════════════
## Installation & Seeding
## ═══════════════════════════════════════════

Follow these steps to run the site locally:

1. Clone or navigate into the `alankrita-web` directory.
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Seed your Firestore database collections with realistic test data (8 mehendi items, 6 saree items, 4 services, and 2 artists):
   ```bash
   node seedFirestore.js
   ```
   *Note: Ensure your `.env` contains valid Firebase credentials so that Node can authenticate writes to your database.*

---

## ═══════════════════════════════════════════
## Commands Reference
## ═══════════════════════════════════════════

### Run Locally (Dev Server)
Launches the Vite dev server with hot module replacement at [http://localhost:5173/](http://localhost:5173/):
```bash
npm run dev
```

### Build for Production
Compiles optimization bundles under the `dist/` directory. Validates types and checks asset integrity:
```bash
npm run build
```

### Local Preview
Launches a server to view the built production code in `dist/` locally:
```bash
npm run preview
```

### Deploy to Firebase Hosting
Publishes the compiled production build directly to Firebase Hosting:
```bash
firebase deploy --only hosting
```
Or deploy everything at once:
```bash
firebase deploy
```
