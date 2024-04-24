export namespace Math {
	// Re-export existing Math functions
	export const {
		abs,
		acos,
		acosh,
		asin,
		asinh,
		atan,
		atan2,
		atanh,
		cbrt,
		ceil,
		clz32,
		cos,
		cosh,
		exp,
		expm1,
		floor,
		fround,
		hypot,
		imul,
		log,
		log1p,
		log10,
		log2,
		max,
		min,
		pow,
		random,
		round,
		sign,
		sin,
		sinh,
		sqrt,
		tan,
		tanh,
		trunc
	} = globalThis.Math;

	export function clamp(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, value));
	}

	export function clamp01(value: number): number {
		return clamp(value, 0, 1);
	}
}
