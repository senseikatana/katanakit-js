function formatGeometry(value, options = {}) {
    const { locale = "en", digits = 2, unit } = options;
    const formatted = new Intl.NumberFormat(locale, {
        maximumFractionDigits: digits,
        minimumFractionDigits: digits,
    }).format(value);
    return unit ? `${formatted} ${unit}` : formatted;
}
/** Area calculations for geometric shapes. */
export class GeometryArea {
    constructor() { }
    static useRectangle(width, height, options) {
        return formatGeometry(width * height, options);
    }
    static useSquare(side, options) {
        return formatGeometry(side ** 2, options);
    }
    static useTriangle(base, height, options) {
        return formatGeometry((base * height) / 2, options);
    }
    static useCircle(radius, options) {
        return formatGeometry(Math.PI * radius ** 2, options);
    }
    static useTrapezoid(parallelSide1, parallelSide2, height, options) {
        return formatGeometry(((parallelSide1 + parallelSide2) * height) / 2, options);
    }
    static useHexagon(side, options) {
        return formatGeometry(((3 * Math.sqrt(3)) / 2) * side ** 2, options);
    }
    static useEllipse(semiMajor, semiMinor, options) {
        return formatGeometry(Math.PI * semiMajor * semiMinor, options);
    }
    static useParallelogram(base, height, options) {
        return formatGeometry(base * height, options);
    }
}
/** Perimeter calculations for geometric shapes. */
export class GeometryPerimeter {
    constructor() { }
    static useRectangle(width, height, options) {
        return formatGeometry(2 * (width + height), options);
    }
    static useSquare(side, options) {
        return formatGeometry(4 * side, options);
    }
    static useTriangle(side1, side2, side3, options) {
        return formatGeometry(side1 + side2 + side3, options);
    }
    static useCircle(radius, options) {
        return formatGeometry(2 * Math.PI * radius, options);
    }
    static useHexagon(side, options) {
        return formatGeometry(6 * side, options);
    }
    static useTrapezoid(side1, side2, side3, side4, options) {
        return formatGeometry(side1 + side2 + side3 + side4, options);
    }
    static useEllipse(semiMajor, semiMinor, options) {
        const a = semiMajor;
        const b = semiMinor;
        const h = (a - b) ** 2 / (a + b) ** 2;
        const perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
        return formatGeometry(perimeter, options);
    }
    static useParallelogram(side1, side2, options) {
        return formatGeometry(2 * (side1 + side2), options);
    }
}
/** Volume calculations for 3D geometric shapes. */
export class GeometryVolume {
    constructor() { }
    static useCube(side, options) {
        return formatGeometry(side ** 3, options);
    }
    static useBox(length, width, height, options) {
        return formatGeometry(length * width * height, options);
    }
    static useSphere(radius, options) {
        return formatGeometry((4 / 3) * Math.PI * radius ** 3, options);
    }
    static useCylinder(radius, height, options) {
        return formatGeometry(Math.PI * radius ** 2 * height, options);
    }
    static useCone(radius, height, options) {
        return formatGeometry((1 / 3) * Math.PI * radius ** 2 * height, options);
    }
    static usePyramid(baseArea, height, options) {
        return formatGeometry((1 / 3) * baseArea * height, options);
    }
}
/**
 * Consolidated geometry utilities namespace.
 * Groups area, perimeter and volume calculations.
 */
export const GeometryUtils = {
    area: GeometryArea,
    perimeter: GeometryPerimeter,
    volume: GeometryVolume,
};
//# sourceMappingURL=geometry.service.js.map