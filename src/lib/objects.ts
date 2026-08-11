// SPDX-License-Identifier: AGPL-3.0-or-later
type PlainObject = Record<string, unknown>;

export function deepMergeJSON(...objects: PlainObject[]): PlainObject {
  const deepCopyObjects = objects.map((object) => JSON.parse(JSON.stringify(object)) as PlainObject);
  const result: PlainObject = {};
  for (const current of deepCopyObjects) {
    Object.assign(result, current);
  }
  return result;
}

export default function deepMerge(obj1: PlainObject, obj2: PlainObject): PlainObject {
  const result: PlainObject = { ...obj1 };

  for (const key in obj2) {
    const next = obj2[key];
    const prev = obj1[key];
    if (
      next !== null &&
      typeof next === 'object' &&
      !Array.isArray(next) &&
      prev !== null &&
      typeof prev === 'object' &&
      !Array.isArray(prev)
    ) {
      result[key] = deepMerge(prev as PlainObject, next as PlainObject);
    } else {
      result[key] = next;
    }
  }

  return result;
}
