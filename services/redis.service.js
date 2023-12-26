const redis = require("redis");

const ProductsService = require("./products.service");

const redisClient = redis.createClient({
  password: process.env.REDIS_CLOUD_PASSWORD,
  socket: {
    host: process.env.REDIS_CLOUD_HOST,
    port: process.env.REDIS_CLOUD_PORT,
  },
});
class RedisService {
  constructor() {
    this.connect();
  }
  connect() {
    redisClient
      .connect()
      .then(() => {
        console.log("Redis connected");
      })
      .catch((err) => console.log("Redis Connect Error: ", err));
  }
  acquireLock = async ({ productId, productQuantities, productSize, options }) => {
    const key = `lock_product_${productId}`;
    const value = `lock_product_${productId}`;

    const retryTimes = 10;
    const expireTime = 3000;
    for (let i = 0; i < retryTimes; i++) {
      const result = await redisClient.set(key, value, {
        PX: expireTime,
        NX: true,
      });
      if (result) {
        const checkAvailableProduct = await ProductsService.checkAvailableProduct({
          productId,
          productQuantities,
          productSize,
          options,
        });
        if (checkAvailableProduct) {
          const decreaseProductQuantity = await ProductsService.decreseQuantityProduct({
            productId,
            productSize,
            productQuantities,
            options,
          });

          await redisClient.pExpire(key, expireTime);
          return key;
        }

        return null;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
    return null;
  };
  releaseLock = async (key) => {
    return await redisClient.del(key);
  };
  static getInstance = () => {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  };
}

module.exports = RedisService.getInstance();
