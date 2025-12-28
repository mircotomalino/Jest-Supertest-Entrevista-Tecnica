# Arquitectura del Proyecto

## Principios de Diseño

Este proyecto sigue principios de **arquitectura limpia** y **separación de responsabilidades** para mantener los tests organizados, mantenibles y escalables.

### Principios Aplicados

1. **DRY (Don't Repeat Yourself)**: Centralizar código común en helpers
2. **Single Responsibility**: Cada módulo tiene una responsabilidad clara
3. **Separation of Concerns**: Configuración, datos, lógica y tests separados
4. **Fixtures Pattern**: Datos de prueba reutilizables y centralizados
5. **Configuration Management**: Configuración centralizada en un solo lugar

## Estructura de Directorios

```
Pulpou/
├── src/
│   ├── config/
│   │   └── test.config.js          # Configuración centralizada
│   ├── fixtures/
│   │   └── products.fixtures.js    # Datos de prueba (fixtures)
│   ├── helpers/
│   │   └── api.helper.js           # Funciones auxiliares
│   └── mocks/
│       └── app.mock.js             # Mock de aplicación Express
├── tests/
│   ├── api/
│   │   └── products.spec.js        # Tests del endpoint
│   └── setup.js                    # Configuración global de Jest
├── .eslintrc.js                    # Configuración de ESLint
├── jest.config.js                  # Configuración de Jest
└── package.json                    # Dependencias y scripts
```

## Descripción de Componentes

### `/src/config/`

**Propósito**: Centralizar toda la configuración del proyecto

**Archivos**:
- `test.config.js`: URLs base, tokens, endpoints, constantes

**Beneficios**:
- Un solo lugar para cambios de configuración
- Fácil de mantener y actualizar
- Reutilizable en múltiples archivos

**Ejemplo de uso**:
```javascript
const { TEST_TOKEN, ENDPOINTS } = require('../config/test.config');
```

### `/src/fixtures/`

**Propósito**: Almacenar datos de prueba reutilizables

**Archivos**:
- `products.fixtures.js`: Objetos de productos de prueba

**Beneficios**:
- Datos consistentes entre tests
- Fácil de mantener (cambios en un solo lugar)
- Reduce duplicación de código

**Ejemplo de uso**:
```javascript
const { validProduct } = require('../../src/fixtures/products.fixtures');
```

### `/src/helpers/`

**Propósito**: Funciones auxiliares que encapsulan lógica común

**Archivos**:
- `api.helper.js`: Helpers para construir requests HTTP

**Beneficios**:
- DRY: evitar código duplicado
- Consistencia: misma lógica en todos los tests
- Mantenibilidad: cambios en un solo lugar

**Ejemplo de uso**:
```javascript
const { withAuth } = require('../../src/helpers/api.helper');
const response = await withAuth(request(app).post(ENDPOINTS.PRODUCTS));
```

### `/src/mocks/`

**Propósito**: Simular el comportamiento de la aplicación real para tests

**Archivos**:
- `app.mock.js`: Mock de aplicación Express con lógica de negocio

**Beneficios**:
- Tests ejecutables sin backend real
- Control total sobre el comportamiento
- Rapidez: no depende de servicios externos

**Características del Mock**:
- Simula validaciones de autenticación
- Implementa reglas de negocio (duplicados, validaciones)
- Almacén en memoria para persistencia simulada
- Funciones de cleanup para tests independientes

### `/tests/`

**Propósito**: Tests organizados por área funcional

**Estructura**:
- `setup.js`: Configuración global de Jest (timeouts, setup)
- `api/`: Tests de endpoints de API
  - `products.spec.js`: Tests del endpoint de productos

**Organización**:
- Un archivo por endpoint o grupo de endpoints relacionados
- Describe blocks para agrupar tests relacionados
- It blocks para casos de prueba específicos

## Flujo de Datos

```
Test File
    ↓
Importa: fixtures, helpers, config, mocks
    ↓
Setup: beforeAll, beforeEach
    ↓
Test Execution: Arrange → Act → Assert
    ↓
Cleanup: beforeEach (reset state)
```

## Patrones de Diseño Utilizados

### 1. Fixtures Pattern
Centralizar datos de prueba para reutilización:
```javascript
// fixtures/products.fixtures.js
const validProduct = { /* ... */ };
module.exports = { validProduct };
```

### 2. Helper Functions
Encapsular lógica común:
```javascript
// helpers/api.helper.js
const withAuth = (request) => { /* ... */ };
```

### 3. Mock Objects
Simular dependencias externas:
```javascript
// mocks/app.mock.js
const createMockApp = () => { /* Express app */ };
```

### 4. Configuration Object
Centralizar configuración:
```javascript
// config/test.config.js
module.exports = { BASE_URL, TEST_TOKEN, ENDPOINTS };
```

## Dependencias entre Módulos

```
tests/*.spec.js
    ├── src/fixtures/*          (datos de prueba)
    ├── src/helpers/*           (funciones auxiliares)
    ├── src/config/*            (configuración)
    └── src/mocks/*             (mocks de aplicación)

src/helpers/*.js
    └── src/config/*            (configuración)

src/mocks/*.js
    └── (dependencias externas: express)
```

## Convenciones de Nomenclatura

### Archivos
- Tests: `*.spec.js`
- Config: `*.config.js`
- Fixtures: `*.fixtures.js`
- Helpers: `*.helper.js`
- Mocks: `*.mock.js`

### Funciones y Variables
- Tests: `it('should describe behavior', ...)`
- Helpers: verbos descriptivos (`withAuth`, `buildEndpoint`)
- Fixtures: nombres descriptivos (`validProduct`, `duplicateProductError`)

## Extensiones Futuras

La arquitectura actual permite fácilmente:

1. **Agregar nuevos endpoints**: Crear nuevos fixtures, helpers y tests
2. **Agregar nuevos tipos de tests**: E2E, integration, unit
3. **Agregar nuevos helpers**: Para diferentes tipos de validaciones
4. **Agregar nuevos fixtures**: Para diferentes escenarios
5. **Cambiar el mock**: Por una aplicación real sin cambiar tests

## Mantenibilidad

### Ventajas de esta Arquitectura

1. **Fácil de entender**: Estructura clara y organizada
2. **Fácil de mantener**: Cambios localizados en módulos específicos
3. **Fácil de extender**: Nuevos tests siguen la misma estructura
4. **Fácil de testear**: Mocks aislados, tests independientes
5. **Fácil de depurar**: Separación clara de responsabilidades

### Mejores Prácticas

- ✅ Mantener configuración centralizada
- ✅ Usar fixtures para datos de prueba
- ✅ Usar helpers para lógica común
- ✅ Limpiar estado entre tests
- ✅ Documentar decisiones arquitectónicas
- ❌ No hardcodear valores en tests
- ❌ No duplicar código
- ❌ No crear dependencias circulares
