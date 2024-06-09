require('dotenv').config();
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redis = require('redis');



let redisClient;

module.exports.connectToRedis = async function connectToRedis() {
    try{
        redisClient = redis.createClient({
            url: `redis://${redisHost}:${redisPort}`
        });
        await redisClient.connect();
    } catch (err) {
        console.error('Error connecting to Redis:', err);
        process.exit(1);
    }
}

