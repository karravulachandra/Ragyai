const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database records...');
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

  console.log('Creating categories...');
  const sarees = await prisma.category.create({ data: { name: 'Sarees', slug: 'sarees' } });
  const kurtas = await prisma.category.create({ data: { name: 'Kurtas & Dhotis', slug: 'kurtas' } });
  const lehengas = await prisma.category.create({ data: { name: 'Lehengas & Poshaaks', slug: 'lehengas' } });
  const sherwanis = await prisma.category.create({ data: { name: 'Sherwanis & Bandhgalas', slug: 'sherwanis' } });
  const kidsCategory = await prisma.category.create({ data: { name: 'Girls & Kids Ethnic', slug: 'kids-wear' } });
  const eldersCategory = await prisma.category.create({ data: { name: 'Grandparents & Elders Handloom', slug: 'elders-wear' } });
  const accessories = await prisma.category.create({ data: { name: 'Shawls & Stoles', slug: 'accessories' } });

  console.log('Seeding 52 verified state-wise traditional attires with local image assets...');

  const productsData = [
    // --- ANDHRA PRADESH ---
    {
      name: 'Pochampally Ikkat Silk Saree (Andhra Pradesh)',
      slug: 'pochampally-ikkat-silk-saree-andhra',
      description: 'Handwoven with intricate geometric tie-and-dye patterns from Bhoodan Pochampally. Known for light weight, natural colors, and iconic temple border design.',
      basePrice: 5800,
      state: 'Andhra Pradesh',
      targetGroup: 'WOMEN',
      region: 'South',
      isFeatured: true,
      categoryId: sarees.id,
      imageUrl: '/kanjeevaram_saree.png',
      variants: [{ sku: 'AP-IKT-W-OS', color: 'Royal Blue & Crimson', size: 'Free Size', inventory: 15 }]
    },
    {
      name: 'Dharmavaram Pure Silk Dhoti & Kurta (Andhra Pradesh)',
      slug: 'dharmavaram-silk-dhoti-kurta-andhra',
      description: 'Regal Dharmavaram pure mulberry silk dhoti paired with an embroidered silk kurta and traditional kanduva. Made for Telugu wedding ceremonies and festivals.',
      basePrice: 4200,
      state: 'Andhra Pradesh',
      targetGroup: 'MEN',
      region: 'South',
      isFeatured: true,
      categoryId: kurtas.id,
      imageUrl: '/dhoti_kurta.png',
      variants: [{ sku: 'AP-DH-M-M', color: 'Cream & Gold', size: 'M', inventory: 12 }, { sku: 'AP-DH-M-L', color: 'Cream & Gold', size: 'L', inventory: 8 }]
    },
    {
      name: 'Andhra Pattu Langa Voni Half Saree (Andhra Pradesh)',
      slug: 'andhra-pattu-langa-voni-girls',
      description: 'Traditional Telugu half-saree for young girls and teens, woven from pure Gadwal pattu with rich zari borders and contrasting voni.',
      basePrice: 3400,
      state: 'Andhra Pradesh',
      targetGroup: 'GIRLS',
      region: 'South',
      isFeatured: true,
      categoryId: kidsCategory.id,
      imageUrl: '/girls_pattu_pavadai.jpg',
      variants: [{ sku: 'AP-LV-G-8Y', color: 'Emerald Green & Pink', size: '8-10Y', inventory: 14 }, { sku: 'AP-LV-G-12Y', color: 'Emerald Green & Pink', size: '12-14Y', inventory: 10 }]
    },
    {
      name: 'Mangalagiri Khadi Dhoti & Angavastram (Andhra Pradesh)',
      slug: 'mangalagiri-khadi-dhoti-elders-andhra',
      description: 'Super-soft handspun pure Mangalagiri cotton dhoti and kurta set tailored for ultimate comfort of elders and grandparents with delicate Nizam border.',
      basePrice: 2100,
      state: 'Andhra Pradesh',
      targetGroup: 'GRANDPARENTS',
      region: 'South',
      isFeatured: true,
      categoryId: eldersCategory.id,
      imageUrl: '/grandparents_handloom_wear.jpg',
      variants: [{ sku: 'AP-MG-GP-L', color: 'Natural Off-White', size: 'L', inventory: 20 }, { sku: 'AP-MG-GP-XL', color: 'Natural Off-White', size: 'XL', inventory: 18 }]
    },

    // --- TELANGANA ---
    {
      name: 'Gadwal Zari Silk Saree (Telangana)',
      slug: 'gadwal-zari-silk-saree-telangana',
      description: 'Renowned for its cotton body and pure silk border joined using the traditional Kuta embroidery technique. Elegant, light, and deeply auspicious.',
      basePrice: 6500,
      state: 'Telangana',
      targetGroup: 'WOMEN',
      region: 'South',
      isFeatured: false,
      categoryId: sarees.id,
      imageUrl: '/kanjeevaram_saree.png',
      variants: [{ sku: 'TG-GDW-W-OS', color: 'Mustard & Peacock Blue', size: 'Free Size', inventory: 10 }]
    },
    {
      name: 'Telangana Gollabhama Silk Kurta & Panche (Telangana)',
      slug: 'telangana-silk-kurta-panche-men',
      description: 'Crafted from pure Siddipet silk handloom, featuring authentic motif borders, coupled with matching panche for festive pujas.',
      basePrice: 3800,
      state: 'Telangana',
      targetGroup: 'MEN',
      region: 'South',
      isFeatured: false,
      categoryId: kurtas.id,
      imageUrl: '/dhoti_kurta.png',
      variants: [{ sku: 'TG-KUR-M-L', color: 'Ivory & Maroon', size: 'L', inventory: 12 }]
    },
    {
      name: 'Pochampally Ikkat Pattu Pavada for Girls (Telangana)',
      slug: 'pochampally-ikkat-pavada-girls',
      description: 'Charming pure silk Ikkat flared skirt (pavada) and stitched blouse with delicate golden lace designed gently for young girls.',
      basePrice: 2800,
      state: 'Telangana',
      targetGroup: 'GIRLS',
      region: 'South',
      isFeatured: false,
      categoryId: kidsCategory.id,
      imageUrl: '/girls_pattu_pavadai.jpg',
      variants: [{ sku: 'TG-IKT-G-6Y', color: 'Festive Yellow & Red', size: '6-7Y', inventory: 15 }]
    },
    {
      name: 'Narayanpet Handloom Cotton Saree for Elders (Telangana)',
      slug: 'narayanpet-handloom-saree-elders',
      description: 'Traditional Narayanpet 80-count breathable pure cotton saree with temple border, lightweight and skin-friendly for elderly grandmothers.',
      basePrice: 2300,
      state: 'Telangana',
      targetGroup: 'GRANDPARENTS',
      region: 'South',
      isFeatured: true,
      categoryId: eldersCategory.id,
      imageUrl: '/grandparents_handloom_wear.jpg',
      variants: [{ sku: 'TG-NRP-GP-OS', color: 'Maroon & Deep Green', size: 'Free Size', inventory: 25 }]
    },

    // --- TAMIL NADU ---
    {
      name: 'Kanjeevaram Bridal Silk Saree (Tamil Nadu)',
      slug: 'kanjeevaram-bridal-silk-saree-tamilnadu',
      description: 'Woven from heavy pure mulberry silk and dipped in pure silver-gold zari from Kanchipuram. Symbol of timeless South Indian royalty.',
      basePrice: 9500,
      state: 'Tamil Nadu',
      targetGroup: 'WOMEN',
      region: 'South',
      isFeatured: true,
      categoryId: sarees.id,
      imageUrl: '/kanjeevaram_saree.png',
      variants: [{ sku: 'TN-KAN-W-OS', color: 'Deep Crimson & Gold', size: 'Free Size', inventory: 8 }]
    },
    {
      name: 'Kanchipuram Silk Veshti & Angavastram (Tamil Nadu)',
      slug: 'kanchipuram-silk-veshti-angavastram-men',
      description: 'Traditional Mayilkan border pure silk Veshti (Dhoti) with matching Angavastram and silk shirt fabric for groom and festive wear.',
      basePrice: 4800,
      state: 'Tamil Nadu',
      targetGroup: 'MEN',
      region: 'South',
      isFeatured: true,
      categoryId: kurtas.id,
      imageUrl: '/dhoti_kurta.png',
      variants: [{ sku: 'TN-VES-M-OS', color: 'Rich Cream & Gold', size: 'Free Size', inventory: 16 }]
    },
    {
      name: 'Kanchi Pattu Pavadai Choli (Tamil Nadu)',
      slug: 'kanchi-pattu-pavadai-girls',
      description: 'Traditional Tamil Pattu Pavadai with pure zari border, accompanied by pleated blouse tailored comfortably for young girls.',
      basePrice: 3200,
      state: 'Tamil Nadu',
      targetGroup: 'GIRLS',
      region: 'South',
      isFeatured: true,
      categoryId: kidsCategory.id,
      imageUrl: '/girls_pattu_pavadai.jpg',
      variants: [{ sku: 'TN-PAV-G-5Y', color: 'Magenta & Gold', size: '4-6Y', inventory: 12 }, { sku: 'TN-PAV-G-9Y', color: 'Magenta & Gold', size: '8-10Y', inventory: 10 }]
    },
    {
      name: 'Madisar 9-Yards Traditional Saree (Tamil Nadu)',
      slug: 'madisar-9-yards-saree-elders',
      description: 'Authentic 9-yard (Madisar) cotton-silk handloom saree, worn traditionally by elderly women with pure comfort and classic temple border.',
      basePrice: 3900,
      state: 'Tamil Nadu',
      targetGroup: 'GRANDPARENTS',
      region: 'South',
      isFeatured: false,
      categoryId: eldersCategory.id,
      imageUrl: '/grandparents_handloom_wear.jpg',
      variants: [{ sku: 'TN-MAD-GP-9Y', color: 'Arakku Maroon & Mustard', size: '9 Yards', inventory: 15 }]
    },

    // --- KERALA ---
    {
      name: 'Kerala Kasavu Set Mundu Saree (Kerala)',
      slug: 'kerala-kasavu-set-mundu-kerala',
      description: 'Classic two-piece Kasavu handloom set with 100% fine cotton and woven 3-inch pure golden zari border, cherished during Onam and Vishu.',
      basePrice: 3200,
      state: 'Kerala',
      targetGroup: 'WOMEN',
      region: 'South',
      isFeatured: true,
      categoryId: sarees.id,
      imageUrl: '/kasavu_saree.png',
      variants: [{ sku: 'KL-KAS-W-OS', color: 'Off-White & Gold', size: 'Free Size', inventory: 20 }]
    },
    {
      name: 'Kerala Kasavu Mundu & Jubba Set (Kerala)',
      slug: 'kerala-kasavu-mundu-jubba-men',
      description: 'Handcrafted Balaramapuram cotton double-dhoti mundu with matching golden kasavu border paired with tailored cotton Jubba kurta.',
      basePrice: 2800,
      state: 'Kerala',
      targetGroup: 'MEN',
      region: 'South',
      isFeatured: false,
      categoryId: kurtas.id,
      imageUrl: '/dhoti_kurta.png',
      variants: [{ sku: 'KL-MUN-M-L', color: 'Ivory White & Gold', size: 'L', inventory: 14 }]
    },
    {
      name: 'Kerala Kasavu Pavada Blouse (Kerala)',
      slug: 'kerala-kasavu-pavada-girls',
      description: 'Traditional Onam festive Kasavu skirt and matching blouse crafted from soft Kerala handloom with shimmering gold border.',
      basePrice: 1950,
      state: 'Kerala',
      targetGroup: 'GIRLS',
      region: 'South',
      isFeatured: false,
      categoryId: kidsCategory.id,
      imageUrl: '/girls_pattu_pavadai.jpg',
      variants: [{ sku: 'KL-PAV-G-5Y', color: 'Pristine Cream & Gold', size: '4-6Y', inventory: 18 }]
    },
    {
      name: 'Traditional Onam Kasavu Mundu & Khadi Shirt for Elders (Kerala)',
      slug: 'kerala-elders-kasavu-khadi-set',
      description: 'Lightweight ultra-soft Kerala handloom cotton mundu and loose-fitting comfort Khadi shirt designed specifically for elderly gentlemen.',
      basePrice: 2100,
      state: 'Kerala',
      targetGroup: 'GRANDPARENTS',
      region: 'South',
      isFeatured: false,
      categoryId: eldersCategory.id,
      imageUrl: '/grandparents_handloom_wear.jpg',
      variants: [{ sku: 'KL-ELD-GP-XL', color: 'Natural White', size: 'XL', inventory: 22 }]
    },

    // --- KARNATAKA ---
    {
      name: 'Mysore Crepe Silk Gold Zari Saree (Karnataka)',
      slug: 'mysore-crepe-silk-saree-karnataka',
      description: 'Official GI-tagged Mysore silk saree made from 100% pure natural silk and 0.65% pure gold zari border. Silky smooth drape and luminous sheen.',
      basePrice: 7200,
      state: 'Karnataka',
      targetGroup: 'WOMEN',
      region: 'South',
      isFeatured: true,
      categoryId: sarees.id,
      imageUrl: '/kanjeevaram_saree.png',
      variants: [{ sku: 'KA-MYS-W-OS', color: 'Royal Purple & Antique Gold', size: 'Free Size', inventory: 10 }]
    },
    {
      name: 'Mysore Panche & Kurta with Shalya (Karnataka)',
      slug: 'mysore-panche-kurta-men',
      description: 'Traditional Kannada ethnic ensemble featuring pure silk Panche (dhoti), matching silk kurta, and opulent gold-bordered Shalya stole.',
      basePrice: 4500,
      state: 'Karnataka',
      targetGroup: 'MEN',
      region: 'South',
      isFeatured: false,
      categoryId: kurtas.id,
      imageUrl: '/dhoti_kurta.png',
      variants: [{ sku: 'KA-PAN-M-L', color: 'Golden Sand', size: 'L', inventory: 12 }]
    },
    {
      name: 'Ilkal Langa Davani for Girls (Karnataka)',
      slug: 'ilkal-langa-davani-girls',
      description: 'Authentic Bagalkot Ilkal weave traditional half-saree with Tope Teni pallu patterns, colorful checks, and soft cotton-silk fabric.',
      basePrice: 2600,
      state: 'Karnataka',
      targetGroup: 'GIRLS',
      region: 'South',
      isFeatured: false,
      categoryId: kidsCategory.id,
      imageUrl: '/girls_pattu_pavadai.jpg',
      variants: [{ sku: 'KA-ILK-G-8Y', color: 'Ruby Red & Black', size: '8-10Y', inventory: 11 }]
    },
    {
      name: 'Ilkal Handloom Cotton Saree for Elders (Karnataka)',
      slug: 'ilkal-handloom-saree-elders',
      description: 'Pure handloom cotton Ilkal saree with authentic red Tope Teni pallu, light and comforting for elderly women across all seasons.',
      basePrice: 2400,
      state: 'Karnataka',
      targetGroup: 'GRANDPARENTS',
      region: 'South',
      isFeatured: false,
      categoryId: eldersCategory.id,
      imageUrl: '/grandparents_handloom_wear.jpg',
      variants: [{ sku: 'KA-ILK-GP-OS', color: 'Indigo Blue & Red', size: 'Free Size', inventory: 16 }]
    },

    // --- MAHARASHTRA ---
    {
      name: 'Nauvari Paithani 9-Yard Silk Saree (Maharashtra)',
      slug: 'nauvari-paithani-silk-saree-maharashtra',
      description: 'Authentic Maharashtrian Kashta Nauvari saree handwoven from Paithan with iconic peacock (mor) pallu motifs and oblique square borders.',
      basePrice: 8800,
      state: 'Maharashtra',
      targetGroup: 'WOMEN',
      region: 'West',
      isFeatured: true,
      categoryId: sarees.id,
      imageUrl: '/nauvari_paithani_saree.jpg',
      variants: [{ sku: 'MH-PAI-W-9Y', color: 'Parrot Green & Orange', size: '9 Yards', inventory: 9 }]
    },
    {
      name: 'Peshwai Dhoti Kurta with Pheta Turban (Maharashtra)',
      slug: 'peshwai-dhoti-kurta-pheta-men',
      description: 'Regal Peshwa Maratha attire: finely stitched pure cotton dhoti, raw silk Kurta, and royal Puneri Pheta (turban) with brooch.',
      basePrice: 4900,
      state: 'Maharashtra',
      targetGroup: 'MEN',
      region: 'West',
      isFeatured: true,
      categoryId: kurtas.id,
      imageUrl: '/dhoti_kurta.png',
      variants: [{ sku: 'MH-PES-M-L', color: 'Saffron & Gold', size: 'L', inventory: 10 }]
    },
    {
      name: 'Traditional Parkar Polka for Girls (Maharashtra)',
      slug: 'parkar-polka-girls-maharashtra',
      description: 'Traditional Maharashtrian ethnic dress for little girls, featuring a flared brocade skirt (parkar) and tailored short blouse (polka).',
      basePrice: 2200,
      state: 'Maharashtra',
      targetGroup: 'GIRLS',
      region: 'West',
      isFeatured: true,
      categoryId: kidsCategory.id,
      imageUrl: '/girls_pattu_pavadai.jpg',
      variants: [{ sku: 'MH-PRK-G-6Y', color: 'Bright Yellow & Red', size: '5-7Y', inventory: 15 }]
    },
    {
      name: 'Puneri Dhoti Kurta with Gandhi Topi (Maharashtra)',
      slug: 'puneri-dhoti-kurta-elders',
      description: 'Classic Puneri handspun Khadi Kurta and Dhoti accompanied by iconic Khadi Gandhi Topi, tailored for grandparents seeking simplicity and heritage.',
      basePrice: 2250,
      state: 'Maharashtra',
      targetGroup: 'GRANDPARENTS',
      region: 'West',
      isFeatured: false,
      categoryId: eldersCategory.id,
      imageUrl: '/grandparents_handloom_wear.jpg',
      variants: [{ sku: 'MH-PUN-GP-L', color: 'Crisp White', size: 'L', inventory: 18 }]
    },

    // --- GUJARAT ---
    {
      name: 'Patan Patola Double Ikkat Silk Saree (Gujarat)',
      slug: 'patan-patola-double-ikkat-saree-gujarat',
      description: 'The crowning jewel of Gujarat’s textile arts. Handwoven in Patan with dyed warp and weft threads creating exact identical patterns on both sides.',
      basePrice: 9900,
      state: 'Gujarat',
      targetGroup: 'WOMEN',
      region: 'West',
      isFeatured: true,
      categoryId: sarees.id,
      imageUrl: '/bandhani_lehenga.png',
      variants: [{ sku: 'GJ-PAT-W-OS', color: 'Ruby Red & Emerald', size: 'Free Size', inventory: 7 }]
    },
    {
      name: 'Gujarati Kediyu & Chorno Set (Gujarat)',
      slug: 'gujarati-kediyu-chorno-men',
      description: 'Authentic Gujarati folk attire with flared pleated Kediyu top decorated with mirror-work, paired with gathered Chorno pants for Navratri and weddings.',
      basePrice: 3600,
      state: 'Gujarat',
      targetGroup: 'MEN',
      region: 'West',
      isFeatured: true,
      categoryId: kurtas.id,
      imageUrl: '/jodhpuri_suit.png',
      variants: [{ sku: 'GJ-KED-M-M', color: 'Black & Multicolored Thread', size: 'M', inventory: 14 }]
    },
    {
      name: 'Kutchi Mirror-Work Chaniya Choli for Girls (Gujarat)',
      slug: 'kutchi-mirrorwork-chaniya-choli-girls',
      description: 'Vibrant Navratri Gujarati Chaniya Choli set for young girls with authentic Kutch hand embroidery, real mirrors, and tasseled dupatta.',
      basePrice: 2400,
      state: 'Gujarat',
      targetGroup: 'GIRLS',
      region: 'West',
      isFeatured: true,
      categoryId: kidsCategory.id,
      imageUrl: '/bandhani_lehenga.png',
      variants: [{ sku: 'GJ-CHN-G-7Y', color: 'Royal Blue & Orange', size: '6-8Y', inventory: 20 }]
    },
    {
      name: 'Traditional Kutch Handloom Dhabla & Kurta for Elders (Gujarat)',
      slug: 'kutch-handloom-dhabla-elders',
      description: 'Warm, soft handloom sheep-wool Dhabla shawl coupled with embroidered breathable cotton kurta, beloved by Kutchi elders.',
      basePrice: 2900,
      state: 'Gujarat',
      targetGroup: 'GRANDPARENTS',
      region: 'West',
      isFeatured: false,
      categoryId: eldersCategory.id,
      imageUrl: '/grandparents_handloom_wear.jpg',
      variants: [{ sku: 'GJ-DHB-GP-L', color: 'Earthy Ecru & Maroon', size: 'L', inventory: 12 }]
    },

    // --- RAJASTHAN ---
    {
      name: 'Marwari Gota Patti Pure Poshaak (Rajasthan)',
      slug: 'marwari-gota-patti-poshaak-rajasthan',
      description: 'Magnificent 4-piece Rajasthani Rajputi Poshaak (Kanchali, Kurti, Ghagra, Odhani) crafted with authentic Jaipur Gota Patti hand embroidery.',
      basePrice: 7800,
      state: 'Rajasthan',
      targetGroup: 'WOMEN',
      region: 'North',
      isFeatured: true,
      categoryId: lehengas.id,
      imageUrl: '/bandhani_lehenga.png',
      variants: [{ sku: 'RJ-POS-W-M', color: 'Flamingo Pink & Orange', size: 'M', inventory: 8 }]
    },
    {
      name: 'Royal Rajputana Angrakha Dhoti with Safa (Rajasthan)',
      slug: 'rajputana-angrakha-dhoti-safa-men',
      description: 'Cross-over Angrakha kurta tied with side cords, matched with traditional Rajasthani dhoti and a handcrafted multicolour Lehariya Safa (turban).',
      basePrice: 5200,
      state: 'Rajasthan',
      targetGroup: 'MEN',
      region: 'North',
      isFeatured: true,
      categoryId: sherwanis.id,
      imageUrl: '/sherwani_suit.png',
      variants: [{ sku: 'RJ-ANG-M-L', color: 'Ivory & Saffron', size: 'L', inventory: 11 }]
    },
    {
      name: 'Rajasthani Bandhani Ghagra Choli for Girls (Rajasthan)',
      slug: 'rajasthani-bandhani-ghagra-choli-girls',
      description: 'Playful tie-dye Jaipuri Bandhani printed Ghagra Choli with lace embellishments and lightweight pom-pom dupatta for little girls.',
      basePrice: 2100,
      state: 'Rajasthan',
      targetGroup: 'GIRLS',
      region: 'North',
      isFeatured: false,
      categoryId: kidsCategory.id,
      imageUrl: '/bandhani_lehenga.png',
      variants: [{ sku: 'RJ-GHG-G-6Y', color: 'Bright Red & Yellow', size: '5-7Y', inventory: 16 }]
    },
    {
      name: 'Pure Bandhej Kurta & Dhoti with Bandhani Stole (Rajasthan)',
      slug: 'bandhej-kurta-dhoti-elders-rajasthan',
      description: 'Breathable pure cotton hand-dyed Bandhej kurta with comfortable pleated dhoti and light cotton stole designed for grandfathers.',
      basePrice: 2500,
      state: 'Rajasthan',
      targetGroup: 'GRANDPARENTS',
      region: 'North',
      isFeatured: false,
      categoryId: eldersCategory.id,
      imageUrl: '/grandparents_handloom_wear.jpg',
      variants: [{ sku: 'RJ-BND-GP-XL', color: 'Sunset Saffron', size: 'XL', inventory: 14 }]
    },

    // --- PUNJAB ---
    {
      name: 'Patiala Salwar Suit with Heavy Phulkari Dupatta (Punjab)',
      slug: 'patiala-salwar-suit-phulkari-punjab',
      description: 'Generously pleated true Patiala Shahi salwar with a short embroidered kameez and an artisanal hand-embroidered silk thread Phulkari dupatta.',
      basePrice: 4600,
      state: 'Punjab',
      targetGroup: 'WOMEN',
      region: 'North',
      isFeatured: true,
      categoryId: kurtas.id,
      imageUrl: '/phulkari_kurta.png',
      variants: [{ sku: 'PB-PAT-W-M', color: 'Mustard Yellow & Fuchsia', size: 'M', inventory: 15 }]
    },
    {
      name: 'Punjabi Kurta Pajama with Phulkari Nehru Jacket (Punjab)',
      slug: 'punjabi-kurta-pajama-phulkari-jacket-men',
      description: 'Classic Pathani style Punjabi cotton Kurta Pajama paired with a statement Phulkari embroidered waistcoat and matching pocket square.',
      basePrice: 4200,
      state: 'Punjab',
      targetGroup: 'MEN',
      region: 'North',
      isFeatured: true,
      categoryId: kurtas.id,
      imageUrl: '/phulkari_kurta.png',
      variants: [{ sku: 'PB-KUR-M-L', color: 'Pure White & Multi Jacket', size: 'L', inventory: 16 }]
    },
    {
      name: 'Vibrant Floral Punjabi Salwar Suit for Girls (Punjab)',
      slug: 'floral-punjabi-salwar-suit-girls',
      description: 'Comfortable cotton-silk Punjabi suit with playful Patiala pleats and soft floral dupatta tailored for girls festive celebrations.',
      basePrice: 2100,
      state: 'Punjab',
      targetGroup: 'GIRLS',
      region: 'North',
      isFeatured: false,
      categoryId: kidsCategory.id,
      imageUrl: '/girls_pattu_pavadai.jpg',
      variants: [{ sku: 'PB-SAL-G-7Y', color: 'Blush Peach & Cyan', size: '6-8Y', inventory: 15 }]
    },
    {
      name: 'Khadi Kurta with Tehmat & Woolen Lohi (Punjab)',
      slug: 'khadi-kurta-tehmat-elders-punjab',
      description: 'Traditional Punjabi elders attire: loose pure handspun Khadi Kurta, Tehmat (chaadra) and an ultra-warm Amritsari woolen Lohi blanket shawl.',
      basePrice: 2700,
      state: 'Punjab',
      targetGroup: 'GRANDPARENTS',
      region: 'North',
      isFeatured: false,
      categoryId: eldersCategory.id,
      imageUrl: '/grandparents_handloom_wear.jpg',
      variants: [{ sku: 'PB-KHD-GP-XL', color: 'Earthy Beige', size: 'XL', inventory: 18 }]
    },

    // --- WEST BENGAL ---
    {
      name: 'Traditional Baluchari Silk Saree (West Bengal)',
      slug: 'baluchari-silk-saree-westbengal',
      description: 'Celebrated Bishnupur handloom silk depicting mythological scenes from the Ramayana on the pallu with fine silk yarn weaving.',
      basePrice: 7900,
      state: 'West Bengal',
      targetGroup: 'WOMEN',
      region: 'East',
      isFeatured: true,
      categoryId: sarees.id,
      imageUrl: '/kanjeevaram_saree.png',
      variants: [{ sku: 'WB-BAL-W-OS', color: 'Deep Maroon & Cream', size: 'Free Size', inventory: 8 }]
    },
    {
      name: 'Bengali Tussar Silk Dhuti-Panjabi Set (West Bengal)',
      slug: 'bengali-tussar-silk-dhuti-panjabi-men',
      description: 'Authentic Bengali Panjabi kurta made from pure Murshidabad Tussar silk, matched with a pleated fine cotton-silk Dhuti with red border.',
      basePrice: 4100,
      state: 'West Bengal',
      targetGroup: 'MEN',
      region: 'East',
      isFeatured: true,
      categoryId: kurtas.id,
      imageUrl: '/dhoti_kurta.png',
      variants: [{ sku: 'WB-PAN-M-L', color: 'Natural Golden Beige', size: 'L', inventory: 12 }]
    },
    {
      name: 'Laal-Shaada Bengali Cotton Dress for Girls (West Bengal)',
      slug: 'laal-shaada-cotton-dress-girls',
      description: 'Iconic Bengali white and red border festive dress for Durga Puja, crafted in breathable cotton with pleated flares.',
      basePrice: 1850,
      state: 'West Bengal',
      targetGroup: 'GIRLS',
      region: 'East',
      isFeatured: false,
      categoryId: kidsCategory.id,
      imageUrl: '/girls_pattu_pavadai.jpg',
      variants: [{ sku: 'WB-DRS-G-5Y', color: 'Pure White & Scarlet Red', size: '5-7Y', inventory: 18 }]
    },
    {
      name: 'Handloom Shantipur Taant Saree for Elders (West Bengal)',
      slug: 'shantipur-taant-saree-elders',
      description: 'Feather-light Shantipur Taant cotton saree with soft par border, favored by Bengali grandmothers for exceptional airy comfort.',
      basePrice: 1950,
      state: 'West Bengal',
      targetGroup: 'GRANDPARENTS',
      region: 'East',
      isFeatured: false,
      categoryId: eldersCategory.id,
      imageUrl: '/grandparents_handloom_wear.jpg',
      variants: [{ sku: 'WB-TNT-GP-OS', color: 'Pearl White & Light Blue', size: 'Free Size', inventory: 22 }]
    },

    // --- JAMMU & KASHMIR ---
    {
      name: 'Kashmiri Tilla Embroidered Velvet Pheran (Kashmir)',
      slug: 'kashmiri-tilla-velvet-pheran-kashmir',
      description: 'Luxurious Kashmiri velvet Pheran adorned with authentic Kashmiri gold and silver Tilla wire embroidery around the neck and cuffs.',
      basePrice: 8500,
      state: 'Jammu & Kashmir',
      targetGroup: 'WOMEN',
      region: 'North',
      isFeatured: true,
      categoryId: kurtas.id,
      imageUrl: '/pashmina_shawl.png',
      variants: [{ sku: 'JK-PHE-W-M', color: 'Midnight Navy & Antique Gold', size: 'M', inventory: 10 }]
    },
    {
      name: 'Royal Kashmiri Tweed Pheran with Stole (Kashmir)',
      slug: 'kashmiri-tweed-pheran-men',
      description: 'Traditional wool-tweed Pheran tailored for men, featuring subtle needlework, side pockets, and a warm Kashmiri woolen stole.',
      basePrice: 5600,
      state: 'Jammu & Kashmir',
      targetGroup: 'MEN',
      region: 'North',
      isFeatured: false,
      categoryId: kurtas.id,
      imageUrl: '/sherwani_suit.png',
      variants: [{ sku: 'JK-TWD-M-XL', color: 'Charcoal Grey', size: 'XL', inventory: 12 }]
    },
    {
      name: 'Kashmiri Floral Aari Work Pheran for Girls (Kashmir)',
      slug: 'kashmiri-aari-pheran-girls',
      description: 'Charming warm woolen Pheran for young girls featuring vibrant Kashmiri Aari chain-stitch floral embroidery.',
      basePrice: 2800,
      state: 'Jammu & Kashmir',
      targetGroup: 'GIRLS',
      region: 'North',
      isFeatured: false,
      categoryId: kidsCategory.id,
      imageUrl: '/kids_kurta.png',
      variants: [{ sku: 'JK-PHR-G-6Y', color: 'Ruby Wine', size: '6-8Y', inventory: 14 }]
    },
    {
      name: 'Authentic GI Pashmina Shawl & Woolen Pheran for Elders (Kashmir)',
      slug: 'kashmiri-pashmina-shawl-elders',
      description: 'Hand-spun and hand-woven 100% Cashmere Pashmina shawl with fine Sozni needlework, offering gentle warmth for grandparents.',
      basePrice: 12000,
      state: 'Jammu & Kashmir',
      targetGroup: 'GRANDPARENTS',
      region: 'North',
      isFeatured: true,
      categoryId: accessories.id,
      imageUrl: '/pashmina_shawl.png',
      variants: [{ sku: 'JK-PSH-GP-OS', color: 'Natural Cashmere Brown', size: 'Free Size', inventory: 6 }]
    },

    // --- ASSAM ---
    {
      name: 'Assam Golden Muga Silk Mekhela Chador (Assam)',
      slug: 'assam-golden-muga-mekhela-chador-assam',
      description: 'Handcrafted from the rarest Golden Muga silk endemic to Assam. Boasts natural lustrous golden tint, Kingkhap floral motifs, and immense durability.',
      basePrice: 9200,
      state: 'Assam',
      targetGroup: 'WOMEN',
      region: 'East',
      isFeatured: true,
      categoryId: sarees.id,
      imageUrl: '/assam_mekhela_chador.jpg',
      variants: [{ sku: 'AS-MUG-W-OS', color: 'Natural Golden Honey', size: 'Free Size', inventory: 8 }]
    },
    {
      name: 'Sualkuchi Silk Dhoti Kurta with Gamosa (Assam)',
      slug: 'sualkuchi-silk-dhoti-kurta-men',
      description: 'Assamese handwoven Mulberry Paat silk Kurta with Dhoti and the revered hand-woven Phulam Gamosa towel with red border motifs.',
      basePrice: 4400,
      state: 'Assam',
      targetGroup: 'MEN',
      region: 'East',
      isFeatured: false,
      categoryId: kurtas.id,
      imageUrl: '/dhoti_kurta.png',
      variants: [{ sku: 'AS-DHO-M-L', color: 'Off-White & Red Accents', size: 'L', inventory: 11 }]
    },
    {
      name: 'Assamese Riha-Mekhela for Young Girls (Assam)',
      slug: 'assamese-riha-mekhela-girls',
      description: 'Traditional two-piece Mekhela Chador tailored in soft cotton-silk for young girls celebrating Bihu festivals.',
      basePrice: 2200,
      state: 'Assam',
      targetGroup: 'GIRLS',
      region: 'East',
      isFeatured: false,
      categoryId: kidsCategory.id,
      imageUrl: '/girls_pattu_pavadai.jpg',
      variants: [{ sku: 'AS-MEK-G-7Y', color: 'Ivory & Crimson', size: '6-8Y', inventory: 16 }]
    },
    {
      name: 'Pure Handloom Eri Silk Shawl & Kurta for Elders (Assam)',
      slug: 'eri-silk-shawl-kurta-elders',
      description: 'Ahimsa (peace) Eri silk attire handwoven by indigenous artisans. Thermal, soft, and revered by elderly grandparents for spiritual events.',
      basePrice: 3400,
      state: 'Assam',
      targetGroup: 'GRANDPARENTS',
      region: 'East',
      isFeatured: false,
      categoryId: eldersCategory.id,
      imageUrl: '/grandparents_handloom_wear.jpg',
      variants: [{ sku: 'AS-ERI-GP-XL', color: 'Warm Cream', size: 'XL', inventory: 15 }]
    },

    // --- ODISHA ---
    {
      name: 'Sambalpuri Bandha Ikat Silk Saree (Odisha)',
      slug: 'sambalpuri-bandha-ikat-saree-odisha',
      description: 'World-famous tie-and-dye weave from western Odisha. Featuring traditional shankha (conch), chakra, and floral motifs woven with precision.',
      basePrice: 6800,
      state: 'Odisha',
      targetGroup: 'WOMEN',
      region: 'East',
      isFeatured: true,
      categoryId: sarees.id,
      imageUrl: '/kanjeevaram_saree.png',
      variants: [{ sku: 'OD-SAM-W-OS', color: 'Crimson & Jet Black', size: 'Free Size', inventory: 10 }]
    },
    {
      name: 'Sambalpuri Ikat Kurta with Cotton Dhoti (Odisha)',
      slug: 'sambalpuri-ikat-kurta-dhoti-men',
      description: 'Handloom Sambalpuri cotton-silk kurta featuring intricate Bandhakala motifs on the yoke, paired with crisp white cotton dhoti.',
      basePrice: 3500,
      state: 'Odisha',
      targetGroup: 'MEN',
      region: 'East',
      isFeatured: false,
      categoryId: kurtas.id,
      imageUrl: '/dhoti_kurta.png',
      variants: [{ sku: 'OD-KUR-M-L', color: 'Maroon & Black', size: 'L', inventory: 14 }]
    },
    {
      name: 'Sambalpuri Ikat Cotton Frock & Skirt for Girls (Odisha)',
      slug: 'sambalpuri-ikat-frock-girls',
      description: 'Pure handloom cotton dress woven in traditional Sambalpuri patterns, gentle on children’s skin with vibrant ethnic borders.',
      basePrice: 1950,
      state: 'Odisha',
      targetGroup: 'GIRLS',
      region: 'East',
      isFeatured: false,
      categoryId: kidsCategory.id,
      imageUrl: '/girls_pattu_pavadai.jpg',
      variants: [{ sku: 'OD-FRK-G-6Y', color: 'Sunshine Yellow & Red', size: '5-7Y', inventory: 15 }]
    },
    {
      name: 'Kotpad Natural Dye Handloom Saree for Elders (Odisha)',
      slug: 'kotpad-natural-dye-saree-elders',
      description: 'GI-tagged organic cotton tribal weave from Koraput dyed with natural Aal (madder) tree roots. Extremely soft and earthy for grandmothers.',
      basePrice: 2800,
      state: 'Odisha',
      targetGroup: 'GRANDPARENTS',
      region: 'East',
      isFeatured: false,
      categoryId: eldersCategory.id,
      imageUrl: '/grandparents_handloom_wear.jpg',
      variants: [{ sku: 'OD-KOT-GP-OS', color: 'Madder Rust & Off-White', size: 'Free Size', inventory: 14 }]
    }
  ];

  for (const item of productsData) {
    const { variants, ...productFields } = item;
    await prisma.product.create({
      data: {
        ...productFields,
        variants: {
          create: variants
        }
      }
    });
  }

  console.log(`Successfully seeded ${productsData.length} traditional attires with local image assets!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
