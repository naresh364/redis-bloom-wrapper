
import exp from "constants";
import { createClient } from "redis";

export namespace RedisBloomWrapper {

    let client: any = null;
    export async function init(redisCreds: any, redisClientIn?: any) {
        if (redisClientIn) {
            client = redisClientIn;
            return redisClientIn;
        }
        let url = "";
        if (redisCreds.username && redisCreds.password) {
            url = `redis://${redisCreds.username}:${redisCreds.password}@${redisCreds.host}:${redisCreds.port}`;
        } else {
            url = `redis://${redisCreds.host}:${redisCreds.port}`;
        }
        if (redisCreds.database) {
            url += `/${redisCreds.database}`;
        }
        client = await createClient({ url }).on('error', err => console.log('Redis Client Error', err)).connect();;
        return client;
    }

    export async function deleteBloomFilter(key: string) {
        try {
            await client.del(key);
            console.log('Deleted Bloom Filter.');
            return { status: 200, message: 'Bloom Filter Deleted' };
        } catch (e: any) {
            console.log('Error deleting Bloom Filter:');
            console.log(e);
            return { status: 500, message: 'Error deleting Bloom Filter' };
        }
    }

    async function createBloomFilter(key: string, capacity: number = 100000, errorRate: number = .01) {
        try {
            await client.set('bf.errorRate', errorRate);
            await client.bf.reserve('mybloom', 0.01, 1000);
            console.log('Reserved Bloom Filter.');
            return { status: 200, message: 'Bloom Filter Reserved' };
        } catch (e: any) {
            console.log(e);
            if (e.message.endsWith('item exists')) {
                console.log('Bloom Filter already reserved.');
                return { status: 200, message: 'Bloom Filter already reserved.' };
            } else {
                console.log('Error, maybe RedisBloom is not installed?:');
                return { status: 500, message: 'Error, maybe RedisBloom is not installed?' };
            }
        }
    }

    function sortAndStringify(obj: any) {
        return JSON.stringify(Object.keys(obj).sort().reduce((result: any, key: string) => {
            result[key] = obj[key];
            return result;
        }, {} as any));
    }

    function sortAndStringifyArray(objs: any[]) {
        return objs.map(obj => sortAndStringify(obj));
    }

    export async function add(key: string, itemObj: object) {
        try {
            const item = sortAndStringify(itemObj);
            await client.bf.add(key, item);
            return { status: 200, message: 'Added item to Bloom Filter' };
        } catch (e: any) {
            console.log('Error adding item to Bloom Filter:');
            console.log(e);
            return { status: 500, message: 'Error adding item to Bloom Filter' };
        }
    }

    export async function insert(key: string, itemObjs: object[]) {
        try {
            const items = sortAndStringifyArray(itemObjs);
            await client.bf.mAdd(key, items);
            return { status: 200, message: 'Added items to Bloom Filter' };
        } catch (e: any) {
            console.log('Error adding items to Bloom Filter:');
            console.log(e);
            return { status: 500, message: 'Error adding items to Bloom Filter' };
        }
    }

    export async function exists(key: string, itemObj: object) {
        try {
            const item = sortAndStringify(itemObj);
            let result = await client.bf.exists(key, item);
            return { status: 200, message: 'Checked item in Bloom Filter', result };
        } catch (e: any) {
            console.log('Error checking item in Bloom Filter:');
            console.log(e);
            return { status: 500, message: 'Error checking item in Bloom Filter' };
        }
    }

    export async function multiExists(key: string, itemObjs: object[]) {
        try {
            const items = sortAndStringifyArray(itemObjs);
            let result = await client.bf.mExists(key, items);
            return { status: 200, message: 'Checked items in Bloom Filter', result };
        } catch (e: any) {
            console.log('Error checking items in Bloom Filter:');
            console.log(e);
            return { status: 500, message: 'Error checking items in Bloom Filter' };
        }
    }

}

export default RedisBloomWrapper;
    