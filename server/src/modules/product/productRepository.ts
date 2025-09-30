import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";
import type { Product } from "../../types/express/index";

class ProductRepository {
  async findBy(filters: ProductFilters) {
    const conditions = [];
    const values = [];

    const { name, category_id, minPrice, maxPrice, trend_product } = filters;

    if (name) {
      conditions.push("p.name LIKE ?");
      values.push(`%${name}%`);
    }

    if (category_id) {
      conditions.push("c.id = ?");
      values.push(category_id);
    }

    if (minPrice) {
      conditions.push("p.price >= ?");
      values.push(minPrice);
    }

    if (maxPrice) {
      conditions.push("p.price <= ?");
      values.push(maxPrice);
    }

    if (trend_product) {
      conditions.push("p.trend_product IS NOT NULL AND p.trend_product != 'Aucun'");
    }
    

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const query = `
      SELECT p.id, p.name, p.description, p.price, c.name AS category_name, trend_product
      FROM product p
      LEFT JOIN category c ON p.category_id = c.id
      ${whereClause}
    `;

    const [productRows] = await databaseClient.query<Rows>(query, values);

    for (const product of productRows) {
      const [imageRows] = await databaseClient.query<Rows>(
        "SELECT path FROM image WHERE product_id = ?",
        [product.id],
      );
      product.images = imageRows.map((img) => img.path);
    }

    return productRows as Product[];
  }

  async find(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT p.*, c.name as category_name
      FROM product p
      JOIN category c ON p.category_id = c.id
      WHERE p.id = ?`,
      [id],
    );

    if (rows.length === 0) return null;

    const product = rows[0];

    const [imageRows] = await databaseClient.query<Rows>(
      "SELECT id, path FROM image WHERE product_id = ?",
      [product.id],
    );

    product.images = imageRows.map((img) => ({
      id: img.id,
      path: img.path,
    }));

    const [suggestionProducts] = await databaseClient.query<Rows>(
      `SELECT p.*, c.name as category_name
       FROM product p
       JOIN category c ON p.category_id = c.id
       WHERE p.category_id = ?
       AND p.id != ?
       AND p.price BETWEEN (? * 0.6) AND (? * 1.4)`,
      [product.category_id, product.id, product.price, product.price],
    );

    for (const product of suggestionProducts) {
      const [imgRows] = await databaseClient.query<Rows>(
        "select * from image WHERE product_id = ?",
        [product.id],
      );
      product.images = imgRows.map((img) => img.path);
    }

    product.suggestions = suggestionProducts;

    return product;
  }

  async add(product: Omit<ProductManagement, "id">) {
    const [result] = await databaseClient.query<Result>(
      `INSERT INTO product (name, description, price, category_id, trend_product)
        VALUES (?, ?, ?, ?,?)`,
      [
        product.name,
        product.description,
        product.price,
        product.category_id,
        product.trend_product,
      ],
    );
    return result.insertId;
  }

  async update(product: ProductManagement) {
    const [result] = await databaseClient.query<Result>(
      `UPDATE product
        SET name = ?, description = ?, price = ?, category_id = ?, trend_product = ?
        WHERE id = ?`,
      [
        product.name,
        product.description,
        product.price,
        product.category_id,
        product.trend_product,
        product.id,
      ],
    );

    return result.affectedRows;
  }

  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM product where id = ?",
      [id],
    );
    return result.affectedRows;
  }

  async findTrendProducts() {
    const [rows] = await databaseClient.query<Rows>(
      "select * from product where trend_product != 'Aucun'",
    );

    for (const product of rows) {
      const [imgRows] = await databaseClient.query<Rows>(
        "select * from image WHERE product_id = ? LIMIT 1",
        [product.id],
      );
      product.images = imgRows.map((img) => img.path);
    }
    return rows;
  }
}
export default new ProductRepository();
