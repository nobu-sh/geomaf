import test from "ava";

import { Vector2 } from "../dist/vec2";

test("vec2", (t) => {
	const vec = new Vector2(1, 2);
	t.is(vec.x, 1);
	t.is(vec.y, 2);

	t.deepEqual(Vector2.add(vec, 2), new Vector2(3, 4));

	vec.add(2);
	t.deepEqual(vec, new Vector2(3, 4));
});
