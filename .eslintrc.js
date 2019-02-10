module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended'],

  parser: 'babel-eslint',

  env: {
    browser: true,
  },

  rules: {
    'arrow-parens': ['error', 'as-needed'],
    'camelcase': 'off',
    'no-param-reassign': ['error', { props: false }],
    'indent': 'off',
    'no-extra-boolean-cast': 'off',
    'no-unused-vars': ['error', { varsIgnorePattern: 'dom' }],
    'semi-style': 'off',
    'comma-dangle': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/media-has-caption': 'off',
    'object-curly-newline': 'off',
    'newline-after-var': ['error', 'always'],
    'react/button-has-type': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/sort-comp': [
      'error',
      {
        order: ['lifecycle', 'everything-else', 'rendering', 'static-methods'],
        groups: {
          rendering: ['render', '/^render.+$/'],
        },
      },
    ],
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react/no-access-state-in-setstate': 'off',
    'semi': [2, 'never'],
    'no-unused-expressions': [
      1,
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
  },

  settings: {
    react: {
      pragma: 'dom', // Pragma to use, default to 'React'
    },
  },
}
