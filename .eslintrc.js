module.exports = {
  root: true,
  extends: ['universe/native', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'import/order': 'off',
        'no-case-declarations': 'off',
      },
    },
  ],
};
