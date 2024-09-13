import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'src/api/'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: 'useAsync|useAsyncRetry',
        },
      ],
      "no-implicit-any": 'off',
      "react-hooks/rules-of-hooks": "error",
      "@typescript-eslint/ban-ts-comment": 'off',
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": 'warn',
      "@typescript-esling/no-explicit-any": 'off',
      "no-restricted-syntax": [
        "error",
        {
          "selector": "CallExpression[callee.object.name='console']",
          "message": "Use of console prohibited. Use a logger instead. (See logger.ts)"
        }
      ],
    },
  },
)
