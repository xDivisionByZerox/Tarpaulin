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
        let tokenBucket = await getTokenBucket(req.ip);
        if (tokenBucket.tokens >= 1) {
          tokenBucket.tokens -= 1;
          await setTokens(tokenBucket);
          next();
        } else {
          await setTokens(tokenBucket);
          res.status(429).json({
            error: "Too many requests per minute"
          });

        }


    } catch (err) {
        // throw new ServerError('Error getting token bucket:', err);
        // If error, turn off rate limiter
        next();
        return;
    }
}

async function setTokens(tokenBucket) {
    await redisClient.hSet(ip, [
        ['tokens', tokenBucket.tokens],
        ['last', tokenBucket.last]
    ]);
}

async function getTokens(tokenBucket) {
    const timestamp = Date.now();
    const elapsedMilliseconds = timestamp - tokenBucket.last;

    const refreshRate =
      rateLimitWindowMaxRequests / rateLimitWindowMilliseconds;

    tokenBucket.tokens += elapsedMilliseconds * refreshRate;
    tokenBucket.tokens =
      Math.min(rateLimitWindowMaxRequests, tokenBucket.tokens);

    tokenBucket.last = timestamp
    return tokenBucket;
}

async function getTokenBucket(ip) {
    let tokenBucket = await redisClient.hGetAll(ip);

    if (!tokenBucket) {
        tokenBucket = {
          tokens: parseFloat(tokenBucket.tokens) ||
            rateLimitWindowMaxRequests,
          last: parseInt(tokenBucket.last) || Date.now()
        };
    }
    tokenBucket = await getTokens(tokenBucket);

    return tokenBucket;
}

