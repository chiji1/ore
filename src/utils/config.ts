import dotenv from 'dotenv';
dotenv.config();

const config = {
    env: process.env.NODE_ENV,
    port: process.env.SERVER_PORT,
}
export default config;
