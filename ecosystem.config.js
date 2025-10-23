module.exports = {
  apps: [{
    name: 'iqos-catalyst',
    script: 'server-production.js',
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '500M',
    node_args: '--max-old-space-size=400',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
