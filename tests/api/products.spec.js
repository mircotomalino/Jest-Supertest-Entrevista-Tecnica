const request = require('supertest');
const { createMockApp, clearProductStore } = require('../../src/mocks/app.mock');
const { withAuth, ENDPOINTS } = require('../../src/helpers/api.helper');
const { validProduct } = require('../../src/fixtures/products.fixtures');

describe('POST /api/v1/products', () => {
  let app;

  // Setup: Crear app mockeada antes de cada test suite
  beforeAll(() => {
    app = createMockApp();
  });

  // Cleanup: Limpiar almacén de productos antes de cada test
  beforeEach(() => {
    clearProductStore();
  });

  describe('Creación válida de producto', () => {

    it('should create a product successfully with valid payload and preserve data integrity', async () => {
      // Arrange: Preparar el request con payload válido
      const response = await withAuth(
        request(app)
          .post(ENDPOINTS.PRODUCTS)
          .send(validProduct)
      );

      // Assert: Verificar respuesta HTTP exitosa
      expect(response.status).toBe(201);
      expect(response.headers['content-type']).toMatch(/json/);

      // Assert: Verificar integridad del payload - el backend debe preservar todos los campos enviados
      // Esto asegura que no se pierdan datos durante el procesamiento
      expect(response.body).toHaveProperty('id'); // El backend asigna un ID único
      expect(response.body.seller.id).toBe(validProduct.seller.id);
      expect(response.body.seller.name).toBe(validProduct.seller.name);
      expect(response.body.marketplace).toBe(validProduct.marketplace);
      expect(response.body.title).toBe(validProduct.title);
      expect(response.body.description).toBe(validProduct.description);
      expect(response.body.price).toBe(validProduct.price);
      expect(response.body.currency).toBe(validProduct.currency);
      expect(response.body.stock).toBe(validProduct.stock);
      expect(response.body.category).toBe(validProduct.category);
      expect(response.body.sku).toBe(validProduct.sku);

      // Assert: Validación de campos obligatorios implícita
      // Si algún campo obligatorio faltara, el test fallaría al comparar
      // Verificamos explícitamente los campos críticos para el negocio
      expect(response.body.seller.id).toBeTruthy();
      expect(response.body.marketplace).toBeTruthy();
      expect(response.body.title).toBeTruthy();

      // Assert: Confirmar que el backend no muta datos
      // Comparación exhaustiva para detectar cualquier transformación no esperada
      // El precio debe mantenerse exactamente igual (no redondeo, no conversión)
      expect(response.body.price).toEqual(validProduct.price);

      // El título no debe ser modificado (sin trimming adicional, sin normalización)
      expect(response.body.title).toEqual(validProduct.title);

      // La estructura del seller debe preservarse
      expect(response.body.seller).toMatchObject(validProduct.seller);

      // Validar que se agregaron campos del sistema (timestamps)
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });
  });

  describe('Manejo de productos duplicados', () => {

    it('should return 409 Conflict when attempting to create duplicate product', async () => {
      // Arrange: Crear el producto por primera vez (debe ser exitoso)
      const firstResponse = await withAuth(
        request(app)
          .post(ENDPOINTS.PRODUCTS)
          .send(validProduct)
      );

      // Assert: Primer request debe ser exitoso
      expect(firstResponse.status).toBe(201);
      expect(firstResponse.body).toHaveProperty('id');

      // Act: Intentar crear el mismo producto nuevamente
      // La lógica de duplicado se basa en: seller.id + marketplace + title
      // Estos tres campos juntos forman la clave única de negocio
      const duplicateProduct = {
        ...validProduct,
        // Mantener la combinación crítica: seller.id + marketplace + title
        // Pueden cambiar otros campos, pero estos tres deben coincidir para ser duplicado
        description: 'Esta descripción diferente no debería importar para la validación de duplicado',
        price: 39.99 // Precio diferente no afecta la validación de duplicado
      };

      const secondResponse = await withAuth(
        request(app)
          .post(ENDPOINTS.PRODUCTS)
          .send(duplicateProduct)
      );

      // Assert: Segundo request debe devolver 409 Conflict
      expect(secondResponse.status).toBe(409);
      expect(secondResponse.headers['content-type']).toMatch(/json/);

      // Assert: Validar mensaje semántico en el body
      // El mensaje debe ser claro y útil para el consumidor de la API
      expect(secondResponse.body).toHaveProperty('error');
      expect(secondResponse.body.error).toBeTruthy();

      // El mensaje debe indicar específicamente que es un duplicado
      // Esto ayuda a diferenciar este error de otros 409 (ej: conflictos de recurso)
      const errorMessage = secondResponse.body.message || secondResponse.body.error;
      expect(errorMessage.toLowerCase()).toMatch(/(already exists|duplicate|ya existe)/i);

      // Assert: Verificación de negocio - el sistema debe reconocer la combinación única
      // Esta aserción valida que la regla de negocio se aplica correctamente
      expect(secondResponse.body).toHaveProperty('details');

      // Verificar que el mensaje mencione los campos que causan el duplicado
      // Esto proporciona contexto adicional al desarrollador
      expect(secondResponse.body.details).toMatchObject({
        sellerId: validProduct.seller.id,
        marketplace: validProduct.marketplace,
        title: validProduct.title
      });

      // Assert: Validar que el statusCode está presente en el body
      expect(secondResponse.body.statusCode).toBe(409);
    });
  });
});
