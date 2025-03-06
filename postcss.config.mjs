/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-import': {},
    'postcss-url': {
      url: 'rebase', // Rebases URLs relative to the output file
      assetsPath: 'public/images', // Path to your image assets
      basePath: '.', // Base path for resolving URLs
    },
  },
};

export default config;
