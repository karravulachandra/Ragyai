const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const paymentService = require('./services/PaymentService');
const { protect, adminOnly, JWT_SECRET } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// --- AUTHENTICATION ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ error: 'User already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const isFirstUser = (await prisma.user.count()) === 0;
    
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role: isFirstUser ? 'ADMIN' : 'CUSTOMER' }
    });
    
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000 });
    
    res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });
      res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000 });
      res.json({ id: user.id, email: user.email, name: user.name, role: user.role, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', protect, (req, res) => {
  res.json({ id: req.user.id, email: req.user.email, name: req.user.name, role: req.user.role });
});

// --- PRODUCTS & CATEGORIES ---

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get all products (with optional category filter)
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    
    const where = {};
    if (category) {
      where.category = { slug: category };
    }
    
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: true,
      }
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get a single product by slug
app.get('/api/products/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        variants: true,
      }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// --- CHECKOUT & PAYMENTS ---

app.post('/api/checkout', async (req, res) => {
  try {
    const { items, customer, shipping } = req.body;
    
    if (!items || items.length === 0) return res.status(400).json({ error: 'Cart is empty' });
    
    // 1. Validate cart and inventory securely on the server
    let calculatedTotal = 0;
    const orderItemsData = [];
    
    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: { product: true }
      });
      
      if (!variant) return res.status(400).json({ error: `Variant not found` });
      if (variant.inventory < item.quantity) {
        return res.status(400).json({ error: `Insufficient inventory for ${variant.product.name}` });
      }
      
      const price = variant.priceOverride || variant.product.basePrice;
      calculatedTotal += price * item.quantity;
      
      orderItemsData.push({
        variantId: variant.id,
        quantity: item.quantity,
        priceAtPurchase: price
      });
    }
    
    // Add tax & shipping (mirroring frontend logic securely)
    const tax = calculatedTotal * 0.08;
    const shippingCost = calculatedTotal > 0 ? 10.00 : 0;
    const finalAmount = calculatedTotal + tax + shippingCost;
    
    // 2. Create the Address
    const address = await prisma.address.create({
      data: {
        street: shipping.street,
        city: shipping.city,
        state: shipping.state,
        zip: shipping.zip,
        country: shipping.country || 'USA'
      }
    });
    
    // 3. Create the Order
    const order = await prisma.order.create({
      data: {
        total: finalAmount,
        status: 'PENDING_PAYMENT',
        paymentStatus: 'PENDING',
        addressId: address.id,
        items: {
          create: orderItemsData
        }
      }
    });
    
    // 4. Initialize Payment Transaction via Abstraction
    const payment = await paymentService.createPayment(order.id, finalAmount);
    
    await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        provider: paymentService.provider,
        providerTransactionId: payment.transactionId,
        status: payment.status,
        amount: finalAmount
      }
    });
    
    res.json({
      orderId: order.id,
      clientSecret: payment.clientSecret,
      total: finalAmount
    });
    
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

// Demo Webhook to simulate payment completion
app.post('/api/webhooks/payment', async (req, res) => {
  try {
    const { orderId } = req.body;
    
    // Process webhook idempotently
    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.paymentStatus === 'PAID') return res.json({ success: true, message: 'Already paid' });
    
    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'PAID', status: 'CONFIRMED' }
    });
    
    // Decrement Inventory safely
    for (const item of order.items) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: { inventory: { decrement: item.quantity } }
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook failed' });
  }
});

// --- ADMIN ROUTES ---
app.post('/api/admin/products', protect, adminOnly, async (req, res) => {
  try {
    const { name, slug, description, basePrice, categoryId, isFeatured, isNew, imageUrl } = req.body;
    const product = await prisma.product.create({
      data: { name, slug, description, basePrice: parseFloat(basePrice), categoryId, isFeatured, isNew, imageUrl }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// --- ORDERS ---
app.get('/api/orders/me', protect, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { variant: { include: { product: true } } } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// --- WISHLIST ---
app.get('/api/wishlist', protect, async (req, res) => {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: { include: { category: true } } } } }
    });
    res.json(wishlist?.items || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

app.post('/api/wishlist', protect, async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await prisma.wishlist.findUnique({ where: { userId: req.user.id } });
    if (!wishlist) {
      wishlist = await prisma.wishlist.create({ data: { userId: req.user.id } });
    }
    const item = await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId }
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

app.delete('/api/wishlist/:productId', protect, async (req, res) => {
  try {
    const wishlist = await prisma.wishlist.findUnique({ where: { userId: req.user.id } });
    if (!wishlist) return res.status(404).json({ error: 'Wishlist not found' });
    
    await prisma.wishlistItem.delete({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId: req.params.productId } }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
