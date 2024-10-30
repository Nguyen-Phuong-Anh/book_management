export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: process.env.DATABASE_PORT || 5432,
        username: process.env.DATABASE_USERNAME || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'postgres',
        name: process.env.DATABASE_NAME
    }
})