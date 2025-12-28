/**
 * Mock de aplicación Express para tests
 * Simula el comportamiento del endpoint POST /api/v1/products
 *
 * IMPORTANTE: En un entorno real, evste mock simularía una aplicación Express real.
 * Para este ejercicio técnico, creamos un mock que responde según el comportamiento esperado.
 */

const express = require('express');

// Almacén en memoria para simular persistencia (solo para tests)
let productStore = [];

/**
 * Helper para generar ID único
 */
const generateId = () => `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Helper para verificar si un producto es duplicado
 * Regla de negocio: seller.id + marketplace + title deben ser únicos
 */
const isDuplicate = (newProduct) => productStore.some(product =>
  product.seller.id === newProduct.seller.id &&
    product.marketplace === newProduct.marketplace &&
    product.title === newProduct.title
);

/**
 * Crea una aplicación Express mockeada para tests
 */
const createMockApp = () => {
  const app = express();

  // Middleware para parsing JSON
  app.use(express.json());

  // Endpoint POST /api/v1/products
  app.post('/api/v1/products', (req, res) => {
    const product = req.body;

    // Validar autenticación
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validar campos obligatorios
    if (!product.seller?.id || !product.marketplace || !product.title) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing required fields: seller.id, marketplace, or title'
      });
    }

    // Verificar duplicado
    if (isDuplicate(product)) {
      const errorResponse = {
        error: 'Product already exists',
        message: `A product with seller ID '${product.seller.id}', marketplace '${product.marketplace}' and title '${product.title}' already exists`,
        statusCode: 409,
        details: {
          sellerId: product.seller.id,
          marketplace: product.marketplace,
          title: product.title
        }
      };
      return res.status(409).json(errorResponse);
    }

    // Crear producto exitosamente
    const newProduct = {
      id: generateId(),
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    productStore.push(newProduct);

    return res.status(201).json(newProduct);
  });

  return app;
};

/**
 * Limpia el almacén de productos (útil para tests)
 */
const clearProductStore = () => {
  productStore = [];
};

module.exports = {
  createMockApp,
  clearProductStore
};
