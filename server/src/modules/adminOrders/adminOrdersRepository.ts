import databaseClient from '../../../database/client';
import type { Result, Rows } from '../../../database/client';

class adminOrdersRepository {
  // Extrait de la logique de récupération des commandes
  async findAll(limit: number, offset: number) {
    // 1. Récupérer les commandes avec les infos utilisateur
    const [adminOrders] = await databaseClient.query<Rows>(
      `SELECT o.id AS orderId, o.created_at As createdAt, o.status,
       u.firstname, u.lastname, u.email, u.phone, u.street, u.city, u.zip_code, u.country
       FROM orders o
       JOIN user u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    for (const order of adminOrders) {
      // 2. Pour chaque commande, récupérer les produits associés
      const [productsOrders] = await databaseClient.query<Rows>(
        `SELECT p.id AS productId, p.name AS productName,
         op.quantity, op.unit_price AS unitPrice
         FROM order_product op
         JOIN product p ON op.product_id = p.id
         WHERE op.order_id = ?`,
        [order.orderId],
      );

      for (const product of productsOrders) {
        // 3. Pour chaque produit, récupérer les images associés
        const [imgRows] = await databaseClient.query<Rows>(
          'select path from image WHERE product_id = ? LIMIT 1',
          [product.productId],
        );
        product.image = imgRows.map((img) => img.path);
      }
      order.products = productsOrders;
    }

    return adminOrders;
  }

  async count() {
    const [rows] = await databaseClient.query<Rows>(
      'SELECT COUNT(*) AS count FROM orders',
    );
    return rows[0].count;
  }

  async updateStatus(orderId: number, status: string) {
    const [result] = await databaseClient.query<Result>(
      'UPDATE  orders SET status = ? WHERE id = ?',
      [status, orderId],
    );
    return result;
  }

  async findunreadOrders() {
    const [ordersRows] = await databaseClient.query<Rows>(
      'SELECT id fROM orders WHERE is_read = false',
    );
    const [ordersRowsCount] = await databaseClient.query<Rows>(
      'SELECT COUNT(*) AS count FROM orders WHERE is_read = false ',
    );

    return {
      unreadOrdersIds: ordersRows.map((orderIds) => orderIds.id),
      unreadOrdersCount: ordersRowsCount[0].count,
    };
  }

  async findReadOrders(orderId: number) {
    const [result] = await databaseClient.query<Result>(
      'UPDATE orders SET is_read = true where id = ?',
      [orderId],
    );
    return result;
  }
}

export default new adminOrdersRepository();
