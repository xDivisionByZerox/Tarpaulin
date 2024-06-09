require('dotenv').config();
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redis = require('redis');


let redisClient;

async function connectToRedis() {
  redisClient = redis.createClient({
      url: `redis://${redisHost}:${redisPort}`
  });

  await redisClient.connect();
}

