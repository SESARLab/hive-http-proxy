const config = {
  HIVE_HOST: process.env.HIVE_HOST || 'localhost',
  HIVE_PORT: process.env.HIVE_PORT || '10000',
  HIVE_USERNAME: process.env.HIVE_USERNAME || 'admin',
  HIVE_PASSWORD: process.env.HIVE_PASSWORD,
};

module.exports = config;
