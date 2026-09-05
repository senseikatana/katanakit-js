# Class: SensorsUtils

Defined in: [src/infrastructure/sensors/sensors.service.ts:9](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/sensors/sensors.service.ts#L9)

Device sensors and hardware APIs: camera, microphone, geolocation,
gyroscope and vibration.

## Methods

### useGetBackCamera()

> **useGetBackCamera**(): `Promise`&lt;`MediaStream` \| `null`&gt;

Defined in: [src/infrastructure/sensors/sensors.service.ts:53](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/sensors/sensors.service.ts#L53)

#### Returns

`Promise`&lt;`MediaStream` \| `null`&gt;

***

### useGetBattery()

> **useGetBattery**(): `Promise`&lt;[`BatteryManager`](../interfaces/BatteryManager.md) \| `null`&gt;

Defined in: [src/infrastructure/sensors/sensors.service.ts:155](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/sensors/sensors.service.ts#L155)

#### Returns

`Promise`&lt;[`BatteryManager`](../interfaces/BatteryManager.md) \| `null`&gt;

***

### useGetFrontCamera()

> **useGetFrontCamera**(): `Promise`&lt;`MediaStream` \| `null`&gt;

Defined in: [src/infrastructure/sensors/sensors.service.ts:49](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/sensors/sensors.service.ts#L49)

#### Returns

`Promise`&lt;`MediaStream` \| `null`&gt;

***

### useGetGeolocation()

> **useGetGeolocation**(`options?`): `Promise`&lt;[`GeoPosition`](../interfaces/GeoPosition.md) \| `null`&gt;

Defined in: [src/infrastructure/sensors/sensors.service.ts:57](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/sensors/sensors.service.ts#L57)

#### Parameters

##### options?

`PositionOptions`

#### Returns

`Promise`&lt;[`GeoPosition`](../interfaces/GeoPosition.md) \| `null`&gt;

***

### useGetMediaStream()

> **useGetMediaStream**(`constraints?`): `Promise`&lt;`MediaStream` \| `null`&gt;

Defined in: [src/infrastructure/sensors/sensors.service.ts:25](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/sensors/sensors.service.ts#L25)

#### Parameters

##### constraints?

`MediaStreamConstraints` = `...`

#### Returns

`Promise`&lt;`MediaStream` \| `null`&gt;

***

### useOnDeviceMotion()

> **useOnDeviceMotion**(`callback`): (() => `void`) \| `null`

Defined in: [src/infrastructure/sensors/sensors.service.ts:134](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/sensors/sensors.service.ts#L134)

#### Parameters

##### callback

(`event`) => `void`

#### Returns

(() => `void`) \| `null`

***

### useOnDeviceOrientation()

> **useOnDeviceOrientation**(`callback`): (() => `void`) \| `null`

Defined in: [src/infrastructure/sensors/sensors.service.ts:124](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/sensors/sensors.service.ts#L124)

#### Parameters

##### callback

(`event`) => `void`

#### Returns

(() => `void`) \| `null`

***

### useRequestMotionPermission()

> **useRequestMotionPermission**(): `Promise`&lt;`boolean`&gt;

Defined in: [src/infrastructure/sensors/sensors.service.ts:101](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/sensors/sensors.service.ts#L101)

#### Returns

`Promise`&lt;`boolean`&gt;

***

### useStopMediaStream()

> **useStopMediaStream**(`stream`): `void`

Defined in: [src/infrastructure/sensors/sensors.service.ts:41](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/sensors/sensors.service.ts#L41)

#### Parameters

##### stream

`MediaStream` \| `null`

#### Returns

`void`

***

### useStopVibration()

> **useStopVibration**(): `boolean`

Defined in: [src/infrastructure/sensors/sensors.service.ts:151](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/sensors/sensors.service.ts#L151)

#### Returns

`boolean`

***

### useVibrate()

> **useVibrate**(`pattern`): `boolean`

Defined in: [src/infrastructure/sensors/sensors.service.ts:144](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/sensors/sensors.service.ts#L144)

#### Parameters

##### pattern

`number` \| `number`[]

#### Returns

`boolean`

***

### useWatchGeolocation()

> **useWatchGeolocation**(`callback`, `options?`): (() => `void`) \| `null`

Defined in: [src/infrastructure/sensors/sensors.service.ts:78](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/sensors/sensors.service.ts#L78)

#### Parameters

##### callback

(`position`) => `void`

##### options?

`PositionOptions`

#### Returns

(() => `void`) \| `null`

***

### getInstance()

> `static` **getInstance**(): `SensorsUtils`

Defined in: [src/infrastructure/sensors/sensors.service.ts:14](https://github.com/senseikatana/katanakit-js/blob/89973fb2e06eef81e6447210b58cbc9761567635/src/infrastructure/sensors/sensors.service.ts#L14)

#### Returns

`SensorsUtils`
