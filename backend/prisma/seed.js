const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared database.');

  // Categories
  const sarees = await prisma.category.create({ data: { name: 'Sarees', slug: 'sarees' } });
  const kurtas = await prisma.category.create({ data: { name: 'Kurtas', slug: 'kurtas' } });
  const lehengas = await prisma.category.create({ data: { name: 'Lehengas', slug: 'lehengas' } });
  const sherwanis = await prisma.category.create({ data: { name: 'Sherwanis', slug: 'sherwanis' } });

  console.log('Created Categories.');

  // Regional Indian Clothing Products
  const kanjeevaramSaree = await prisma.product.create({
    data: {
      name: 'Kanjeevaram Silk Saree (Tamil Nadu)',
      slug: 'kanjeevaram-silk-saree',
      description: 'Hailing from Kanchipuram in Tamil Nadu, this authentic Kanjeevaram silk saree is woven from pure mulberry silk thread. Known for its vibrant colors, heavy weight, and temple borders, it is a staple for South Indian brides and grand festivals.',
      basePrice: 350.00,
      isFeatured: true,
      categoryId: sarees.id,
      imageUrl: '/kanjeevaram_saree.png',
      variants: {
        create: [
          { sku: 'SR-KAN-GLD-OS', color: 'Gold & Magenta', size: 'One Size', inventory: 10 }
        ]
      }
    }
  });

  const bandhaniLehenga = await prisma.product.create({
    data: {
      name: 'Bandhani Print Lehenga (Gujarat)',
      slug: 'bandhani-print-lehenga',
      description: 'Originating from Gujarat and Rajasthan, Bandhani is a highly skilled tie-dye textile decorated by plucking the cloth with the fingernails into many tiny bindings. This vibrant Lehenga Choli is perfect for Navratri and Garba nights.',
      basePrice: 180.00,
      isFeatured: true,
      categoryId: lehengas.id,
      imageUrl: '/bandhani_lehenga.png',
      variants: {
        create: [
          { sku: 'LH-BAN-RED-M', color: 'Bright Red', size: 'M', inventory: 15 },
          { sku: 'LH-BAN-RED-L', color: 'Bright Red', size: 'L', inventory: 5 }
        ]
      }
    }
  });

  const phulkariDupattaKurta = await prisma.product.create({
    data: {
      name: 'Phulkari Kurta Set (Punjab)',
      slug: 'phulkari-kurta-set',
      description: 'Phulkari literally translates to "flower work" and is traditional to Punjab. This elegant cotton Kurta comes with a heavily embroidered Phulkari dupatta, featuring vibrant, geometric floral patterns woven with silk threads.',
      basePrice: 90.00,
      isFeatured: false,
      categoryId: kurtas.id,
      imageUrl: '/phulkari_kurta.png',
      variants: {
        create: [
          { sku: 'KR-PHU-YLW-S', color: 'Mustard Yellow', size: 'S', inventory: 20 },
          { sku: 'KR-PHU-YLW-M', color: 'Mustard Yellow', size: 'M', inventory: 10 }
        ]
      }
    }
  });

  const pashminaShawl = await prisma.product.create({
    data: {
      name: 'Authentic Pashmina Shawl (Kashmir)',
      slug: 'authentic-pashmina-shawl',
      description: 'Woven in the valleys of Kashmir, authentic Pashmina is made from the fine undercoat of Himalayan mountain goats. Extremely lightweight yet incredibly warm, featuring intricate Sozni hand-embroidery.',
      basePrice: 400.00,
      isFeatured: true,
      categoryId: kurtas.id, // Using kurtas category as a fallback for accessories
      imageUrl: '/pashmina_shawl.png',
      variants: {
        create: [
          { sku: 'SH-PASH-WHT-OS', color: 'Off-White', size: 'One Size', inventory: 5 }
        ]
      }
    }
  });

  const kasavuSaree = await prisma.product.create({
    data: {
      name: 'Kasavu Cotton Saree (Kerala)',
      slug: 'kasavu-cotton-saree',
      description: 'The traditional Kasavu saree from Kerala is instantly recognizable by its crisp white cotton fabric bordered with pure gold zari. A symbol of elegance and purity, perfect for Onam and Vishu celebrations.',
      basePrice: 120.00,
      isFeatured: false,
      categoryId: sarees.id,
      imageUrl: '/kanjeevaram_saree.png',
      variants: {
        create: [
          { sku: 'SR-KAS-WHT-OS', color: 'White & Gold', size: 'One Size', inventory: 25 }
        ]
      }
    }
  });

  const chanderiKurta = await prisma.product.create({
    data: {
      name: 'Chanderi Silk Kurta (Madhya Pradesh)',
      slug: 'chanderi-silk-kurta',
      description: 'Handwoven in Chanderi, Madhya Pradesh, this lightweight, sheer fabric features delicate gold motifs and a luxurious sheen. Perfect for festive summer wear due to its breathable texture.',
      basePrice: 140.00,
      isFeatured: false,
      categoryId: kurtas.id,
      imageUrl: '/phulkari_kurta.png',
      variants: {
        create: [
          { sku: 'KR-CHA-PNK-M', color: 'Soft Pink', size: 'M', inventory: 8 }
        ]
      }
    }
  });

  // Mens Products
  const royalSherwani = await prisma.product.create({
    data: {
      name: 'Royal Rajputana Sherwani',
      slug: 'royal-rajputana-sherwani',
      description: 'A regal Sherwani Suit inspired by the royal courts of Rajasthan. Features heavy gold thread embroidery on premium velvet, complete with matching churidar and a safa (turban).',
      basePrice: 550.00,
      isFeatured: true,
      categoryId: sherwanis.id,
      imageUrl: '/sherwani_suit.png',
      variants: {
        create: [
          { sku: 'SHR-RAJ-GLD-L', color: 'Gold & Maroon', size: 'L', inventory: 5 }
        ]
      }
    }
  });

  const dhotiKurta = await prisma.product.create({
    data: {
      name: 'Traditional Silk Dhoti Kurta',
      slug: 'traditional-silk-dhoti-kurta',
      description: 'Authentic South Indian pure silk Dhoti Kurta set. The pancha (dhoti) features a crisp gold zari border, paired perfectly with a tailored silk kurta. Ideal for weddings and religious ceremonies.',
      basePrice: 160.00,
      isFeatured: false,
      categoryId: kurtas.id,
      imageUrl: '/dhoti_kurta.png',
      variants: {
        create: [
          { sku: 'DK-SLK-WHT-M', color: 'White & Gold', size: 'M', inventory: 12 }
        ]
      }
    }
  });

  const jodhpuriSuit = await prisma.product.create({
    data: {
      name: 'Classic Bandhgala Jodhpuri Suit',
      slug: 'classic-bandhgala-jodhpuri',
      description: 'The epitome of men\'s formal ethnic wear. This tailored Jodhpuri suit features a structured Bandhgala (closed neck) jacket with intricate button detailing, paired with slim-fit trousers.',
      basePrice: 380.00,
      isFeatured: true,
      categoryId: sherwanis.id,
      imageUrl: '/jodhpuri_suit.png',
      variants: {
        create: [
          { sku: 'JD-BLK-M', color: 'Midnight Black', size: 'M', inventory: 8 }
        ]
      }
    }
  });

  // Kids Wear
  const kidsCategory = await prisma.category.create({
    data: {
      name: 'Kids Wear',
      slug: 'kids-wear'
    }
  });

  const kidsKurtaSet = await prisma.product.create({
    data: {
      name: 'Kids Silk Kurta Pajama Set',
      slug: 'kids-silk-kurta-pajama',
      description: 'Vibrant yellow silk kurta pajama set designed comfortably for kids. Soft inner cotton lining ensures all-day comfort during celebrations.',
      basePrice: 1200.00,
      isFeatured: true,
      categoryId: kidsCategory.id,
      imageUrl: '/kids_kurta.png',
      variants: {
        create: [
          { sku: 'KD-KRT-YLW-S', color: 'Bright Yellow', size: '4-5Y', inventory: 15 }
        ]
      }
    }
  });

  const kidsLehenga = await prisma.product.create({
    data: {
      name: 'Little Princess Festive Lehenga',
      slug: 'little-princess-festive-lehenga',
      description: 'Beautiful ethnic lehenga choli set for young girls with delicate embroidery and soft dupatta.',
      basePrice: 1600.00,
      isFeatured: true,
      categoryId: kidsCategory.id,
      imageUrl: '/bandhani_lehenga.png',
      variants: {
        create: [
          { sku: 'KD-LHG-PNK-M', color: 'Festive Pink', size: '6-7Y', inventory: 12 }
        ]
      }
    }
  });

  // Western Wear Products
  const westernCategory = await prisma.category.create({
    data: {
      name: 'Western Wear',
      slug: 'western-wear'
    }
  });

  await prisma.product.create({
    data: {
      name: 'Vintage Wash Denim Jacket',
      slug: 'vintage-wash-denim-jacket',
      description: 'A premium oversized vintage wash denim jacket. Features distressed details, silver hardware, and a classic collar. The perfect layering piece for urban street style.',
      basePrice: 2500.00,
      isFeatured: true,
      categoryId: westernCategory.id,
      imageUrl: '/denim_jacket.png',
      variants: {
        create: [
          { sku: 'WW-DNM-BLU-M', color: 'Vintage Blue', size: 'M', inventory: 20 }
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      name: 'Summer Breeze Floral Maxi Dress',
      slug: 'summer-breeze-floral-maxi',
      description: 'An elegant flowing floral maxi dress perfect for summer. Features a wrap v-neckline, flutter sleeves, and a tiered skirt. Lightweight and breathable.',
      basePrice: 1800.00,
      isFeatured: true,
      categoryId: westernCategory.id,
      imageUrl: '/floral_dress.png',
      variants: {
        create: [
          { sku: 'WW-FLR-PNK-S', color: 'Blush Pink', size: 'S', inventory: 15 }
        ]
      }
    }
  });

  await prisma.product.create({
    data: {
      name: 'Urban Utility Cargo Pants',
      slug: 'urban-utility-cargo-pants',
      description: 'Trendy olive green cargo pants with multiple utility pockets. High-waisted relaxed fit, crafted from durable cotton twill for the ultimate streetwear aesthetic.',
      basePrice: 2200.00,
      isFeatured: true,
      categoryId: westernCategory.id,
      imageUrl: '/cargo_pants.png',
      variants: {
        create: [
          { sku: 'WW-CRG-OLV-M', color: 'Olive Green', size: 'M', inventory: 18 }
        ]
      }
    }
  });

  console.log('Seeded regional Indian ethnic wear, Mens, Western, Kids, and Senior collections.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
