# Testing Guidelines

## Filosofía de Testing

Este proyecto sigue un enfoque de testing basado en **análisis de riesgo** y **priorización de casos críticos**. El objetivo no es tener 100% de cobertura, sino asegurar que los casos más importantes estén cubiertos.

### Principios Fundamentales

1. **Tests críticos primero**: Priorizar casos con mayor impacto en el negocio
2. **Validación de negocio**: Verificar lógica de negocio, no solo códigos HTTP
3. **Legibilidad**: Tests deben ser fáciles de entender y mantener
4. **Independencia**: Cada test debe poder ejecutarse de forma aislada
5. **Documentación**: Comentarios que expliquen el "por qué", no solo el "qué"

## Estructura de Tests

### Patrón AAA (Arrange, Act, Assert)

```javascript
it('should describe the expected behavior', async () => {
  // Arrange: Preparar el contexto y datos necesarios
  const testData = { ... };
  const expectedResult = { ... };
  
  // Act: Ejecutar la acción que se está probando
  const response = await performAction(testData);
  
  // Assert: Verificar que el resultado es el esperado
  expect(response.status).toBe(201);
  expect(response.body).toMatchObject(expectedResult);
});
```

### Organización con describe/it

```javascript
describe('POST /api/v1/products', () => {
  describe('Creación válida de producto', () => {
    it('should create product successfully', async () => {
      // Test implementation
    });
  });
  
  describe('Manejo de productos duplicados', () => {
    it('should return 409 Conflict', async () => {
      // Test implementation
    });
  });
});
```

## Casos de Prueba Críticos

### 1. Happy Path (201 Created)

**Propósito**: Validar que el flujo principal funciona correctamente

**Validaciones mínimas**:
- ✅ HTTP status code 201
- ✅ Estructura de respuesta correcta
- ✅ Integridad de datos (request vs response)
- ✅ Campos obligatorios presentes
- ✅ Datos no mutados por el backend

**Ejemplo de validaciones**:
```javascript
expect(response.status).toBe(201);
expect(response.body).toHaveProperty('id');
expect(response.body.title).toBe(validProduct.title);
expect(response.body.price).toEqual(validProduct.price);
```

### 2. Validación de Duplicados (409 Conflict)

**Propósito**: Validar reglas de negocio de unicidad

**Validaciones mínimas**:
- ✅ HTTP status code 409
- ✅ Mensaje de error descriptivo
- ✅ Detalles del conflicto en la respuesta
- ✅ Regla de negocio correctamente aplicada

**Ejemplo de validaciones**:
```javascript
expect(response.status).toBe(409);
expect(response.body).toHaveProperty('error');
expect(response.body.details).toMatchObject({
  sellerId: validProduct.seller.id,
  marketplace: validProduct.marketplace,
  title: validProduct.title
});
```

## Uso de Fixtures y Helpers

### Fixtures

Los fixtures centralizan datos de prueba para reutilización y mantenibilidad:

```javascript
// src/fixtures/products.fixtures.js
const validProduct = {
  seller: { id: 'seller-123', name: 'Acme Corp' },
  marketplace: 'amazon',
  title: 'Producto de Prueba Premium',
  // ... más campos
};

module.exports = { validProduct };
```

### Helpers

Los helpers encapsulan lógica común:

```javascript
// src/helpers/api.helper.js
const withAuth = (request) => request
  .set('Authorization', `Bearer ${TEST_TOKEN}`)
  .set('Content-Type', 'application/json');
```

## Validaciones Recomendadas

### Validaciones de HTTP

- Status codes semánticamente correctos
- Headers apropiados (Content-Type, etc.)
- Estructura de respuesta consistente

### Validaciones de Negocio

- Reglas de negocio aplicadas correctamente
- Mensajes de error útiles y descriptivos
- Integridad de datos preservada
- Campos obligatorios validados

### Validaciones de Datos

- Tipos de datos correctos
- Valores dentro de rangos esperados
- Relaciones entre campos respetadas

## Setup y Cleanup

### beforeAll
Usar para inicialización que se ejecuta una vez antes de todos los tests:
```javascript
beforeAll(() => {
  app = createMockApp();
});
```

### beforeEach
Usar para limpieza/reinicialización antes de cada test:
```javascript
beforeEach(() => {
  clearProductStore();
});
```

### afterEach / afterAll
Usar para cleanup final si es necesario (generalmente no requerido con mocks en memoria)

## Nombres de Tests

### Buenos nombres
- `should create a product successfully with valid payload`
- `should return 409 Conflict when attempting to create duplicate product`
- `should preserve data integrity in response`

### Malos nombres
- `test 1`
- `product creation`
- `duplicate test`

## Comentarios en Tests

Los comentarios deben explicar el **propósito** y el **contexto**, no solo describir el código:

```javascript
// ✅ Bueno
// Verificar que el backend no muta datos
// Esto previene pérdida de información durante el procesamiento
expect(response.body.price).toEqual(validProduct.price);

// ❌ Malo (obvio del código)
// Comparar precio del response con precio del request
expect(response.body.price).toEqual(validProduct.price);
```

## Manejo de Errores

Al validar errores, verificar:
1. Código HTTP correcto
2. Mensaje de error descriptivo
3. Estructura de error consistente
4. Detalles útiles para debugging

```javascript
expect(response.status).toBe(409);
expect(response.body.error).toBeTruthy();
expect(response.body.message).toMatch(/already exists/i);
expect(response.body.details).toHaveProperty('sellerId');
```
