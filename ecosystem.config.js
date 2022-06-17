module.exports = {
  apps: [
    {
      name: `genesis-backend`,
      script: './dist/index.js',
      instances: '4',
      exec_mode: 'cluster',
      node_args: '--optimize_for_size --max_old_space_size=460 --gc_interval=100',
      env: {
        NODE_ENV: 'localhost',
      },
      env_development: {
        NODE_ENV: process.env.NODE_ENV,
      },
      env_staging: {
        NODE_ENV: process.env.NODE_ENV,
      },
      env_production: {
        NODE_ENV: process.env.NODE_ENV,
      },
    },
  ],
}
