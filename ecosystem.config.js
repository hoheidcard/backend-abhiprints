module.exports = {
  apps: [
    {
      name: 'nest-app',              // 👈 Any name for your app
      script: 'dist/main.js',        // 👈 Entry point (after build)
      instances: 1,                  // You can set to "max" for cluster mode
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        
        NODE_ENV: 'development',
        PORT: 3111
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3111
      }
    }
  ]
};
