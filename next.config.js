// next.config.js
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false,
    };

    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pino-pretty': false,
    };
    allowedDevOrigins = [
      'http://localhost:3000',
      'http:// localhost:3001',
      'http://192.168.0.235:3000',
    ];

    return config;
  },
};

module.exports = nextConfig;
