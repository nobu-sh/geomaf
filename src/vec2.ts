import { Math } from "./math";

export class Vector2 {
	public x: number;
	public y: number;

	private static readonly zeroVector = new Vector2(0, 0);
	private static readonly oneVector = new Vector2(1, 1);
	private static readonly upVector = new Vector2(0, 1);
	private static readonly downVector = new Vector2(0, -1);
	private static readonly leftVector = new Vector2(-1, 0);
	private static readonly rightVector = new Vector2(1, 0);
	private static readonly positiveInfinityVector = new Vector2(
		Number.POSITIVE_INFINITY,
		Number.POSITIVE_INFINITY
	);

	private static readonly negativeInfinityVector = new Vector2(
		Number.NEGATIVE_INFINITY,
		Number.NEGATIVE_INFINITY
	);

	public static readonly kEpsilon = 1e-5;
	public static readonly kEpsilonNormalSqrt = 1e-15;

	public constructor();
	public constructor(x: number, y: number);
	public constructor(v: Vector2);
	public constructor(x?: number | Vector2, y?: number) {
		if (x instanceof Vector2) {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x ?? 0;
			this.y = y ?? 0;
		}
	}

	public copy() {
		return new Vector2(this.x, this.y);
	}

	public clone() {
		return new Vector2(this.x, this.y);
	}

	public get normalized() {
		return Vector2.normalize(this);
	}

	public get magnitude() {
		return Math.hypot(this.x, this.y);
	}

	public static sqrMagnitude(a: Vector2) {
		return a.x * a.x + a.y * a.y;
	}

	public get sqrMagnitude() {
		return Vector2.sqrMagnitude(this);
	}

	public static get zero() {
		return Vector2.zeroVector.copy();
	}

	public static get one() {
		return Vector2.oneVector.copy();
	}

	public static get up() {
		return Vector2.upVector.copy();
	}

	public static get down() {
		return Vector2.downVector.copy();
	}

	public static get left() {
		return Vector2.leftVector.copy();
	}

	public static get right() {
		return Vector2.rightVector.copy();
	}

	public static get positiveInfinity() {
		return Vector2.positiveInfinityVector.copy();
	}

	public static get negativeInfinity() {
		return Vector2.negativeInfinityVector.copy();
	}

	public set(v: Vector2): this;
	public set(x: number, y: number): this;
	public set(x: number | Vector2, y?: number): this {
		if (x instanceof Vector2) {
			this.x = x.x;
			this.y = x.y;
		} else {
			this.x = x;
			this.y = y ?? this.y;
		}

		return this;
	}

	public static lerp(a: Vector2, b: Vector2, t: number) {
		t = Math.clamp01(t);
		return Vector2.lerpUnclamped(a, b, t);
	}

	public static lerpUnclamped(a: Vector2, b: Vector2, t: number) {
		return new Vector2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
	}

	public static moveTowards(
		current: Vector2,
		target: Vector2,
		maxDistanceDelta: number
	) {
		const num = target.x - current.x;
		const num2 = target.y - current.y;
		const num3 = num * num + num2 * num2;
		if (
			num3 === 0 ||
			(maxDistanceDelta >= 0 && num3 <= maxDistanceDelta * maxDistanceDelta)
		) {
			return target.copy();
		}

		const num4 = Math.sqrt(num3);
		return new Vector2(
			current.x + (num / num4) * maxDistanceDelta,
			current.y + (num2 / num4) * maxDistanceDelta
		);
	}

	public static scale(a: Vector2, b: Vector2) {
		return new Vector2(a.x * b.x, a.y * b.y);
	}

	public static normalize(vector: Vector2) {
		const num = vector.magnitude;
		if (num > Vector2.kEpsilon) {
			return new Vector2(vector.x / num, vector.y / num);
		}

		return Vector2.zero.copy();
	}

	public normalize() {
		return this.set(Vector2.normalize(this));
	}

	public static equals(a: Vector2, b: Vector2) {
		return a.x === b.x && a.y === b.y;
	}

	public equals(other: Vector2) {
		return Vector2.equals(this, other);
	}

	public static dot(lhs: Vector2, rhs: Vector2) {
		return lhs.x * rhs.x + lhs.y * rhs.y;
	}

	public static reflect(inDirection: Vector2, inNormal: Vector2) {
		const num = -2 * Vector2.dot(inNormal, inDirection);
		return new Vector2(
			num * inNormal.x + inDirection.x,
			num * inNormal.y + inDirection.y
		);
	}

	public static perpendicular(inDirection: Vector2) {
		return new Vector2(-inDirection.y, inDirection.x);
	}

	public static angle(from: Vector2, to: Vector2) {
		const num = Math.sqrt(from.sqrMagnitude * to.sqrMagnitude);
		if (num < Vector2.kEpsilonNormalSqrt) {
			return 0;
		}

		const num2 = Math.clamp(Vector2.dot(from, to) / num, -1, 1);
		return Math.acos(num2) * 57.29578;
	}

	public static signedAngle(from: Vector2, to: Vector2) {
		const num = Vector2.angle(from, to);
		const num2 = Math.sign(from.x * to.y - from.y * to.x);
		return num * num2;
	}

	public static distance(a: Vector2, b: Vector2) {
		const num = a.x - b.x;
		const num2 = a.y - b.y;
		return Math.hypot(num, num2);
	}

	public static clampMagnitude(vector: Vector2, maxLength: number) {
		const num = vector.sqrMagnitude;
		if (num > maxLength * maxLength) {
			const num2 = Math.sqrt(num);
			const num3 = vector.x / num2;
			const num4 = vector.y / num2;
			return new Vector2(num3 * maxLength, num4 * maxLength);
		}

		return vector.copy();
	}

	public static smoothDamp(
		current: Vector2,
		_target: Vector2,
		currentVelocity: Vector2,
		smoothTime: number,
		deltaTime: number,
		maxSpeed: number = Number.POSITIVE_INFINITY
	) {
		const target = _target.copy();
		smoothTime = Math.max(0.0001, smoothTime);

		const num = 2 / smoothTime;
		const num2 = num * deltaTime;
		const num3 =
			1 / (1 + num2 + 0.48 * num2 * num2 + 0.235 * num2 * num2 * num2);
		let num4 = current.x - target.x;
		let num5 = current.y - target.y;
		const num6 = maxSpeed * smoothTime;
		const num7 = num6 * num6;
		const num8 = num4 * num4 + num5 * num5;
		if (num8 > num7) {
			const num9 = Math.sqrt(num8);
			num4 = (num4 / num9) * num6;
			num5 = (num5 / num9) * num6;
		}

		target.x = current.x - num4;
		target.y = current.y - num5;
		const num10 = (currentVelocity.x + num * num4) * deltaTime;
		const num11 = (currentVelocity.y + num * num5) * deltaTime;
		currentVelocity.x = (currentVelocity.x - num * num10) * num3;
		currentVelocity.y = (currentVelocity.y - num * num11) * num3;
		let num12 = target.x + (num4 + num10) * num3;
		let num13 = target.y + (num5 + num11) * num3;
		const num14 = target.x - current.x;
		const num15 = target.y - current.y;
		const num16 = num12 - target.x;
		const num17 = num13 - target.y;
		if (num14 * num16 + num15 * num17 > 0) {
			num12 = target.x;
			num13 = target.y;
			currentVelocity.x = (num12 - target.x) / deltaTime;
			currentVelocity.y = (num13 - target.y) / deltaTime;
		}

		return new Vector2(num12, num13);
	}

	public static min(lhs: Vector2, rhs: Vector2) {
		return new Vector2(Math.min(lhs.x, rhs.x), Math.min(lhs.y, rhs.y));
	}

	public static max(lhs: Vector2, rhs: Vector2) {
		return new Vector2(Math.max(lhs.x, rhs.x), Math.max(lhs.y, rhs.y));
	}

	public static add(a: Vector2, b: Vector2 | number) {
		return b instanceof Vector2
			? new Vector2(a.x + b.x, a.y + b.y)
			: new Vector2(a.x + b, a.y + b);
	}

	public add(b: Vector2 | number) {
		return Vector2.add(this, b);
	}

	public static subtract(a: Vector2, b: Vector2 | number) {
		return b instanceof Vector2
			? new Vector2(a.x - b.x, a.y - b.y)
			: new Vector2(a.x - b, a.y - b);
	}

	public subtract(b: Vector2 | number) {
		return Vector2.subtract(this, b);
	}

	public static multiply(a: Vector2, b: Vector2 | number) {
		return b instanceof Vector2
			? new Vector2(a.x * b.x, a.y * b.y)
			: new Vector2(a.x * b, a.y * b);
	}

	public multiply(b: Vector2 | number) {
		return Vector2.multiply(this, b);
	}

	public static divide(a: Vector2, b: Vector2 | number) {
		return b instanceof Vector2
			? new Vector2(a.x / b.x, a.y / b.y)
			: new Vector2(a.x / b, a.y / b);
	}

	public divide(b: Vector2 | number) {
		return Vector2.divide(this, b);
	}

	public static negate(a: Vector2) {
		return new Vector2(-a.x, -a.y);
	}

	public negate() {
		this.x = -this.x;
		this.y = -this.y;
	}

	public static abs(a: Vector2) {
		return new Vector2(Math.abs(a.x), Math.abs(a.y));
	}

	public abs() {
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
	}

	public static floor(a: Vector2) {
		return new Vector2(Math.floor(a.x), Math.floor(a.y));
	}

	public static ceil(a: Vector2) {
		return new Vector2(Math.ceil(a.x), Math.ceil(a.y));
	}

	public static round(a: Vector2) {
		return new Vector2(Math.round(a.x), Math.round(a.y));
	}

	// Class string tag
	public get [Symbol.toStringTag]() {
		return "Vector2";
	}

	// Indexer property
	public get 0() {
		return this.x;
	}

	public get 1() {
		return this.y;
	}

	public set 0(value) {
		this.x = value;
	}

	public set 1(value) {
		this.y = value;
	}

	// Iterator
	public *[Symbol.iterator]() {
		yield this.x;
		yield this.y;
	}

	// Creation utility
	public static fromArray(array: [number, number]) {
		return new Vector2(array[0], array[1]);
	}

	public static toArray(vector: Vector2) {
		return [vector.x, vector.y];
	}

	public static fromObject(obj: { x: number; y: number }) {
		return new Vector2(obj.x, obj.y);
	}

	public static toObject(vector: Vector2) {
		return { x: vector.x, y: vector.y };
	}

	public static fromString(s: string) {
		const [x, y] = s
			.slice(1, -1)
			.split(",")
			.map((n) => Number.parseFloat(n));
		return new Vector2(x, y);
	}

	public static toString(vector: Vector2) {
		return vector.toString();
	}

	public static fromVector(vector: Vector2) {
		return vector.copy();
	}

	public toString() {
		return `(${this.x}, ${this.y})`;
	}
}

export const Vec2 = Vector2;
