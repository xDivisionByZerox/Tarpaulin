require('dotenv').config();
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redis = require('redis');
const { ServerError } = require('./error');

let redisClient;

module.exports.connectToRedis = async () => {
    try{
        redisClient = redis.createClient({
            url: `redis://${redisHost}:${redisPort}`
        });
        await redisClient.connect();
    } catch (err) {
        throw new ServerError('Error connecting to Redis:', err);
    }
}

module.exports.getRedisClient = () => {
    if (!redisClient) {
        throw new ServerError('Redis client not initialized');
    }
    return redisClient;
}
