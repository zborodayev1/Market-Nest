import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,  
      ...tseslint.configs.recommended,  
      'plugin:react/recommended',  
      'plugin:react-hooks/recommended',  
      'prettier',  
    ],
    files: ['**/*.{ts,tsx,js,jsx}'],  
    languageOptions: {
      ecmaVersion: 2020,  
      globals: globals.browser,  
    },
    plugins: {
      'react-hooks': reactHooks,  
      'react-refresh': reactRefresh,  
      prettier,  
    },
    rules: {
      ...reactHooks.configs.recommended.rules,  
      ...prettierConfig.rules,  
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },  
      ],
      'prettier/prettier': [
        'error',  
        {
          singleQuote: true,  
          trailingComma: 'es5',  
          semi: true,  
        },
      ],
    },
  }
);
