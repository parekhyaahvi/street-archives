import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) { console.error("MONGODB_URI not set"); process.exit(1); }

const productSchema = new mongoose.Schema({
  name: String, description: String, price: Number,
  category: String, sizes: [String], colors: [String],
  imageUrl: String, images: [String], stock: Number,
}, { timestamps: true });
const Product = mongoose.model("Product", productSchema);

const u = (id, crop = "") =>
  `https://images.unsplash.com/photo-${id}?w=600&h=800&fit=crop&q=85${crop}`;

const imgs = (a, b) => [u(a), u(a, "&crop=top"), u(b), u(b, "&crop=entropy")];

const products = [
  {
    name: "Shadow Fleece Hoodie",
    description: "Premium 400gsm heavyweight fleece. Kangaroo pocket, ribbed cuffs, oversized drop-shoulder silhouette. Garment-dyed in muted tones.",
    price: 95, category: "Men", sizes: ["XS","S","M","L","XL","XXL"], colors: ["Shadow","Obsidian","Ash"],
    imageUrl: u("1556821840-3a63f95609a7"),
    images: imgs("1556821840-3a63f95609a7","1620799140408-edc6dcb6d633"),
    stock: 40,
  },
  {
    name: "Tactical Windbreaker",
    description: "Lightweight nylon shell with DWR coating. Hidden hood, mesh lining, cargo chest pocket. Built for transit.",
    price: 155, category: "Men", sizes: ["S","M","L","XL"], colors: ["Black","Olive","Navy"],
    imageUrl: u("1591047139829-d91aecb6caea"),
    images: imgs("1591047139829-d91aecb6caea","1568605117036-5fe5e7bab0b7"),
    stock: 28,
  },
  {
    name: "Relaxed Track Pants",
    description: "Brushed french terry with tapered leg. Elastic waistband, deep side pockets, ankle zip. Versatile street-to-gym.",
    price: 80, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: ["Charcoal","Stone"],
    imageUrl: u("1503341504253-dff4815485f1"),
    images: imgs("1503341504253-dff4815485f1","1552902865-b72c031ac5ea"),
    stock: 55,
  },
  {
    name: "Monochrome Bomber",
    description: "Satin-finish MA-1 bomber with contrast ribbing. Embroidered chest patch, utility interior pocket.",
    price: 185, category: "Men", sizes: ["S","M","L","XL"], colors: ["Black","Midnight"],
    imageUrl: u("1551028719-00167b16eac5"),
    images: imgs("1551028719-00167b16eac5","1541417904950-b855a4d5e135"),
    stock: 18,
  },
  {
    name: "Heavyweight Crewneck",
    description: "340gsm cotton-fleece blend. Boxy fit with dropped shoulders. Raw-edge hem detail, minimal tonal branding.",
    price: 85, category: "Men", sizes: ["S","M","L","XL","XXL"], colors: ["Cream","Slate","Black"],
    imageUrl: u("1514994667327-71e81491ea21"),
    images: imgs("1514994667327-71e81491ea21","1503341504253-dff4815485f1"),
    stock: 60,
  },
  {
    name: "Utility Cargo Shorts",
    description: "Ripstop nylon cargo shorts with six pockets. Adjustable waistband, D-ring side cinch, relaxed through thigh.",
    price: 65, category: "Men", sizes: ["S","M","L","XL"], colors: ["Khaki","Black","Olive"],
    imageUrl: u("1526045612212-70caf35c14df"),
    images: imgs("1526045612212-70caf35c14df","1507003211169-0a1dd7228f2d"),
    stock: 45,
  },
  {
    name: "Cropped Windbreaker",
    description: "Cropped silhouette nylon shell. Funnel neck, half-zip opening, packable into chest pocket. Lightweight athletic cut.",
    price: 120, category: "Women", sizes: ["XS","S","M","L","XL"], colors: ["Coral","White","Black"],
    imageUrl: u("1583496661160-fb5218afa9a3"),
    images: imgs("1583496661160-fb5218afa9a3","1469334031218-e382a71b716b"),
    stock: 32,
  },
  {
    name: "Wide Leg Cargo Trousers",
    description: "Loose wide-leg silhouette with two side cargo pockets. High-rise waist, satin drawstring, cropped ankle.",
    price: 90, category: "Women", sizes: ["XS","S","M","L"], colors: ["Ecru","Black","Sage"],
    imageUrl: u("1572804013427-4d505613e3f9"),
    images: imgs("1572804013427-4d505613e3f9","1515886657613-9f3515b0c78f"),
    stock: 27,
  },
  {
    name: "Ribbed Vest Set",
    description: "Stretch-ribbed two-piece: crop vest and matching bike shorts. Tonal seam detail, scoop neck, second-skin fit.",
    price: 75, category: "Women", sizes: ["XS","S","M","L"], colors: ["Nude","Onyx","Slate"],
    imageUrl: u("1515886657613-9f3515b0c78f"),
    images: imgs("1515886657613-9f3515b0c78f","1572804013427-4d505613e3f9"),
    stock: 50,
  },
  {
    name: "Moto Quilted Jacket",
    description: "Channel-quilted faux leather jacket. Asymmetric zip, silver hardware, notch collar. Structured sleek silhouette.",
    price: 170, category: "Women", sizes: ["XS","S","M","L","XL"], colors: ["Black","Burgundy"],
    imageUrl: u("1469334031218-e382a71b716b"),
    images: imgs("1469334031218-e382a71b716b","1583496661160-fb5218afa9a3"),
    stock: 15,
  },
  {
    name: "Drapey Track Trousers",
    description: "Fluid cupro-blend track pants with satin waistband. Side stripe detail, wide leg, tapered hem. Elevated loungewear.",
    price: 80, category: "Women", sizes: ["XS","S","M","L"], colors: ["Ivory","Blush","Smoke"],
    imageUrl: u("1544441893-675973e31985"),
    images: imgs("1544441893-675973e31985","1601933470961-cd25a4b5a4c2"),
    stock: 38,
  },
  {
    name: "Boxy Logo Tee",
    description: "250gsm organic cotton boxy tee. Oversized square cut, chest logo hit, raw-edge collar. Essential layering piece.",
    price: 55, category: "Women", sizes: ["XS","S","M","L","XL"], colors: ["White","Black","Clay"],
    imageUrl: u("1601933470961-cd25a4b5a4c2"),
    images: imgs("1601933470961-cd25a4b5a4c2","1544441893-675973e31985"),
    stock: 70,
  },
  {
    name: "Utility Overshirt",
    description: "Waxed cotton overshirt with chest flap pockets. Button-through, double-needle stitching, relaxed barn fit.",
    price: 110, category: "New Arrivals", sizes: ["S","M","L","XL","XXL"], colors: ["Wax Brown","Slate"],
    imageUrl: u("1441986300917-64674bd600d8"),
    images: imgs("1441986300917-64674bd600d8","1526045612212-70caf35c14df"),
    stock: 22,
  },
  {
    name: "Racing Logo Hoodie",
    description: "Drop No.02 exclusive. Motorsport-inspired woven label, fleece back, structured hood. Limited 200 units.",
    price: 100, category: "New Arrivals", sizes: ["S","M","L","XL"], colors: ["Carbon","Racing Red"],
    imageUrl: u("1556821840-3a63f95609a7"),
    images: imgs("1556821840-3a63f95609a7","1514994667327-71e81491ea21"),
    stock: 12,
  },
  {
    name: "Tech Fleece Joggers",
    description: "Space-dye tech fleece with bonded seams. Slim taper, zip ankle, hidden media pocket in waistband.",
    price: 85, category: "New Arrivals", sizes: ["S","M","L","XL","XXL"], colors: ["Carbon","Navy","Mauve"],
    imageUrl: u("1552902865-b72c031ac5ea"),
    images: imgs("1552902865-b72c031ac5ea","1503341504253-dff4815485f1"),
    stock: 35,
  },
  {
    name: "Statement Varsity",
    description: "Wool-blend varsity with genuine leather sleeves. Custom chenille patches, quilted lining, rib-knit trim.",
    price: 195, category: "New Arrivals", sizes: ["S","M","L","XL"], colors: ["Black/Cream","Navy/Red"],
    imageUrl: u("1591047139829-d91aecb6caea"),
    images: imgs("1591047139829-d91aecb6caea","1551028719-00167b16eac5"),
    stock: 10,
  },
  {
    name: "Archive Puffer Vest",
    description: "Quilted nylon puffer vest with 600-fill down. Oversized fit, internal bungee hem, signature woven label at chest.",
    price: 140, category: "New Arrivals", sizes: ["S","M","L","XL","XXL"], colors: ["Black","Fog","Forest"],
    imageUrl: u("1568605117036-5fe5e7bab0b7"),
    images: imgs("1568605117036-5fe5e7bab0b7","1541417904950-b855a4d5e135"),
    stock: 20,
  },
  {
    name: "Snapback Cap",
    description: "6-panel structured snapback. Embroidered VIBRANT wordmark, flat brim, moisture-wick sweatband.",
    price: 45, category: "Accessories", sizes: ["ONE SIZE"], colors: ["Black","White","Olive"],
    imageUrl: u("1588850561407-ed78c282e89b"),
    images: imgs("1588850561407-ed78c282e89b","1576871337622-98d48d1cf531"),
    stock: 80,
  },
  {
    name: "Tactical Crossbody",
    description: "Cordura nylon crossbody with molle attachment points. Water-resistant zip, padded back panel, adjustable strap.",
    price: 90, category: "Accessories", sizes: ["ONE SIZE"], colors: ["Black","Olive"],
    imageUrl: u("1548036328-c9fa89d128fa"),
    images: imgs("1548036328-c9fa89d128fa","1588850561407-ed78c282e89b"),
    stock: 35,
  },
  {
    name: "Knit Beanie",
    description: "100% merino wool ribbed beanie. Relaxed slouch fit, no cuff, tonal VIBRANT label at back. Essential cold-weather drop.",
    price: 35, category: "Accessories", sizes: ["ONE SIZE"], colors: ["Black","Cream","Forest","Rust"],
    imageUrl: u("1576871337622-98d48d1cf531"),
    images: imgs("1576871337622-98d48d1cf531","1548036328-c9fa89d128fa"),
    stock: 95,
  },
];

await mongoose.connect(uri);
console.log("Connected to MongoDB");

let inserted = 0;
for (const p of products) {
  const exists = await Product.findOne({ name: p.name });
  if (!exists) {
    await Product.create(p);
    console.log(`  + ${p.name}`);
    inserted++;
  } else {
    console.log(`  ~ ${p.name} (already exists)`);
  }
}

console.log(`\nDone. Inserted ${inserted} new products.`);
await mongoose.disconnect();
