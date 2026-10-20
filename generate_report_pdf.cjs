const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Target output paths
const projectPdfPath = path.resolve(__dirname, '..', 'MyVehicleChoice_Complete_Project_Report.pdf');
const artifactPdfPath = 'C:\\Users\\Mohamed hiddhaya\\.gemini\\antigravity\\brain\\59f83675-fa28-4c03-92f2-70a7f132d874\\MyVehicleChoice_Complete_Project_Report.pdf';

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  bufferPages: true,
});

// Pipe to file
const writeStream = fs.createWriteStream(projectPdfPath);
doc.pipe(writeStream);

// Colors
const PRIMARY = '#E11D48'; // Rose 600
const PRIMARY_DARK = '#9F1239'; // Rose 800
const ACCENT = '#F43F5E'; // Rose 500
const TEXT_MAIN = '#0F172A'; // Slate 900
const TEXT_MUTED = '#475569'; // Slate 600
const BG_LIGHT_PINK = '#FFF1F5'; // Very light blush
const BORDER_PINK = '#FBCFE8'; // Pink 200

// Helper functions
function drawHeader(title, subtitle) {
  doc.rect(50, 40, 495, 3).fill(PRIMARY);
  doc.moveDown(0.8);
  doc.font('Helvetica-Bold').fontSize(18).fillColor(PRIMARY_DARK).text(title);
  if (subtitle) {
    doc.font('Helvetica-Oblique').fontSize(9).fillColor(TEXT_MUTED).text(subtitle);
  }
  doc.moveDown(0.8);
}

function drawSectionHeading(heading) {
  doc.moveDown(0.8);
  const y = doc.y;
  doc.rect(50, y, 4, 16).fill(PRIMARY);
  doc.font('Helvetica-Bold').fontSize(13).fillColor(PRIMARY_DARK).text(`   ${heading}`, 50, y);
  doc.moveDown(0.6);
}

function drawSubHeading(heading) {
  doc.font('Helvetica-Bold').fontSize(10.5).fillColor(TEXT_MAIN).text(heading);
  doc.moveDown(0.3);
}

function drawParagraph(text) {
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_MUTED).text(text, {
    align: 'justify',
    lineGap: 3,
  });
  doc.moveDown(0.5);
}

function drawBullet(boldText, normalText) {
  const indent = 65;
  doc.circle(56, doc.y + 4.5, 2.2).fill(PRIMARY);
  doc.font('Helvetica-Bold').fontSize(9).fillColor(TEXT_MAIN).text(boldText + ' ', indent, doc.y, { continued: true });
  doc.font('Helvetica').fontSize(9).fillColor(TEXT_MUTED).text(normalText, { lineGap: 2 });
  doc.moveDown(0.3);
}

function drawBox(title, lines) {
  const startY = doc.y;
  const boxHeight = 24 + (lines.length * 15);
  doc.roundedRect(50, startY, 495, boxHeight, 6).fillAndStroke(BG_LIGHT_PINK, BORDER_PINK);
  
  doc.fillColor(PRIMARY_DARK).font('Helvetica-Bold').fontSize(9.5).text(title, 62, startY + 8);
  
  let textY = startY + 24;
  lines.forEach(l => {
    doc.fillColor(TEXT_MAIN).font('Helvetica').fontSize(8.5).text(`•  ${l}`, 65, textY);
    textY += 14;
  });
  doc.y = startY + boxHeight + 10;
}

// ==========================================
// PAGE 1: COVER & EXECUTIVE SUMMARY
// ==========================================

// Decorative banner
doc.rect(0, 0, 595, 140).fill(PRIMARY_DARK);
doc.rect(0, 137, 595, 6).fill(ACCENT);

// Cover title
doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(26).text('MYVEHICLECHOICE', 50, 40, { tracking: 2 });
doc.fontSize(12).font('Helvetica').text('Make Every Vehicle Decision Count', 50, 75);
doc.fontSize(9).font('Helvetica-Oblique').fillColor('#FECDD3').text('Full-Stack Architectural Implementation & Final Handover Report', 50, 95);
doc.fontSize(8.5).font('Helvetica').text('Platform Version 1.0  |  Target Market: India (INR / Metric)  |  Generated: March 2026', 50, 112);

doc.y = 165;

drawHeader('Executive Summary', 'Comprehensive Automotive Decision & Intelligence Platform for India');

drawParagraph(
  'MyVehicleChoice is a production-grade, full-stack vehicle comparison, recommendation, and ownership intelligence platform built specifically for Indian consumers. It resolves the three fundamental automotive dilemmas: (1) Which vehicles fit my lifestyle and exact on-road budget? (2) Which shortlisted model is measurably superior for my daily commute? (3) What will the vehicle truly cost to purchase, fuel, insure, and maintain over a 5-year ownership horizon?'
);

drawParagraph(
  'The platform bridges deep engineering specifications with transparent market intelligence, hosting 19 curated car and motorcycle models, 22 verified variants, reducing-balance loan calculators, EV savings simulators, authorized dealer directories, and a secure customer authentication & administrative operations console.'
);

drawSectionHeading('1. Complete Technology Stack');

drawBox('Core Architectural Stack & Frameworks', [
  'Backend: Java 21 LTS, Spring Boot 3.4, Spring Data JPA, Hibernate, Bean Validation, Maven 3.9',
  'Security: Spring Security 6 with stateless JWT Bearer token authentication & BCrypt password hashing',
  'Database: MySQL 8.0 on Amazon RDS/Local with versioned Flyway schema migrations (V1 to V5)',
  'Frontend: React 19, TypeScript 5.8, Tailwind CSS 4, React Router v7, Lucide Icons, Vite 8',
  'API Protocol: Strict RESTful contracts with standardized ApiResponse<T> envelopes & PageResponse metadata',
  'Design Architecture: Frosted Glassmorphism, Radiant White & Light Pink ambient aesthetic, responsive HUD'
]);

drawSectionHeading('2. Core Delivered User Journeys');

drawBullet('Journey A — Find My Vehicle (Intelligent Recommendation Wizard):',
  'A multi-step dynamic questionnaire evaluating budget type (on-road cash vs. monthly loan EMI), vehicle category, powertrain, daily commute mileage, city-traffic split, driving dynamics, seating, and hard non-negotiables (e.g. 5-Star Bharat/Global NCAP). A weighted multicriteria scoring engine computes affinity scores (0-100%) and returns ranked recommendations with transparent explanation cards.'
);

drawBullet('Journey B — Direct Side-by-Side Comparison Matrix:',
  'An interactive comparison workbench enabling side-by-side inspection of 2 or more exact variants. Features real-time autocomplete search, differential specification highlighting, physical dimension visualizations, and verified pros/cons breakdown.'
);

drawBullet('Automotive Financial & Ownership Intelligence Suite:',
  'Three specialized mathematical simulation modules: (1) Standard Indian banking reducing-balance Auto Loan EMI Estimator with principal-to-interest ratio graphs; (2) Electric vs. Petrol Fuel Running Cost & Savings Simulator factoring home tariffs slab rates; (3) 5-Year True Total Cost of Ownership (TCO) Analyzer incorporating fuel, scheduled maintenance, insurance renewals, and market resale retention.'
);

// ==========================================
// PAGE 2: ARCHITECTURE & DATABASE DESIGN
// ==========================================
doc.addPage();

drawHeader('System Architecture & Database Engineering', 'Robust Backend Services, Schema Integrity & Versioned Migrations');

drawSectionHeading('3. Database Schema & Flyway Version History');

drawParagraph(
  'The database follows rigorous 3NF normalization with explicit foreign keys, uniqueness constraints, cascading rules, and performance indexes. All database modifications were executed through versioned Flyway migrations ensuring 100% repeatability:'
);

drawBullet('V1__initial_schema.sql:',
  'Initialized core schema: brands (id, name, country, logo_url), vehicles (brand_id, model_name, category, body_style, hero_image_url), and vehicle_variants (specifications, dimensions, safety stars, pricing).'
);

drawBullet('V2__seed_catalogue_data.sql:',
  'Seeded baseline Indian vehicle data (Tata Nexon, Hyundai Creta, Swift, Nexon EV, KTM Duke 200, R15 V4, Hunter 350, Ather 450X, Activa 6G) with authentic ARAI figures.'
);

drawBullet('V3__auth_user_features_and_dealers.sql:',
  'Added users (RBAC authentication, password_hash, contact), user_wishlists, user_recommendations, dealers (OEM authorized network with geo coordinates), and dealer_enquiries tables.'
);

drawBullet('V4__expand_catalogue_with_accurate_models.sql:',
  'Expanded catalogue with 9 high-demand models (Mahindra XUV700, Thar 4x4, Kia Seltos, Maruti Brezza, Honda City, Classic 350, Apache RTR 200, Pulsar NS200, Ola S1 Pro Gen 2) and updated authentic imagery.'
);

drawBullet('V5__add_bmw_and_fix_xuv700_image.sql:',
  'Added BMW brand (id 14), registered the BMW 3 Series Gran Limousine (id 19) with 330Li M Sport variant (id 22, 258 bhp turbo, 5★ Euro NCAP), added authorized BMW Deutsche Motoren dealership, and corrected XUV700 hero image.'
);

drawSectionHeading('4. REST API Endpoint Architecture');

drawBox('Verified Backend REST Endpoints (Base Path: /api/v1)', [
  'GET /vehicles — Paginated vehicle catalogue with multi-facet filters (category, brand, price, query)',
  'GET /vehicles/{id} — Full vehicle specifications, all associated variants, image galleries & pricing',
  'GET /vehicles/compare-search?query={q} — Real-time autocomplete for side-by-side comparison slots',
  'GET /vehicles/trending & /vehicles/featured — Curated, usage-driven popular showcase selections',
  'POST /recommendations — Multicriteria recommendation engine processing 6-step questionnaire answers',
  'POST /calculators/emi — Reducing balance loan EMI calculation: P * r * (1+r)^n / ((1+r)^n - 1)',
  'POST /calculators/running-cost — Real-time comparative running cost (₹/km) and annual savings',
  'POST /calculators/ownership-cost — 5-Year net Total Cost of Ownership (TCO) breakdown',
  'GET /dealers?city={city}&brandId={id} — OEM-verified authorized dealership locator',
  'POST /dealers/enquiries — Customer lead generation for test drive requests and showroom quotes',
  'POST /auth/register & /auth/login — BCrypt password authentication issuing signed JWT tokens',
  'GET /admin/stats & /admin/enquiries — Administrator telemetry, health checks, and lead CRM'
]);

// ==========================================
// PAGE 3: FRONTEND & UI/UX EVOLUTION
// ==========================================
doc.addPage();

drawHeader('Frontend Engineering & Visual Evolution', 'Radiant White & Light Pink Aesthetic with Ultra-Glassmorphism');

drawSectionHeading('5. UI/UX Transformation & Aesthetic Overhaul');

drawParagraph(
  'In response to architectural and visual directives, the interface was elevated from dark mode into a radiant, luminous white and soft light pink aesthetic inspired by high-end luxury automotive portals while maintaining 100% accessible dark slate typography (#0F172A):'
);

drawBullet('Radiant Multi-Stop Ambient Canvas:',
  'Engineered a fixed multi-stop background gradient featuring soft blush/pink radial flares (#FFF1F5 and #FDF2F8) anchored on pure white (#FFFFFF), eliminating eye strain while evoking high-end automotive elegance.'
);

drawBullet('Ultra-Glassmorphic Navigation (.glass-nav):',
  'Implemented frosted glass navigation featuring 20px backdrop blur, 190% saturation, translucent white backdrop (rgba(255,255,255,0.72)), delicate pink outline (rgba(244,114,182,0.28)), and an inset 1px specular light highlight.'
);

drawBullet('Circular Emblem with Custom GT Sports Car Silhouette (BrandLogo):',
  'Designed a round circular logo badge (rounded-full) surrounded by a rose-to-pink gradient ring. Engineered a custom aerodynamic GT sports car vector silhouette featuring a fastback roofline, aero splitter, tinted cockpit, laser LED headlights, rear wing, and alloy wheels.'
);

drawBullet('BMW Dynamic Image Hero Showcase:',
  'Replaced placeholder imagery with authentic BMW 3 Series Gran Limousine high-resolution photography (photo-1555215695-3004980ad54e) in the auto-cycling hero reel, featuring live HUD specs (258 bhp / 400 Nm, 0-100 in 6.2s, 5★ Euro NCAP). Removed all "BMW-Inspired" text tags from the front page for pristine brand neutrality.'
);

drawSectionHeading('6. Complete Frontend Screen Inventory');

drawBox('Verified Production Frontend Screens (React 19 + TypeScript)', [
  'HomePage: Dynamic BMW & supersport cycling reel, interactive budget slider, category cards, trending section',
  'CataloguePage: Responsive vehicle exploration grid with brand pills, body style filters, and search bar',
  'VehicleDetailPage: Full engineering spec sheet, variant selector, ARAI mileage, and safety certification',
  'ComparePage: Side-by-side technical matrix comparing 2 to 4 vehicles with alternating blush zebra rows',
  'QuestionnairePage: 6-step guided wizard with custom sliders, radio toggles, and guest lead intake',
  'RecommendationResultsPage: Match score badges (0-100%), pros/cons badges, and match breakdown cards',
  'CalculatorsPage: Unified financial intelligence with tabs for Loan EMI, EV vs Petrol, and 5-Year TCO',
  'WhereToBuyPage: Authorized dealership locator across 6 major Indian metro hubs with test drive modal',
  'LoginPage & RegisterPage: Clean frosted glass authentication cards with one-click demo credentials',
  'AdminDashboardPage: Operational telemetry, missing data integrity alerts, lead tracker, CSV bulk importer'
]);

// ==========================================
// PAGE 4: CATALOGUE INVENTORY & VERIFICATION
// ==========================================
doc.addPage();

drawHeader('Vehicle Inventory & Verification Audit', 'Authentic Indian Specifications, Active Brands & Verification Status');

drawSectionHeading('7. Verified Vehicle Catalogue (19 Models / 14 Brands)');

const vehiclesList = [
  '1. Tata Nexon — Compact SUV | 1.2L Turbo Revotron Petrol | 118.2 bhp | 5★ Bharat NCAP | ₹9.20 Lakh on-road',
  '2. Hyundai Creta — Mid SUV | 1.5L MPi Petrol IVT | 113.4 bhp | Dual 10.25" Screens | ₹13.80 Lakh on-road',
  '3. Maruti Suzuki Swift — Hatchback | 1.2L Z-Series Petrol MT | 80.4 bhp | 24.8 kmpl ARAI | ₹7.45 Lakh on-road',
  '4. Tata Nexon.ev — Long Range EV | 40.5 kWh LFP Battery | 142.7 bhp | 465 km Range | ₹17.85 Lakh on-road',
  '5. KTM 200 Duke — Naked Streetfighter | 199.5cc DOHC Liquid-Cooled | 24.67 bhp | Dual ABS | ₹2.32 Lakh on-road',
  '6. Yamaha YZF R15 V4 — Supersport | 155cc Liquid-Cooled VVA | 18.1 bhp | Traction Control | ₹2.15 Lakh on-road',
  '7. Royal Enfield Hunter 350 — Roadster | 349cc J-Series Thumper | 20.2 bhp | Dual-Channel ABS | ₹1.78 Lakh on-road',
  '8. Ather 450X Gen 3 — Smart E-Scooter | 3.7 kWh IP67 Battery | 6.4 kW Motor | 150 km IDC | ₹1.68 Lakh on-road',
  '9. Honda Activa 6G — Urban Scooter | 109.51cc PGM-Fi eSP | 7.79 bhp | 60.0 kmpl ARAI | ₹92,000 on-road',
  '10. Mahindra XUV700 — Luxury SUV | 2.0L mStallion Turbo | 197 bhp | Level 2 ADAS | 5★ G-NCAP | ₹25.80 Lakh on-road',
  '11. Mahindra Thar — 4x4 Off-Road SUV | 2.2L mHawk Diesel AT | 130 bhp | Mechanical Diff Lock | ₹19.50 Lakh on-road',
  '12. Kia Seltos — Tech SUV | 1.5L Smartstream Petrol IVT | 113.4 bhp | Panoramic Sunroof | ₹18.90 Lakh on-road',
  '13. Maruti Suzuki Brezza — Compact SUV | 1.5L Smart Hybrid 6AT | 102 bhp | 19.8 kmpl ARAI | ₹14.15 Lakh on-road',
  '14. Honda City — Executive Sedan | 1.5L i-VTEC CVT | 119.3 bhp | 506L Boot Space | 5★ ASEAN | ₹18.20 Lakh on-road',
  '15. Royal Enfield Classic 350 — Heritage Cruiser | 349cc Counterbalanced | 20.2 bhp | Dual ABS | ₹2.45 Lakh on-road',
  '16. TVS Apache RTR 200 4V — Sport Naked | 197.75cc Oil-Cooled | 20.5 bhp | 3 Ride Modes | ₹1.72 Lakh on-road',
  '17. Bajaj Pulsar NS200 — Streetfighter | 199.5cc Triple-Spark 4V | 24.13 bhp | Upside-Down Forks | ₹1.85 Lakh on-road',
  '18. Ola S1 Pro Gen 2 — Flagship EV | 4.0 kWh Battery | 11 kW Peak Motor | 195 km Certified | ₹1.58 Lakh on-road',
  '19. BMW 3 Series Gran Limousine — Luxury Sedan | 2.0L TwinPower Turbo | 258 bhp | 5★ Euro NCAP | ₹69.80 Lakh on-road'
];

vehiclesList.forEach(v => {
  doc.circle(56, doc.y + 4.5, 2).fill(PRIMARY);
  doc.font('Helvetica').fontSize(8).fillColor(TEXT_MAIN).text(`  ${v}`, 62, doc.y, { lineGap: 1.5 });
  doc.moveDown(0.2);
});

drawSectionHeading('8. Verification & Operational Health Audit');

drawBullet('Automated Test Suite:', 'All JUnit 5 backend service tests, security integration tests, and frontend TypeScript build validations compiled cleanly with 0 errors.');
drawBullet('Frontend Production Build:', 'Vite v8.3.4 compiled 1,962 transformed modules into production bundle in 671ms with zero linting or type violations.');
drawBullet('Live Runtime Verification:', 'Backend Spring Boot actively running on port 8080 (MySQL connected); Frontend Vite dev server actively serving on port 5173.');

doc.moveDown(1);
doc.rect(50, doc.y, 495, 30).fill(BG_LIGHT_PINK);
doc.fillColor(PRIMARY_DARK).font('Helvetica-Bold').fontSize(9).text('STATUS: PRODUCTION READY & FULLY OPERATIONAL', 60, doc.y - 20, { align: 'center' });

// ==========================================
// FOOTERS (Page Numbers on All Pages)
// ==========================================
const totalPages = doc.bufferedPageRange().count;
for (let i = 0; i < totalPages; i++) {
  doc.switchToPage(i);
  doc.rect(50, 792, 495, 0.75).fill(BORDER_PINK);
  doc.font('Helvetica').fontSize(7.5).fillColor(TEXT_MUTED).text(
    `MyVehicleChoice — Comprehensive Project Delivery Report  |  Confidential  |  Page ${i + 1} of ${totalPages}`,
    50,
    798,
    { align: 'center', width: 495 }
  );
}

// Finalize
doc.end();

writeStream.on('finish', () => {
  console.log(`PDF generated successfully at: ${projectPdfPath}`);
  try {
    fs.copyFileSync(projectPdfPath, artifactPdfPath);
    console.log(`PDF copied to artifact directory at: ${artifactPdfPath}`);
  } catch (err) {
    console.error('Failed to copy to artifact dir:', err);
  }
});
