# Redis Bloom Wrapper

## Introduction
Omni Bloom is a Redis Bloom wrapper for managing Bloom Filters in Redis.

## Installation
To install Omni Bloom, run the following command:

```
npm i redis-bloom-wrapper
```

## Usage
Here is an example of how to use Omni Bloom:

```typescript

// Initialize Redis connection
const redisCreds = {
    host: "localhost",
    port: 6379,
    username: "your-redis-username",
    password: "your-redis-password",
    database: 0,
};
await RedisBloomWrapper.init(redisCreds);

// Create a Bloom Filter
const bloomFilterKey = "my-bloom-filter";
const capacity = 100000;
const errorRate = 0.01;
await RedisBloomWrapper.createBloomFilter(bloomFilterKey, capacity, errorRate);

// Add an item to the Bloom Filter
const item = { id: "123", name: "John Doe" };
await RedisBloomWrapper.add(bloomFilterKey, item);

// Check if an item exists in the Bloom Filter
const exists = await RedisBloomWrapper.exists(bloomFilterKey, item);
console.log("Item exists in Bloom Filter:", exists.result);

// Delete the Bloom Filter
await RedisBloomWrapper.deleteBloomFilter(bloomFilterKey);
```

## API Reference
### `init(redisCreds: any, redisClientIn?: any): Promise<any>`
Initialize the Redis connection. If `redisClientIn` is provided, it will be used as the Redis client.

### `createBloomFilter(key: string, capacity?: number, errorRate?: number): Promise<any>`
Create a Bloom Filter with the specified key, capacity, and error rate. If capacity and error rate are not provided, default values will be used.

### `deleteBloomFilter(key: string): Promise<any>`
Delete the Bloom Filter with the specified key.

### `add(key: string, itemObj: object): Promise<any>`
Add an item to the Bloom Filter with the specified key.

### `insert(key: string, itemObjs: object[]): Promise<any>`
Add multiple items to the Bloom Filter with the specified key.

### `exists(key: string, itemObj: object): Promise<any>`
Check if an item exists in the Bloom Filter with the specified key.

### `multiExists(key: string, itemObjs: object[]): Promise<any>`
Check if multiple items exist in the Bloom Filter with the specified key.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.