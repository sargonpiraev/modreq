import project from '@sargonpiraev/eslint-config/project';

export default [
  {
    ignores: [
      '**/build/**',
      '**/.output/**',
      '**/storybook-static/**',
      '**/.next/**',
      '**/playwright-report/**',
      '**/test-results/**',
      '**/coverage/**',
      'lefthook.yml',
      'package.json',
      'project.json',
    ],
  },
  ...project,
];
