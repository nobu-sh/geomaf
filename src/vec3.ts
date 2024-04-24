import { Math } from "./math";

export class Vector3 {
	public x: number;
	public y: number;
	public z: number;

	private static readonly zeroVector = new Vector3(0, 0, 0);
	private static readonly oneVector = new Vector3(1, 1, 1);
	private static readonly upVector = new Vector3(0, 1, 0);
	private static readonly downVector = new Vector3(0, -1, 0);
	private static readonly leftVector = new Vector3(-1, 0, 0);
	private static readonly rightVector = new Vector3(1, 0, 0);
	private static readonly forwardVector = new Vector3(0, 0, 1);
	private static readonly backVector = new Vector3(0, 0, -1);
	private static readonly positiveInfinityVector = new Vector3(
		Number.POSITIVE_INFINITY,
		Number.POSITIVE_INFINITY,
		Number.POSITIVE_INFINITY
	);

	private static readonly negativeInfinityVector = new Vector3(
		Number.NEGATIVE_INFINITY,
		Number.NEGATIVE_INFINITY,
		Number.NEGATIVE_INFINITY
	);

	public static readonly kEpsilon = 1e-5;
	public static readonly kEpsilonNormalSqrt = 1e-15;

	public constructor();
	public constructor(x: number, y: number);
	public constructor(x: number, y: number, z: number);
	public constructor(v: Vector3);
	public constructor(x?: number | Vector3, y?: number, z?: number) {
		if (x instanceof Vector3) {
			this.x = x.x;
			this.y = x.y;
			this.z = x.z;
		} else {
			this.x = x ?? 0;
			this.y = y ?? 0;
			this.z = z ?? 0;
		}
	}

	public copy() {
		return new Vector3(this.x, this.y, this.z);
	}

	public clone() {
		return new Vector3(this.x, this.y, this.z);
	}

	public get normalized() {
		return Vector3.normalize(this);
	}

	public get magnitude() {
		return Math.hypot(this.x, this.y, this.z);
	}

	public static sqrMagnitude(v: Vector3) {
		return v.x * v.x + v.y * v.y + v.z * v.z;
	}

	public get sqrMagnitude() {
		return Vector3.sqrMagnitude(this);
	}

	public static get zero() {
		return Vector3.zeroVector.copy();
	}

	public static get one() {
		return Vector3.oneVector.copy();
	}

	public static get up() {
		return Vector3.upVector.copy();
	}

	public static get down() {
		return Vector3.downVector.copy();
	}

	public static get left() {
		return Vector3.leftVector.copy();
	}

	public static get right() {
		return Vector3.rightVector.copy();
	}

	public static get forward() {
		return Vector3.forwardVector.copy();
	}

	public static get back() {
		return Vector3.backVector.copy();
	}

	public static get positiveInfinity() {
		return Vector3.positiveInfinityVector.copy();
	}

	public static get negativeInfinity() {
		return Vector3.negativeInfinityVector.copy();
	}

	public set(v: Vector3): this;
	public set(x: number, y: number, z: number): this;
	public set(x: number | Vector3, y?: number, z?: number): this {
		if (x instanceof Vector3) {
			this.x = x.x;
			this.y = x.y;
			this.z = x.z;
		} else {
			this.x = x;
			this.y = y ?? this.y;
			this.z = z ?? this.z;
		}

		return this;
	}

	public static slerp(a: Vector3, b: Vector3, t: number) {
		t = Math.clamp01(t);
		return Vector3.slerpUnclamped(a, b, t);
	}

	public static slerpUnclamped(a: Vector3, b: Vector3, t: number) {
		let dot = Vector3.dot(a, b);
		const threshold = 0.9995;
		if (dot > threshold) {
			return Vector3.add(
				Vector3.multiply(Vector3.subtract(b, a), t),
				a
			).normalize();
		}

		dot = Math.clamp(dot, -1, 1);
		const theta = Math.acos(dot) * t;
		return Vector3.add(
			Vector3.multiply(a, Math.cos(theta)),
			Vector3.multiply(
				Vector3.subtract(Vector3.multiply(a, dot), b).normalize(),
				Math.sin(theta)
			)
		);
	}

	// This is supposed to mutate the original reference ig
	public static orthoNormalize(normal: Vector3, tangent: Vector3): void;
	public static orthoNormalize(normal: Vector3, tangent: Vector3): void;
	public static orthoNormalize(
		normal: Vector3,
		tangent: Vector3,
		binormal?: Vector3
	): void {
		normal.normalize();
		tangent
			.subtract(Vector3.multiply(normal, Vector3.dot(tangent, normal)))
			.normalize();

		if (binormal) {
			binormal.subtract(
				Vector3.multiply(normal, Vector3.dot(binormal, normal))
			);
			binormal.subtract(
				Vector3.multiply(tangent, Vector3.dot(binormal, tangent))
			);
			binormal.normalize();
		}
	}

	public static rotateTowards(
		current: Vector3,
		target: Vector3,
		maxRadiansDelta: number,
		maxMagnitudeDelta: number
	) {
		const currentMagnitude = current.magnitude;
		const targetMagnitude = target.magnitude;

		current = current.normalized;
		target = target.normalized;

		const dot = Vector3.dot(current, target);
		const theta = Math.acos(Math.clamp(dot, -1, 1));
		const angle = Math.min(maxRadiansDelta, theta);

		const newVec = this.slerpUnclamped(current, target, angle / theta);

		const magnitude = Math.min(
			currentMagnitude + maxMagnitudeDelta,
			targetMagnitude
		);
		newVec.multiply(magnitude);

		return newVec;
	}

	public static lerp(a: Vector3, b: Vector3, t: number) {
		t = Math.clamp01(t);
		return Vector3.lerpUnclamped(a, b, t);
	}

	public static lerpUnclamped(a: Vector3, b: Vector3, t: number) {
		return new Vector3(
			a.x + (b.x - a.x) * t,
			a.y + (b.y - a.y) * t,
			a.z + (b.z - a.z) * t
		);
	}

	public static moveTowards(
		current: Vector3,
		target: Vector3,
		maxDistanceDelta: number
	) {
		const num = target.x - current.x;
		const num2 = target.y - current.y;
		const num3 = target.z - current.z;
		const num4 = num * num + num2 * num2 + num3 * num3;
		if (
			num4 === 0 ||
			(maxDistanceDelta >= 0 && num4 <= maxDistanceDelta * maxDistanceDelta)
		) {
			return target.copy();
		}

		const num5 = Math.sqrt(num4);
		return new Vector3(
			current.x + (num / num5) * maxDistanceDelta,
			current.y + (num2 / num5) * maxDistanceDelta,
			current.z + (num3 / num5) * maxDistanceDelta
		);
	}

	public static smoothDamp(
		current: Vector3,
		_target: Vector3,
		currentVelocity: Vector3,
		smoothTime: number,
		deltaTime: number,
		maxSpeed: number = Number.POSITIVE_INFINITY
	) {
		const target = _target.copy();

		let num = 0;
		let num2 = 0;
		let num3 = 0;
		smoothTime = Math.max(0.0001, smoothTime);
		const num4 = 2 / smoothTime;
		const num5 = num4 * deltaTime;
		const num6 =
			1 / (1 + num5 + 0.48 * num5 * num5 + 0.235 * num5 * num5 * num5);
		let num7 = current.x - target.x;
		let num8 = current.y - target.y;
		let num9 = current.z - target.z;
		const num10 = maxSpeed * smoothTime;
		const num11 = num10 * num10;
		const num12 = num7 * num7 + num8 * num8 + num9 * num9;
		if (num12 > num11) {
			const num13 = Math.sqrt(num12);
			num7 = (num7 / num13) * num10;
			num8 = (num8 / num13) * num10;
			num9 = (num9 / num13) * num10;
		}

		target.x = current.x - num7;
		target.y = current.y - num8;
		target.z = current.z - num9;
		const num14 = (currentVelocity.x + num4 * num7) * deltaTime;
		const num15 = (currentVelocity.y + num4 * num8) * deltaTime;
		const num16 = (currentVelocity.z + num4 * num9) * deltaTime;
		currentVelocity.x = (currentVelocity.x - num4 * num14) * num6;
		currentVelocity.y = (currentVelocity.y - num4 * num15) * num6;
		currentVelocity.z = (currentVelocity.z - num4 * num16) * num6;
		num = target.x + (num7 + num14) * num6;
		num2 = target.y + (num8 + num15) * num6;
		num3 = target.z + (num9 + num16) * num6;
		const num17 = target.x - current.x;
		const num18 = target.y - current.y;
		const num19 = target.z - current.z;
		const num20 = num - target.x;
		const num21 = num2 - target.y;
		const num22 = num3 - target.z;
		if (num17 * num20 + num18 * num21 + num19 * num22 > 0) {
			num = target.x;
			num2 = target.y;
			num3 = target.z;
			currentVelocity.x = (num - target.x) / deltaTime;
			currentVelocity.y = (num2 - target.y) / deltaTime;
			currentVelocity.z = (num3 - target.z) / deltaTime;
		}

		return new Vector3(num, num2, num3);
	}

	public static normalize(v: Vector3) {
		const mag = v.magnitude;
		if (mag > this.kEpsilon) {
			return new Vector3(v.x / mag, v.y / mag, v.z / mag);
		}

		return Vector3.zero.copy();
	}

	public normalize() {
		return this.set(Vector3.normalize(this));
	}

	public static equals(a: Vector3, b: Vector3) {
		return a.x === b.x && a.y === b.y && a.z === b.z;
	}

	public equals(b: Vector3) {
		return Vector3.equals(this, b);
	}

	public static dot(a: Vector3, b: Vector3) {
		return a.x * b.x + a.y * b.y + a.z * b.z;
	}

	public static scale(a: Vector3, b: Vector3) {
		return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
	}

	public static cross(a: Vector3, b: Vector3) {
		return new Vector3(
			a.y * b.z - a.z * b.y,
			a.z * b.x - a.x * b.z,
			a.x * b.y - a.y * b.x
		);
	}

	public static reflect(inDirection: Vector3, inNormal: Vector3) {
		const num = -2 * Vector3.dot(inNormal, inDirection);
		return new Vector3(
			num * inNormal.x + inDirection.x,
			num * inNormal.y + inDirection.y,
			num * inNormal.z + inDirection.z
		);
	}

	public static project(vector: Vector3, onNormal: Vector3) {
		const num = Vector3.dot(onNormal, onNormal);
		if (num < Number.EPSILON) {
			return Vector3.zero.copy();
		}

		const num2 = Vector3.dot(vector, onNormal);
		return new Vector3(
			(onNormal.x * num2) / num,
			(onNormal.y * num2) / num,
			(onNormal.z * num2) / num
		);
	}

	public static projectOnPlane(vector: Vector3, planeNormal: Vector3) {
		const num = Vector3.dot(planeNormal, planeNormal);
		if (num < Number.EPSILON) {
			return vector.copy();
		}

		const num2 = Vector3.dot(vector, planeNormal);
		return new Vector3(
			vector.x - (planeNormal.x * num2) / num,
			vector.y - (planeNormal.y * num2) / num,
			vector.z - (planeNormal.z * num2) / num
		);
	}

	public static angle(from: Vector3, to: Vector3) {
		const num = Math.sqrt(from.sqrMagnitude * to.sqrMagnitude);
		if (num < Vector3.kEpsilonNormalSqrt) {
			return 0;
		}

		const dot = Math.clamp(Vector3.dot(from, to) / num, -1, 1);
		return Math.acos(dot) * 57.29578;
	}

	public static signedAngle(from: Vector3, to: Vector3, axis: Vector3) {
		const num = Vector3.angle(from, to);
		const num2 = from.y * to.z - from.z * to.y;
		const num3 = from.z * to.x - from.x * to.z;
		const num4 = from.x * to.y - from.y * to.x;
		const num5 = Math.sign(num2 * axis.x + num3 * axis.y + num4 * axis.z);

		return num * num5;
	}

	public static distance(a: Vector3, b: Vector3) {
		const num = a.x - b.x;
		const num2 = a.y - b.y;
		const num3 = a.z - b.z;
		return Math.hypot(num, num2, num3);
	}

	public static clampMagnitude(vector: Vector3, maxLength: number) {
		const num = vector.sqrMagnitude;
		if (num > maxLength * maxLength) {
			const num2 = Math.sqrt(num);
			const num3 = vector.x / num2;
			const num4 = vector.y / num2;
			const num5 = vector.z / num2;
			return new Vector3(num3 * maxLength, num4 * maxLength, num5 * maxLength);
		}

		return vector.copy();
	}

	/**
	 * @deprecated Use Vector3.angle instead. angleBetween uses radians instead of degrees and was deprecated for this reason.
	 */
	public static angleBetween(from: Vector3, to: Vector3) {
		return Math.acos(
			Math.clamp(Vector3.dot(from.normalized, to.normalized), -1, 1)
		);
	}

	public static min(a: Vector3, b: Vector3) {
		return new Vector3(
			Math.min(a.x, b.x),
			Math.min(a.y, b.y),
			Math.min(a.z, b.z)
		);
	}

	public static max(a: Vector3, b: Vector3) {
		return new Vector3(
			Math.max(a.x, b.x),
			Math.max(a.y, b.y),
			Math.max(a.z, b.z)
		);
	}

	public static floor(v: Vector3) {
		return new Vector3(Math.floor(v.x), Math.floor(v.y), Math.floor(v.z));
	}

	public static ceil(v: Vector3) {
		return new Vector3(Math.ceil(v.x), Math.ceil(v.y), Math.ceil(v.z));
	}

	public static round(v: Vector3) {
		return new Vector3(Math.round(v.x), Math.round(v.y), Math.round(v.z));
	}

	public static add(a: Vector3, b: Vector3 | number) {
		return b instanceof Vector3
			? new Vector3(a.x + b.x, a.y + b.y, a.z + b.z)
			: new Vector3(a.x + b, a.y + b, a.z + b);
	}

	public add(b: Vector3 | number) {
		return this.set(Vector3.add(this, b));
	}

	public static subtract(a: Vector3, b: Vector3 | number) {
		return b instanceof Vector3
			? new Vector3(a.x - b.x, a.y - b.y, a.z - b.z)
			: new Vector3(a.x - b, a.y - b, a.z - b);
	}

	public subtract(b: Vector3 | number) {
		return this.set(Vector3.subtract(this, b));
	}

	public static multiply(a: Vector3, b: Vector3 | number) {
		return b instanceof Vector3
			? new Vector3(a.x * b.x, a.y * b.y, a.z * b.z)
			: new Vector3(a.x * b, a.y * b, a.z * b);
	}

	public multiply(b: Vector3 | number) {
		return this.set(Vector3.multiply(this, b));
	}

	public static divide(a: Vector3, b: Vector3 | number) {
		return b instanceof Vector3
			? new Vector3(a.x / b.x, a.y / b.y, a.z / b.z)
			: new Vector3(a.x / b, a.y / b, a.z / b);
	}

	public divide(b: Vector3 | number) {
		return this.set(Vector3.divide(this, b));
	}

	public static negate(v: Vector3) {
		return new Vector3(-v.x, -v.y, -v.z);
	}

	public negate() {
		return this.set(Vector3.negate(this));
	}

	public static abs(v: Vector3) {
		return new Vector3(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z));
	}

	public abs() {
		return this.set(Vector3.abs(this));
	}

	// Class string tag
	public get [Symbol.toStringTag]() {
		return "Vector3";
	}

	// Indexer property
	public get 0() {
		return this.x;
	}

	public get 1() {
		return this.y;
	}

	public get 2() {
		return this.z;
	}

	public set 0(value) {
		this.x = value;
	}

	public set 1(value) {
		this.y = value;
	}

	public set 2(value) {
		this.z = value;
	}

	// Iterator
	public *[Symbol.iterator]() {
		yield this.x;
		yield this.y;
		yield this.z;
	}

	// Creation utility
	public static fromArray(array: [number, number, number]) {
		return new Vector3(array[0], array[1], array[2]);
	}

	public static toArray(vector: Vector3) {
		return [vector.x, vector.y, vector.z];
	}

	public static fromObject(obj: { x: number; y: number; z: number }) {
		return new Vector3(obj.x, obj.y, obj.z);
	}

	public static toObject(vector: Vector3) {
		return { x: vector.x, y: vector.y, z: vector.z };
	}

	public static fromString(s: string) {
		const [x, y, z] = s
			.slice(1, -1)
			.split(",")
			.map((n) => Number.parseFloat(n));
		return new Vector3(x, y, z);
	}

	public static toString(vector: Vector3) {
		return vector.toString();
	}

	public static fromVector(vector: Vector3) {
		return vector.copy();
	}

	public toString() {
		return `(${this.x}, ${this.y}, ${this.z})`;
	}
}

export const Vec3 = Vector3;
