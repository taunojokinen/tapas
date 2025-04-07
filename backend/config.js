module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'defaultSecretKey', // Fallback to default if not in .env
    JWT_EXPIRES_IN: '12h', // Token expiration time
    DB_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/defaultDatabase',
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/defaultDatabase', // MongoDB connection string
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'your-openai-api-key', // OpenAI API key
    };