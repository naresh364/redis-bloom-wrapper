import RedisBloomWrapper from "./index";

describe("Redis Bloom Tests", () => {
    let client;

    beforeAll(async () => {
        // Initialize the Redis client
        console.log("Initializing Redis client");
        client = await RedisBloomWrapper.init({
            host: "localhost",
            port: 6379,
        });
        console.log("Redis client initialized");
    });

    beforeEach(async () => {
        // Create a new Bloom Filter
        await RedisBloomWrapper.deleteBloomFilter("mybloom");
    });

    afterAll(() => {
        // Close the Redis client connection
    });

    it("should add an item to the Bloom Filter", async () => {
        const result = await RedisBloomWrapper.add("mybloom", { id: 1, name: "John" });
        expect(result.status).toBe(200);
        expect(result.message).toBe("Added item to Bloom Filter");
    });

    it("should insert multiple items to the Bloom Filter", async () => {
        const items = [
            { id: 2, name: "Jane" },
            { id: 3, name: "Alice" },
        ];
        const result = await RedisBloomWrapper.insert("mybloom", items);
        expect(result.status).toBe(200);
        expect(result.message).toBe("Added items to Bloom Filter");
    });

    it("should check if an item exists in the Bloom Filter", async () => {
        const item = { id: 1, name: "John" };
        await RedisBloomWrapper.add("mybloom", item);
        const result = await RedisBloomWrapper.exists("mybloom", { id: 1, name: "John" });
        expect(result.status).toBe(200);
        expect(result.message).toBe("Checked item in Bloom Filter");
        expect(result.result).toBe(true);
    });

    it("should check if multiple items exist in the Bloom Filter", async () => {
        const items = [
            { id: 0, name: "Jane" },
            { id: 1, name: "Alice" },
        ];
        await RedisBloomWrapper.insert("mybloom", items);
        const result = await RedisBloomWrapper.multiExists("mybloom", items);
        expect(result.status).toBe(200);
        expect(result.result).toEqual([true, true]);
    });

    it("should check if multiple items exist in the Bloom Filter and keys are reordered", async () => {
        //key reorder should also pass
        const items = [
            { id: 0, name: "Jane" },
            { id: 3, name: "Alice" },
        ];
        await RedisBloomWrapper.insert("mybloom", items);
        const reorderItems = [
            { name: "Jane", id: 0 },
            { name: "Alice", id: 3 },
        ];
        const reorderResult = await RedisBloomWrapper.multiExists("mybloom", reorderItems);
        expect(reorderResult.status).toBe(200);
        expect(reorderResult.result).toEqual([true, true]);
    });
});