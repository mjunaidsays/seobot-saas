module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**'
      },
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  compiler: {
    // Remove console logs in production for smaller bundle
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false
  },
  experimental: {
    // Tree-shake unused exports from these packages
    optimizePackageImports: ['framer-motion', 'lucide-react', 'react-icons']
  }
};
