# QA Automation Exercise - API Products Testing

## Contexto del Ejercicio

Este repositorio fue creado como parte de un ejercicio técnico de QA Automation para demostrar habilidades en diseño de tests, análisis de riesgo y buenas prácticas en testing automatizado.

El objetivo principal es diseñar tests críticos para un endpoint de API REST que gestiona la creación de productos, enfocándose en la calidad del diseño de los casos de prueba más que en la ejecución contra un backend real.

## Supuestos Funcionales de la API

### Endpoint
- **Método**: POST
- **Ruta**: `/api/v1/products`
- **Base URL**: `http://localhost:3000`

### Autenticación
- La API requiere autenticación mediante Bearer Token
- Header requerido: `Authorization: Bearer {token}`
- Token de prueba: `TEST_TOKEN`

### Estructura del Payload

```json
{
  "seller": {
    "id": "string",
    "name": "string"
  },
  "marketplace": "string",
  "title": "string",
  "description": "string",
  "price": "number",
  "currency": "string",
  "stock": "number",
  "category": "string",
  "sku": "string"
}
```

### Campos Obligatorios
- `seller.id`: Identificador único del vendedor
- `marketplace`: Plataforma donde se vende el producto (ej: "amazon", "ebay")
- `title`: Título del producto

### Reglas de Negocio

1. **Unicidad de Productos**: Un producto se considera duplicado cuando existe la misma combinación de:
   - `seller.id` + `marketplace` + `title`
   
   Esta combinación forma la clave de negocio única para identificar productos duplicados.

2. **Integridad de Datos**: El backend debe preservar exactamente los datos enviados sin mutaciones, transformaciones o pérdida de información.

3. **Respuestas HTTP**:
   - `201 Created`: Producto creado exitosamente
   - `409 Conflict`: Intento de crear un producto duplicado

## Por Qué Estos Casos Son Los Más Críticos

### 1. Creación Válida de Producto (Happy Path - 201 Created)

**Riesgo cubierto**: Regresión funcional del flujo principal

Este test es crítico porque:
- **Impacto en el negocio**: Es el flujo principal de la aplicación. Si falla, el sistema no puede cumplir su función core.
- **Alta frecuencia de uso**: Es el caso de uso más común, por lo que cualquier bug aquí afecta a la mayoría de los usuarios.
- **Validación de integridad**: Verifica que los datos no se corrompan durante el procesamiento, previniendo pérdida de información crítica.
- **Validación implícita de campos obligatorios**: Si faltara un campo requerido, el test fallaría al intentar comparar valores.

**Estrategia de verificación**:
- Validación exhaustiva del payload de respuesta
- Comparación campo por campo entre request y response
- Verificación de que el backend no muta datos (precios, textos, estructuras)

### 2. Producto Duplicado (409 Conflict)

**Riesgo cubierto**: Integridad referencial y lógica de negocio

Este test es crítico porque:
- **Prevención de datos duplicados**: Los productos duplicados pueden causar problemas de inventario, facturación y experiencia de usuario.
- **Validación de reglas de negocio**: Prueba que la lógica de unicidad (seller.id + marketplace + title) funciona correctamente.
- **Mensajes de error útiles**: Verifica que el sistema proporciona feedback claro y accionable al cliente de la API.
- **Impacto en la confianza del sistema**: Un sistema que permite duplicados genera desconfianza y puede llevar a inconsistencias de datos.

**Estrategia de verificación**:
- Flujo de dos pasos: creación exitosa seguida de intento de duplicado
- Validación del código HTTP semántico (409 Conflict)
- Verificación de mensaje de error descriptivo
- Validación de detalles del conflicto (campos que causan el duplicado)

## Cómo Ejecutar los Tests

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

### Instalación

```bash
# Instalar dependencias
npm install
```

### Ejecución

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (recarga automática)
npm run test:watch

# Ejecutar tests con output detallado
npm run test:verbose

# Ejecutar el linter (ESLint)
npm run lint

# Ejecutar el linter y corregir automáticamente problemas simples
npm run lint:fix

# Ejecutar linter solo en archivos de tests y src
npm run lint:test

# Validar código (lint + tests)
npm run validate
```

### Estructura de Ejecución Esperada

```
PASS  tests/api/products.spec.js
  POST /api/v1/products
    Creación válida de producto
      ✓ should create a product successfully with valid payload and preserve data integrity
    Manejo de productos duplicados
      ✓ should return 409 Conflict when attempting to create duplicate product

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

## Aclaración Importante

**El objetivo de este ejercicio no es que los tests ejecuten contra un backend real**, sino demostrar:

- **Diseño de casos de prueba**: Selección de casos críticos basados en análisis de riesgo
- **Enfoque de testing**: Priorización de tests que cubren los riesgos más altos
- **Buenas prácticas**: Tests legibles, mantenibles, con aserciones de negocio
- **Criterio QA**: Capacidad de identificar qué testear y por qué es importante

Los tests están diseñados para ser ejecutables conceptualmente y demostrar el enfoque profesional de un QA Automation Engineer, enfocándose en la calidad del diseño más que en la ejecución funcional contra un sistema real.

## Tecnologías Utilizadas

- **Jest**: Framework de testing para JavaScript
- **Supertest**: Librería para testing de APIs HTTP (usado correctamente con app Express mockeada)
- **Express**: Framework web para crear el mock de aplicación (solo para tests)
- **ESLint**: Linter para mantener calidad y buenas prácticas de código
- **Node.js**: Entorno de ejecución

### Arquitectura y Buenas Prácticas

El proyecto sigue principios de arquitectura limpia para tests:

- **Separación de responsabilidades**: Configuración, fixtures, helpers y mocks en módulos separados
- **DRY (Don't Repeat Yourself)**: Helpers reutilizables para evitar código duplicado
- **Fixtures Pattern**: Datos de prueba centralizados y reutilizables
- **Uso correcto de Supertest**: Mock de aplicación Express para usar Supertest según buenas prácticas
- **Setup/Teardown apropiado**: Limpieza de estado entre tests
- **Configuración centralizada**: URLs, tokens y endpoints en un solo lugar

## Estructura del Proyecto

```
.
├── package.json
├── jest.config.js
├── .eslintrc.js           # Configuración de ESLint
├── .cursorrules           # Reglas de contexto para Cursor AI
├── README.md
├── .gitignore
├── docs/
│   ├── TESTING_GUIDELINES.md  # Guía de buenas prácticas de testing
│   └── ARCHITECTURE.md        # Documentación de arquitectura
├── src/
│   ├── config/
│   │   └── test.config.js          # Configuración centralizada para tests
│   ├── fixtures/
│   │   └── products.fixtures.js    # Datos de prueba (fixtures)
│   ├── helpers/
│   │   └── api.helper.js           # Helpers para construir requests
│   └── mocks/
│       └── app.mock.js             # Mock de aplicación Express para Supertest
└── tests/
    ├── setup.js                    # Configuración global de Jest
    └── api/
        └── products.spec.js        # Tests del endpoint de productos
```

### Descripción de la Arquitectura

- **`src/config/`**: Configuración centralizada (URLs, tokens, endpoints)
- **`src/fixtures/`**: Datos de prueba reutilizables (fixtures pattern)
- **`src/helpers/`**: Funciones auxiliares para tests (DRY principle)
- **`src/mocks/`**: Mock de aplicación Express para usar con Supertest correctamente
- **`tests/setup.js`**: Configuración global de Jest (timeouts, setup global)
- **`tests/api/`**: Tests organizados por área funcional

## Documentación Adicional

- **`.cursorrules`**: Reglas de contexto para Cursor AI que ayudan a mantener consistencia en el código
- **`docs/TESTING_GUIDELINES.md`**: Guía detallada de buenas prácticas de testing
- **`docs/ARCHITECTURE.md`**: Documentación de la arquitectura y decisiones de diseño

## Notas Adicionales

- Los tests incluyen comentarios explicativos para facilitar el mantenimiento y la comprensión del propósito de cada verificación.
- Las aserciones se enfocan en validaciones de negocio, no solo en códigos HTTP.
- Los nombres de los tests son descriptivos y explican claramente qué se está validando.
- El proyecto incluye archivos de contexto para IDEs y herramientas de AI como Cursor.
