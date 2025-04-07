module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'defaultSecretKey', // Fallback to default if not in .env
    JWT_EXPIRES_IN: '12h', // Token expiration time
    DB_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/defaultDatabase',
    PORT: process.env.PORT || 3000,
};