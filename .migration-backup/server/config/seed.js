const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Product = require("../models/Product");

// Load env vars from the parent vibrant folder
dotenv.config({ path: path.join(__dirname, "../../.env") });

const products = [
  {
    name: 'VIBRANT Obsidian Cyber-Hoodie',
    description: 'Heavyweight 450GSM loopback cotton hoodie in deep matte black. Features high-density fluorescent neon pink "VIBRANT" chest embroidery, double-layered hood design, and stealth drop shoulder aesthetic.',
    price: 135.00,
    category: 'New Arrivals',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Matte Black & Neon Pink'],
    imageUrl: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556821813-e4d6a6a090e7?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 25
  },
  {
    name: 'Cyberpunk Neon-Stitched Joggers',
    description: 'Loose-fit utility sweatpants in tech-obsidian black. Interlaced with high-visibility hot pink stitching, double tactical cargo pockets, and adjustable black straps.',
    price: 110.00,
    category: 'Men',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Tech Obsidian & Hot Pink'],
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 18
  },
  {
    name: 'VIBRANT Holographic Shell Jacket',
    description: 'Waterproof matte technical windbreaker. Under low light, the shell activates a mysterious holographic cyber pink and deep violet reflective gradient layout.',
    price: 245.00,
    category: 'New Arrivals',
    sizes: ['M', 'L', 'XL'],
    colors: ['Stealth Black & Holographic Pink'],
    imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 12
  },
  {
    name: 'Raw Obsidian Carpenter Pants',
    description: 'Rugged 14oz raw black canvas denim featuring contrast hot-pink double needle stitching, reinforced knee panels, hammer loop, and tactical utility hooks.',
    price: 185.00,
    category: 'Men',
    sizes: ['S', 'M', 'L'],
    colors: ['Raw Obsidian & Cyber Pink'],
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 3
  },
  {
    name: 'Neon Matrix Utility Chest-Rig',
    description: 'Low-profile tactical chest harness featuring a glowing purple-pink cyberpunk strap layout and quick-release custom alloy hardware buckles.',
    price: 85.00,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Obsidian Black & Acid Pink'],
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 15
  },
  {
    name: 'Frayed Hem Off-Black Crewneck',
    description: 'Heavy loopback French terry crewneck with distressed hem detailing. Features a micro hot pink logo tag on the sleeve cuff.',
    price: 115.00,
    category: 'Women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Faded Charcoal & Pink Accent'],
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 22
  },
  {
    name: 'Cyber-Glow Thermal Balaclava',
    description: 'Technical fine-knit balaclava with high-performance thermal lining. Hand-knit outline under deep hot pink ambient accent glow with micro brand stitching.',
    price: 45.00,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Stealth Black & Neon Pink'],
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 50
  },
  {
    name: 'Washed Sage & Pink Ribbed Beanie',
    description: 'Chunky double-cuffed heavy rib knit cap in dark sage charcoal. Features a signature fluorescent pink woven brand tag on the cuff fold.',
    price: 35.00,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Sage Charcoal & Cyber Pink'],
    imageUrl: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608748010899-18f300247112?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 4
  },
  {
    name: 'Stealth Matrix Cargo Pants',
    description: 'Technical cargo pants with modular harness straps, weather-sealed utility zippers, and dual neon-pink adjustable drawstring ankle ties.',
    price: 165.00,
    category: 'New Arrivals',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Cyber Obsidian & Neon Pink Accent'],
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517462964-21fdcec3f25b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 14
  },
  {
    name: 'Cyber Runner Neon Sole Sneakers',
    description: 'Futuristic streetwear runners featuring high-rebound hot-pink neon platform soles, stealth black mesh upper, and neon speed locks.',
    price: 210.00,
    category: 'New Arrivals',
    sizes: ['8', '9', '10', '11'],
    colors: ['Shadow Black & Neon Pink Core'],
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 8
  },
  {
    name: 'Minimalist Cyber-Trench Parka',
    description: 'Oversized high-collared utility trench parka. Features custom matte-black weather snaps and subtle hot-pink internal lining details.',
    price: 195.00,
    category: 'Women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Asphalt Black & Pink Trim'],
    imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 20
  },
  {
    name: 'Retro Cyber-Glow Puffer Jacket',
    description: 'Boxy retro puffer packed with ultimate thermal down. High-sheen black nylon exterior accented with glowing neon-pink interior panels.',
    price: 260.00,
    category: 'New Arrivals',
    sizes: ['M', 'L', 'XL'],
    colors: ['Stealth Black & Cyber Pink'],
    imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 2
  },
  {
    name: 'VIBRANT Graphic Tee "Cyber-Glow"',
    description: '280GSM heavy combed cotton t-shirt. Features a dark vintage wash black finish and a glowing hot pink cyberpunk skull graphic.',
    price: 55.00,
    category: 'Men',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Washed Black & Neon Pink Graphic'],
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 45
  },
  {
    name: 'Asymmetrical Neon-Zip Bomber',
    description: 'Flight nylon tech bomber with custom asymmetrical neon pink hardware zippers. Quilted hot-pink and safety orange interior insulation.',
    price: 220.00,
    category: 'New Arrivals',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Tech Obsidian & Neon Pink Hardware'],
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 10
  },
  {
    name: 'Vintage Obsidian Carpenter Shorts',
    description: 'Heavy washed black denim carpenter shorts with utility double-knees, custom hammer loops, and high-contrast neon pink stitching details.',
    price: 145.00,
    category: 'Men',
    sizes: ['30', '32', '34'],
    colors: ['Vintage Obsidian & Hot Pink Stitching'],
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 7
  },
  {
    name: 'High-Waist Modular cyber-Joggers',
    description: 'Ultra-light technical windbreaker joggers for women. Outlined with functional hot pink side snap leg slits and elasticated drawstring waistband.',
    price: 125.00,
    category: 'Women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Shadow Black & Cyber Pink Snaps'],
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 16
  },
  {
    name: 'Pink Chrome Reflective Sunglasses',
    description: 'High-fidelity wrap-around shield sunglasses featuring a highly polished pink chrome mirrored polarized lens and strong matte-black frame.',
    price: 95.00,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Matte Black & Pink Chrome Mirror'],
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 35
  },
  {
    name: 'Heavyweight Washed Cyber-Mockneck',
    description: 'High snug ribbed mock collar crewneck. Made in Tokyo using heavyweight 450GSM loopback terry fabric with washed-out vintage seams and a hot pink logo.',
    price: 125.00,
    category: 'New Arrivals',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Vintage Washed Black & Hot Pink Logo'],
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 22
  },
  {
    name: 'VIBRANT Obsidian Suede Overshirt',
    description: 'Luxury vegan ultra-suede casual snap shirt in deep matte obsidian black. Elevated by a custom neon-pink interior collar trim and laser-engraved snaps.',
    price: 175.00,
    category: 'Men',
    sizes: ['S', 'M', 'L'],
    colors: ['Obsidian Black & Neon Pink Collar Seam'],
    imageUrl: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 9
  },
  {
    name: 'Cropped Matrix Shell Windbreaker',
    description: 'High active crop windbreaker jacket in matrix-grid black ripstop nylon, featuring fluorescent pink zip detailing and elastic cinch closures.',
    price: 140.00,
    category: 'Women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Matrix Black & Fluorescent Pink'],
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 14
  },
  {
    name: 'VIBRANT Knit Sweater Cyber-Vest',
    description: 'Chunky rib knit sweater vest with heavily frayed distressed cuffs and hems. Features neon pink yarn weave detailing embedded in the black fabric.',
    price: 110.00,
    category: 'New Arrivals',
    sizes: ['S', 'M', 'L'],
    colors: ['Matte Black & Neon Pink Weave'],
    imageUrl: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608234807905-4465857b282d?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 5
  },
  {
    name: 'Technical Cordura Sling Waist Bag',
    description: 'Heavyweight Cordura tactical crossbody waist bag in black, with hot-pink strap loops and micro brand badges. Double compartment zip layout.',
    price: 75.00,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Tactical Black & Hot Pink Webbing'],
    imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 40
  },
  {
    name: 'Balaclava Utility Cargo Hoodie',
    description: 'Heavy black thermal cotton knit hoodie featuring a built-in modular face mask overlay in neon pink fine ribbed knit fabric.',
    price: 155.00,
    category: 'Men',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Stealth Black & Neon Pink Overlay'],
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 12
  },
  {
    name: 'Distressed Obsidian Flare Pants',
    description: 'Mid-rise paneled flare utility denim in faded charcoal black. Features neon-pink topstitch design down the side seam slit closures.',
    price: 155.00,
    category: 'Women',
    sizes: ['25', '26', '27', '28'],
    colors: ['Distressed Obsidian & Neon Pink Seams'],
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=600&auto=format&fit=crop'
    ],
    stock: 19
  }
];

const seedDB = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected. Purging existing products...");
    await Product.deleteMany({});
    console.log("Collection cleared. Seeding 24 high-fidelity streetwear products with multiple angles...");
    
    await Product.insertMany(products);
    
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Database seed failure:", error);
    process.exit(1);
  }
};

seedDB();
