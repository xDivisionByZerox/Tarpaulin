require('dotenv').config();
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redis = require('redis');
const { ServerError } = require('./error');

let redisClient;

module.exports.connectToRedis = async () => {
    try{
        console.log(`Connecting to Redis at ${redisHost}:${redisPort}`);
        redisClient = redis.createClient({
            url: `redis://${redisHost}`
        });
        await redisClient.connect();
        redisClient.on('connect', () => {
            console.log('Connected to Redis');
        });
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

module.exports.rateLimiter = async (req, res, next) => {
    try {
        const rateLimitWindowMilliseconds = 60000;
        const rateLimitWindowMaxRequests = 5;
        const clientIp = req.ip;

    } catch (err) {
        throw new ServerError('Error in rate limiter:', err);
    }
}
