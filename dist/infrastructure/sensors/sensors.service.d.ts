import type { BatteryManager, GeoPosition } from "../../types/index.js";
/**
 * Device sensors and hardware APIs: camera, microphone, geolocation,
 * gyroscope and vibration.
 */
export declare class SensorsUtils {
    private static instance;
    private constructor();
    static getInstance(): SensorsUtils;
    private isBrowser;
    useGetMediaStream(constraints?: MediaStreamConstraints): Promise<MediaStream | null>;
    useStopMediaStream(stream: MediaStream | null): void;
    useGetFrontCamera(): Promise<MediaStream | null>;
    useGetBackCamera(): Promise<MediaStream | null>;
    useGetGeolocation(options?: PositionOptions): Promise<GeoPosition | null>;
    useWatchGeolocation(callback: (position: GeoPosition) => void, options?: PositionOptions): (() => void) | null;
    useRequestMotionPermission(): Promise<boolean>;
    useOnDeviceOrientation(callback: (event: DeviceOrientationEvent) => void): (() => void) | null;
    useOnDeviceMotion(callback: (event: DeviceMotionEvent) => void): (() => void) | null;
    useVibrate(pattern: number | number[]): boolean;
    useStopVibration(): boolean;
    useGetBattery(): Promise<BatteryManager | null>;
}
export declare const sensorsUtils: SensorsUtils;
//# sourceMappingURL=sensors.service.d.ts.map