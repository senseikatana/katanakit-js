import { useLog } from "./logger.service.js";
/**
 * Timing utilities: delays, debouncing, throttling and timeouts.
 * Implemented as a Singleton facade with factory methods.
 */
export default class TimingService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!TimingService.instance) {
            TimingService.instance = new TimingService();
        }
        return TimingService.instance;
    }
    useDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    /** Alias for delay, more semantic for sleep operations. */
    useSleep = (ms) => this.useDelay(ms);
    useSetTimeout = (callback, ms) => {
        let timerId;
        let isCancelled = false;
        const promise = new Promise((resolve, reject) => {
            timerId = setTimeout(async () => {
                if (isCancelled)
                    return;
                try {
                    const result = await callback();
                    resolve(result);
                }
                catch (error) {
                    reject(error);
                }
            }, ms);
        });
        const cancel = () => {
            isCancelled = true;
            clearTimeout(timerId);
        };
        return { promise, cancel };
    };
    useInterval = (callback, ms, immediate = false) => {
        let timerId = null;
        let isPaused = false;
        let isStopped = false;
        let isExecuting = false;
        const execute = async () => {
            if (isPaused || isStopped || isExecuting)
                return;
            isExecuting = true;
            try {
                await callback();
            }
            catch (error) {
                useLog("error", "[interval] Callback error:", error);
            }
            finally {
                isExecuting = false;
            }
        };
        const scheduleNext = () => {
            if (isStopped || isPaused)
                return;
            timerId = setTimeout(async () => {
                await execute();
                scheduleNext();
            }, ms);
        };
        const stop = () => {
            isStopped = true;
            isPaused = false;
            if (timerId) {
                clearTimeout(timerId);
                timerId = null;
            }
        };
        const pause = () => {
            if (isStopped)
                return;
            isPaused = true;
            if (timerId) {
                clearTimeout(timerId);
                timerId = null;
            }
        };
        const resume = () => {
            if (isStopped || !isPaused)
                return;
            isPaused = false;
            scheduleNext();
        };
        const isRunning = () => !isStopped && !isPaused;
        if (immediate) {
            execute().then(() => scheduleNext());
        }
        else {
            scheduleNext();
        }
        return { pause, resume, stop, isRunning };
    };
    useDebounce = (func, delayMs) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                try {
                    func(...args);
                }
                catch (error) {
                    useLog("error", "[debounce] Callback error:", error);
                }
                timeoutId = undefined;
            }, delayMs);
        };
    };
    useDebounceImmediate = (func, delayMs) => {
        let timeoutId;
        let lastCallTime;
        return (...args) => {
            const now = Date.now();
            const isFirstCall = lastCallTime === undefined;
            lastCallTime = now;
            if (isFirstCall) {
                try {
                    func(...args);
                }
                catch (error) {
                    useLog("error", "[debounceImmediate] Callback error:", error);
                }
            }
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                if (Date.now() - Number(lastCallTime) >= delayMs) {
                    try {
                        func(...args);
                    }
                    catch (error) {
                        useLog("error", "[debounceImmediate] Callback error:", error);
                    }
                }
                timeoutId = undefined;
                lastCallTime = undefined;
            }, delayMs);
        };
    };
    useThrottle = (func, limitMs) => {
        let inThrottle = false;
        return (...args) => {
            if (!inThrottle) {
                try {
                    func(...args);
                }
                catch (error) {
                    useLog("error", "[throttle] Callback error:", error);
                }
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limitMs);
            }
        };
    };
    useThrottleTrailing = (func, limitMs) => {
        let inThrottle = false;
        let lastArgs = null;
        return (...args) => {
            if (!inThrottle) {
                try {
                    func(...args);
                }
                catch (error) {
                    useLog("error", "[throttleTrailing] Callback error:", error);
                }
                inThrottle = true;
                lastArgs = null;
                setTimeout(() => {
                    inThrottle = false;
                    if (lastArgs) {
                        try {
                            func(...lastArgs);
                        }
                        catch (error) {
                            useLog("error", "[throttleTrailing] Callback error:", error);
                        }
                    }
                }, limitMs);
            }
            else {
                lastArgs = args;
            }
        };
    };
    useRepeat = async (callback, iterations, delayMs = 0) => {
        for (let i = 0; i < iterations; i++) {
            try {
                await callback(i);
            }
            catch (error) {
                useLog("error", "[repeat] Callback error:", error);
            }
            if (i < iterations - 1 && delayMs > 0) {
                await this.useDelay(delayMs);
            }
        }
    };
    useRace = async (promise, timeoutMs, errorMessage = "Operation timed out") => {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
        });
        return Promise.race([promise, timeoutPromise]);
    };
}
// Singleton instance and destructured exports.
export const { useDelay, useSetTimeout, useInterval, useDebounce, useDebounceImmediate, useThrottle, useThrottleTrailing, useRepeat, useRace, } = TimingService.getInstance();
//# sourceMappingURL=timing.service.js.map