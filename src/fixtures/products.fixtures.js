/**
 * Fixtures de datos para tests de productos
 * Centraliza los datos de prueba para reutilización y mantenibilidad
 */

/**
 * Producto válido para el happy path
 * Incluye todos los campos necesarios según la especificación de la API
 */
const validProduct = {
  seller: {
    id: 'seller-123',
    name: 'Acme Corp'
  },
  marketplace: 'amazon',
  title: 'Producto de Prueba Premium',
  description: 'Descripción detallada del producto para pruebas automatizadas',
  price: 29.99,
  currency: 'USD',
  stock: 100,
  category: 'electronics',
  sku: 'SKU-TEST-001'
};

/**
 * Respuesta esperada para creación exitosa de producto
 * Simula la respuesta del backend agregando el ID generado
 */
const createProductSuccessResponse = (product) => ({
  id: 'product-id-12345',
  ...product,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z'
});

/**
 * Respuesta esperada para error de producto duplicado
 */
const duplicateProductErrorResponse = (sellerId, marketplace, title) => ({
  error: 'Product already exists',
  message: `A product with seller ID '${sellerId}', marketplace '${marketplace}' and title '${title}' already exists`,
  statusCode: 409,
  details: {
    sellerId,
    marketplace,
    title
  }
});

module.exports = {
  validProduct,
  createProductSuccessResponse,
  duplicateProductErrorResponse
};
