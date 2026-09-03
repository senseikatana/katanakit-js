import type { GeometryFormatOptions } from "@/types";

function formatGeometry(value: number, options: GeometryFormatOptions = {}): string {
	const { locale = "en", digits = 2, unit } = options;
	const formatted = new Intl.NumberFormat(locale, {
		maximumFractionDigits: digits,
		minimumFractionDigits: digits,
	}).format(value);

	return unit ? `${formatted} ${unit}` : formatted;
}

/** Area calculations for geometric shapes. */
export class GeometryArea {
	private constructor() {}

	static useRectangle(
		width: number,
		height: number,
		options?: GeometryFormatOptions,
	): string {
		return formatGeometry(width * height, options);
	}

	static useSquare(side: number, options?: GeometryFormatOptions): string {
		return formatGeometry(side ** 2, options);
	}

	static useTriangle(
		base: number,
		height: number,
		options?: GeometryFormatOptions,
	): string {
		return formatGeometry((base * height) / 2, options);
	}

	static useCircle(radius: number, options?: GeometryFormatOptions): string {
		return formatGeometry(Math.PI * radius ** 2, options);
	}

	static useTrapezoid(
		parallelSide1: number,
		parallelSide2: number,
		height: number,
		options?: GeometryFormatOptions,
	): string {
		return formatGeometry(((parallelSide1 + parallelSide2) * height) / 2, options);
	}

	static useHexagon(side: number, options?: GeometryFormatOptions): string {
		return formatGeometry(((3 * Math.sqrt(3)) / 2) * side ** 2, options);
	}

	static useEllipse(
		semiMajor: number,
		semiMinor: number,
		options?: GeometryFormatOptions,
	): string {
		return formatGeometry(Math.PI * semiMajor * semiMinor, options);
	}

	static useParallelogram(
		base: number,
		height: number,
		options?: GeometryFormatOptions,
	): string {
		return formatGeometry(base * height, options);
	}
}

/** Perimeter calculations for geometric shapes. */
export class GeometryPerimeter {
	private constructor() {}

	static useRectangle(
		width: number,
		height: number,
		options?: GeometryFormatOptions,
	): string {
		return formatGeometry(2 * (width + height), options);
	}

	static useSquare(side: number, options?: GeometryFormatOptions): string {
		return formatGeometry(4 * side, options);
	}

	static useTriangle(
		side1: number,
		side2: number,
		side3: number,
		options?: GeometryFormatOptions,
	): string {
		return formatGeometry(side1 + side2 + side3, options);
	}

	static useCircle(radius: number, options?: GeometryFormatOptions): string {
		return formatGeometry(2 * Math.PI * radius, options);
	}

	static useHexagon(side: number, options?: GeometryFormatOptions): string {
		return formatGeometry(6 * side, options);
	}

	static useTrapezoid(
		side1: number,
		side2: number,
		side3: number,
		side4: number,
		options?: GeometryFormatOptions,
	): string {
		return formatGeometry(side1 + side2 + side3 + side4, options);
	}

	static useEllipse(
		semiMajor: number,
		semiMinor: number,
		options?: GeometryFormatOptions,
	): string {
		const a = semiMajor;
		const b = semiMinor;
		const h = (a - b) ** 2 / (a + b) ** 2;
		const perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
		return formatGeometry(perimeter, options);
	}

	static useParallelogram(
		side1: number,
		side2: number,
		options?: GeometryFormatOptions,
	): string {
		return formatGeometry(2 * (side1 + side2), options);
	}
}

/** Volume calculations for 3D geometric shapes. */
export class GeometryVolume {
	private constructor() {}

	static useCube(side: number, options?: GeometryFormatOptions): string {
		return formatGeometry(side ** 3, options);
	}

	static useBox(
		length: number,
		width: number,
		height: number,
		options?: GeometryFormatOptions,
	): string {
		return formatGeometry(length * width * height, options);
	}

	static useSphere(radius: number, options?: GeometryFormatOptions): string {
		return formatGeometry((4 / 3) * Math.PI * radius ** 3, options);
	}

	static useCylinder(
		radius: number,
		height: number,
		options?: GeometryFormatOptions,
	): string {
		return formatGeometry(Math.PI * radius ** 2 * height, options);
	}

	static useCone(
		radius: number,
		height: number,
		options?: GeometryFormatOptions,
	): string {
		return formatGeometry((1 / 3) * Math.PI * radius ** 2 * height, options);
	}

	static usePyramid(
		baseArea: number,
		height: number,
		options?: GeometryFormatOptions,
	): string {
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
