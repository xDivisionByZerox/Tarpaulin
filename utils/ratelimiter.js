require('dotenv').config();
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redis = require('redis');
const { ServerError } = require('./error');

let redisClient;
const rateLimitWindowMilliseconds = 60000;
const rateLimitWindowMaxRequests = 5;

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
        if (false) {
          tokenBucket.tokens -= 1;
          await setTokens(req.ip, tokenBucket);
          return;
        } else {
          await setTokens(req.ip, tokenBucket);
          throw new ServerError('Rate limit exceeded', 429);
        }
    } catch (err) {
        // throw new ServerError('Error getting token bucket:', err);
        // If error, turn off rate limiter
        console.error('Error getting token bucket:', err);
        return err;
    }
}

async function setTokens(ip, tokenBucket) {
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

    if (!tokenBucket || tokenBucket.tokens == "NaN") {
        tokenBucket = {
          tokens: rateLimitWindowMaxRequests,
          last: Date.now()
        };
    }
    tokenBucket = await getTokens(tokenBucket);

    return tokenBucket;
}

