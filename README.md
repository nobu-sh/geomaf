# geomaf

A handful of geometry and other math related tools I use in vanilla js game engine stuff.

### ⚠️ Package is still in early stages. Nothing has been exhaustively tested, some things not tested at all. Still a WIP!

## Installation

```
npm i geomaf
```

## Usage

```ts
import { Vec3 } from 'geomaf';

const vec = Vec3.zero;
console.log(vec);

vec.add(2);
console.log(vec);

```

## Code Splitting
Everything is individually bundled. Get those performance gains and import only what you need.

```ts
import { Vector3 } from 'geomaf/vec3';

console.log(Vector3.multiply(Vector3.zero, 69));
```


