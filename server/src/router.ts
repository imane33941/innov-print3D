import express from 'express';
import adminOrdersActions from './modules/adminOrders/adminOrdersActions';
import authActions from './modules/auth/authActions';
import 'dotenv/config';
import cartActions from './modules/cart/cartActions';
import contactActions from './modules/contact/contactActions';
import orderActions from './modules/order/orderActions';
import productActions from './modules/product/productActions';
import { productImagesUpload } from './modules/uploadMulter/uploadMulter';
import userActions from './modules/user/userActions';
import userOrdersActions from './modules/userOrders/userOrdersActions';

const router = express.Router();

router.get('/api/products', productActions.browse);
router.get('/api/products/search', productActions.browse);
router.get('/api/product/:id', productActions.read);
router.get('/api/products/moments', productActions.readTrendProducts);

router.post('/api/contact', contactActions.validate, contactActions.send);

router.post('/api/cart/:userId', cartActions.validate, cartActions.add);

router.post(
  '/api/register',
  userActions.validate,
  authActions.hashPassword,
  userActions.add,
);

router.post('/api/login', authActions.login);

router.post('/api/orders/webhook', orderActions.handleStripeWebhook);

router.use(authActions.verifyToken);

router.put('/api/:userId/me', userActions.updateProfile);
router.get('/api/:userId/me', userActions.getProfile);

router.get(
  '/api/admin/orders',
  authActions.isAdmin,
  adminOrdersActions.readAll,
);

// Exemple de protection d'une route administrateur
router.put(
  '/api/admin/order/:orderId',
  authActions.verifyToken, // 1. Vérifie si l'utilisateur est connecté
  authActions.isAdmin, // 2. Vérifie si l'utilisateur est un admin
  adminOrdersActions.updateStatus, // 3. Si tout est OK, exécute le controller
);
router.get(
  '/api/admin/orders/unread',
  authActions.isAdmin,
  adminOrdersActions.unreadOrders,
);
router.put(
  '/api/admin/order/read/:orderId',
  authActions.isAdmin,
  adminOrdersActions.isRead,
);

router.post(
  '/api/orders/users/:userId/checkout',
  orderActions.createCheckoutSession,
);

router.post('/api/order/:userId', orderActions.add);

router.get('/api/cart/:userId', cartActions.read);
router.put('/api/cart/:userId', cartActions.validate, cartActions.edit);
router.delete('/api/cart/:userId/:productId', cartActions.destroy);

router.get('/api/orders/:userId', userOrdersActions.read);

router.post(
  '/api/products',
  productImagesUpload,
  productActions.validate,
  productActions.add,
);
router.put('/api/product/:id', productImagesUpload, productActions.edit);
router.delete('/api/product/:id', productActions.destroy);

export default router;
