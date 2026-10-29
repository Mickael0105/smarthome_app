// babel.config.js — Configuration Babel pour Expo Router & Jest
module.exports = function (api) {
  // Cache la config en production pour les performances
  api.cache(true);

  const isTest = process.env.NODE_ENV === 'test';

  if (isTest) {
    // Configuration spéciale pour Jest (pas de preset-expo en mode test)
    return {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-typescript'],
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    };
  }

  // Configuration principale pour Metro / Expo Go / builds natifs
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Alias @/* → src/* (doit être avant autres plugins)
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
          },
        },
      ],
    ],
  };
};
