/**
 * Data utilities implemented as a Singleton.
 */
export class DataUtils {
    static instance;
    constructor() { }
    static getInstance() {
        if (!DataUtils.instance) {
            DataUtils.instance = new DataUtils();
        }
        return DataUtils.instance;
    }
    useUnique = (array) => [...new Set(array)];
    useChunk = (array, size) => {
        if (size <= 0)
            throw new Error("Chunk size must be greater than 0");
        return Array.from({ length: Math.ceil(array.length / size) }, (_, i) => array.slice(i * size, i * size + size));
    };
    useGroupBy = (array, key) => {
        return array.reduce((acc, item) => {
            const groupKey = typeof key === "function" ? key(item) : String(item[key]);
            if (!acc[groupKey]) {
                acc[groupKey] = [];
            }
            acc[groupKey].push(item);
            return acc;
        }, {});
    };
    useIsObject = (item) => typeof item === "object" && item !== null && !Array.isArray(item);
    useDeepClone = (value) => {
        if (typeof structuredClone === "function") {
            return structuredClone(value);
        }
        return JSON.parse(JSON.stringify(value));
    };
    useDeepMerge = (target, source) => {
        if (!target || !source)
            return { ...target };
        const output = { ...target };
        for (const key of Object.keys(source)) {
            const targetVal = target[key];
            const sourceVal = source[key];
            if (this.useIsObject(targetVal) && this.useIsObject(sourceVal)) {
                output[key] = this.useDeepMerge(targetVal, sourceVal);
            }
            else {
                output[key] = sourceVal;
            }
        }
        return output;
    };
    usePick = (obj, keys) => {
        return keys.reduce((acc, key) => {
            if (key in obj)
                acc[key] = obj[key];
            return acc;
        }, {});
    };
    useOmit = (obj, keys) => {
        const result = this.useDeepClone(obj);
        for (const key of keys)
            delete result[key];
        return result;
    };
}
/**
 * System utilities implemented as a Singleton.
 */
export class SystemUtils {
    static instance;
    constructor() { }
    static getInstance() {
        if (!SystemUtils.instance) {
            SystemUtils.instance = new SystemUtils();
        }
        return SystemUtils.instance;
    }
    useSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    useRetry = async (fn, retries = 3, delayMs = 1000) => {
        try {
            return await fn();
        }
        catch (error) {
            if (retries <= 0)
                throw error;
            await this.useSleep(delayMs);
            return this.useRetry(fn, retries - 1, delayMs);
        }
    };
    useCopyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        }
        catch {
            return false;
        }
    };
    useGetUrlParams = (urlString) => {
        try {
            const url = new URL(urlString);
            return Object.fromEntries(url.searchParams.entries());
        }
        catch {
            return {};
        }
    };
    useRound = (value, decimals = 2) => {
        const num = typeof value === "string" ? Number.parseFloat(value) : value;
        if (Number.isNaN(num))
            return 0;
        const factor = 10 ** decimals;
        return Math.round(num * factor) / factor;
    };
    useAverage = (numbers) => {
        if (numbers.length === 0)
            return 0;
        const sum = numbers.reduce((acc, n) => acc + n, 0);
        return sum / numbers.length;
    };
}
/**
 * Main facade composing data and system utilities.
 */
export class AppUtils {
    static instance;
    data;
    system;
    constructor() {
        this.data = DataUtils.getInstance();
        this.system = SystemUtils.getInstance();
    }
    static getInstance() {
        if (!AppUtils.instance) {
            AppUtils.instance = new AppUtils();
        }
        return AppUtils.instance;
    }
}
// Singleton instances and destructured exports.
export const { useUnique, useChunk, useGroupBy, useIsObject, useDeepClone, useDeepMerge, usePick, useOmit, } = DataUtils.getInstance();
export const { useSleep, useRetry, useCopyToClipboard, useGetUrlParams, useRound, useAverage, } = SystemUtils.getInstance();
//# sourceMappingURL=utils.service.js.map