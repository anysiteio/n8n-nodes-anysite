module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',  // Add TypeScript parser
  plugins: [
    'eslint-plugin-n8n-nodes-base',
    '@typescript-eslint'               // Add TypeScript plugin
  ],
  extends: [
    'plugin:n8n-nodes-base/nodes',
    'plugin:@typescript-eslint/recommended'  // Add TypeScript rules
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // Можно отключить или настроить конкретные правила, например:
    'n8n-nodes-base/node-param-description-wrong-for-dynamic-options': 'off',
  },
};
