/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@whatisjery/react-fluid-distortion'],
  // Configuración para optimización de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Configuración experimental
  experimental: {
    // Optimizaciones de servidor
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Configuración de compilación
  typescript: {
    // No ignorar errores de TypeScript en producción
    ignoreBuildErrors: false,
  },

  eslint: {
    // No ignorar errores de ESLint en producción
    ignoreDuringBuilds: false,
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader'],
    });
    return config;
  },
};

module.exports = nextConfig;
