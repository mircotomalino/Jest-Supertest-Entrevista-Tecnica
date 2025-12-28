/**
 * Helper para construir requests HTTP de manera consistente
 * Centraliza la lógica de autenticación y headers comunes
 */

const { TEST_TOKEN, ENDPOINTS } = require('../config/test.config');

/**
 * Construye un request con autenticación y headers estándar
 * @param {Object} request - Objeto request de Supertest
 * @returns {Object} Request configurado con headers
 */
const withAuth = (request) => request
  .set('Authorization', `Bearer ${TEST_TOKEN}`)
  .set('Content-Type', 'application/json')
  .set('Accept', 'application/json');

/**
 * Helper para construir el endpoint completo
 * @param {string} endpoint - Endpoint relativo (ej: '/api/v1/products')
 * @returns {string} Endpoint completo
 */
const buildEndpoint = (endpoint) => endpoint;

module.exports = {
  withAuth,
  buildEndpoint,
  ENDPOINTS
};
