import { PrismaClient } from '../app/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding products...');

  // Clear existing products
  await prisma.product.deleteMany();

  const products = [
    // Kitchen & Dining
    {
      name: "Ceramic Dinnerware Set",
      description: "Beautiful 16-piece ceramic dinnerware set perfect for everyday use and special occasions",
      price: 89.99,
      category: "kitchen",
      image: "🍽️",
      rating: 4.8,
      reviews: 245,
      features: ["Microwave Safe", "Dishwasher Safe", "Oven Safe", "16 Pieces"],
      tags: ["dinnerware", "ceramic", "kitchen", "dining"],
      inStock: true
    },
    {
      name: "Stainless Steel Cookware Set",
      description: "Professional-grade 10-piece stainless steel cookware set with non-stick coating",
      price: 199.99,
      category: "kitchen",
      image: "🍳",
      rating: 4.6,
      reviews: 189,
      features: ["Non-Stick Coating", "Stainless Steel", "Oven Safe", "10 Pieces"],
      tags: ["cookware", "kitchen", "cooking", "stainless"],
      inStock: true
    },
    {
      name: "Coffee Maker",
      description: "Programmable 12-cup coffee maker with thermal carafe and auto-shutoff",
      price: 79.99,
      category: "kitchen",
      image: "☕",
      rating: 4.4,
      reviews: 312,
      features: ["12-Cup Capacity", "Programmable", "Thermal Carafe", "Auto-Shutoff"],
      tags: ["coffee", "kitchen", "appliance", "morning"],
      inStock: true
    },

    // Living Room
    {
      name: "Modern Sofa",
      description: "Comfortable 3-seater sofa with plush cushions and sturdy hardwood frame",
      price: 599.99,
      category: "living",
      image: "🛋️",
      rating: 4.7,
      reviews: 156,
      features: ["3-Seater", "Plush Cushions", "Hardwood Frame", "Washable Covers"],
      tags: ["sofa", "furniture", "living room", "comfort"],
      inStock: true
    },
    {
      name: "Coffee Table",
      description: "Elegant wooden coffee table with storage compartment and tempered glass top",
      price: 149.99,
      category: "living",
      image: "🪑",
      rating: 4.5,
      reviews: 98,
      features: ["Storage Compartment", "Tempered Glass", "Wooden Frame", "Modern Design"],
      tags: ["table", "furniture", "living room", "storage"],
      inStock: true
    },
    {
      name: "Floor Lamp",
      description: "Adjustable floor lamp with LED lighting and multiple brightness settings",
      price: 89.99,
      category: "living",
      image: "💡",
      rating: 4.3,
      reviews: 76,
      features: ["LED Lighting", "Adjustable Height", "Multiple Settings", "Energy Efficient"],
      tags: ["lighting", "lamp", "living room", "decor"],
      inStock: true
    },

    // Bedroom
    {
      name: "Queen Size Bed Frame",
      description: "Solid wood queen size bed frame with headboard and under-bed storage",
      price: 349.99,
      category: "bedroom",
      image: "🛏️",
      rating: 4.6,
      reviews: 134,
      features: ["Queen Size", "Solid Wood", "Storage Drawers", "Easy Assembly"],
      tags: ["bed", "furniture", "bedroom", "storage"],
      inStock: true
    },
    {
      name: "Memory Foam Mattress",
      description: "10-inch memory foam mattress with cooling technology and 10-year warranty",
      price: 449.99,
      category: "bedroom",
      image: "🛌",
      rating: 4.8,
      reviews: 203,
      features: ["Memory Foam", "Cooling Technology", "10-Year Warranty", "CertiPUR-US Certified"],
      tags: ["mattress", "bedroom", "sleep", "comfort"],
      inStock: true
    },
    {
      name: "Dresser with Mirror",
      description: "6-drawer dresser with attached mirror, perfect for bedroom organization",
      price: 249.99,
      category: "bedroom",
      image: "🪞",
      rating: 4.4,
      reviews: 87,
      features: ["6 Drawers", "Attached Mirror", "Solid Construction", "Spacious Storage"],
      tags: ["dresser", "furniture", "bedroom", "storage"],
      inStock: true
    },

    // Bathroom
    {
      name: "Rainfall Shower Head",
      description: "Luxury rainfall shower head with adjustable spray patterns and easy installation",
      price: 59.99,
      category: "bathroom",
      image: "🚿",
      rating: 4.5,
      reviews: 145,
      features: ["Rainfall Design", "Adjustable Spray", "Easy Installation", "Chrome Finish"],
      tags: ["shower", "bathroom", "plumbing", "luxury"],
      inStock: true
    },
    {
      name: "Towel Warmer",
      description: "Electric towel warmer with programmable timer and safety features",
      price: 129.99,
      category: "bathroom",
      image: "🧽",
      rating: 4.2,
      reviews: 67,
      features: ["Programmable Timer", "Safety Features", "Quick Heating", "Energy Efficient"],
      tags: ["towel", "bathroom", "heating", "luxury"],
      inStock: true
    },

    // Home Decor
    {
      name: "Wall Art Set",
      description: "Set of 3 modern wall art prints with minimalist design and wooden frames",
      price: 79.99,
      category: "decor",
      image: "🖼️",
      rating: 4.6,
      reviews: 112,
      features: ["Set of 3", "Wooden Frames", "Ready to Hang", "Modern Design"],
      tags: ["art", "decor", "wall", "minimalist"],
      inStock: true
    },
    {
      name: "Throw Pillow Set",
      description: "Set of 4 decorative throw pillows with premium fabric and hidden zippers",
      price: 49.99,
      category: "decor",
      image: "🛋️",
      rating: 4.4,
      reviews: 89,
      features: ["Set of 4", "Premium Fabric", "Hidden Zippers", "Machine Washable"],
      tags: ["pillows", "decor", "cushions", "comfort"],
      inStock: true
    },

    // Garden & Outdoor
    {
      name: "Outdoor Patio Set",
      description: "4-piece outdoor patio furniture set with weather-resistant materials",
      price: 399.99,
      category: "outdoor",
      image: "🏡",
      rating: 4.7,
      reviews: 178,
      features: ["4-Piece Set", "Weather Resistant", "Easy Assembly", "UV Protection"],
      tags: ["patio", "outdoor", "furniture", "garden"],
      inStock: true
    },
    {
      name: "Garden Hose Reel",
      description: "Wall-mounted garden hose reel with 100ft capacity and rust-resistant design",
      price: 69.99,
      category: "outdoor",
      image: "🌱",
      rating: 4.3,
      reviews: 94,
      features: ["100ft Capacity", "Wall Mounted", "Rust Resistant", "Easy Installation"],
      tags: ["garden", "hose", "outdoor", "watering"],
      inStock: true
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log('Seeded products successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
