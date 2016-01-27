/**
 * Settings for api server in development environment
 */
const settings = {
  PORT: 6000,
  JWT_SECRET: 'cubist-by-studio-slash-development',
  DATABASE_URL: 'mongodb://localhost/cubist-api-development',
  SENDGRID_API_KEY: '',
  ADMIN_NAME: 'admin',
  ADMIN_EMAIL: 'admin@cubist3d.me',
  ADMIN_PASSWORD: 'cubist3d.me'
};

export default settings;
