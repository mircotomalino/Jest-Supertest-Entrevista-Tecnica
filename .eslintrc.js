module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended'
  ],
  plugins: ['jest'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module'
  },
  rules: {
    // Estilo y formato
    'indent': ['error', 2, { SwitchCase: 1 }],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'eol-last': ['error', 'always'],

    // Mejores prácticas
    'no-console': 'warn',
    'no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'no-duplicate-imports': 'error',

    // Variables y funciones
    'no-shadow': ['error', { allow: ['err', 'resolve', 'reject'] }],
    'no-undef': 'error',
    'no-undefined': 'off',

    // Objetos y arrays
    'object-shorthand': 'error',
    'prefer-destructuring': ['error', {
      array: false,
      object: true
    }],

    // Strings
    'prefer-template': 'error',
    'template-curly-spacing': 'error',

    // Comparaciones
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'no-eval': 'error',
    'no-implied-eval': 'error',

    // Funciones
    'func-style': ['error', 'expression', { allowArrowFunctions: true }],
    'no-param-reassign': ['error', { props: false }],

    // Espacios y formato
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],
    'keyword-spacing': 'error',
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'curly': ['error', 'all'],
    'no-else-return': 'error',
    'no-lonely-if': 'error',

    // Jest específico (se activará automáticamente en archivos de test)
    'jest/consistent-test-it': 'error',
    'jest/expect-expect': 'warn',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error'
  },
  overrides: [
    {
      // Archivos de configuración pueden usar CommonJS
      files: ['*.config.js', '*.setup.js'],
      env: {
        node: true
      },
      rules: {
        'no-console': 'off'
      }
    },
    {
      // Archivos de test pueden ser más flexibles
      files: ['**/*.spec.js', '**/*.test.js'],
      rules: {
        'no-console': 'off',
        'max-len': 'off'
      }
    }
  ]
};
