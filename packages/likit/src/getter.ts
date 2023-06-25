export type Slot = { key?: string, slot?: string, value?: unknown, index?: number, start?: number, end?: number, step?: number }

export function getBy(object: any, ...slots: Slot[]): any {
  if (object === undefined || slots.length === 0) {
    return object;
  } else {
    const [{ key, index, slot, value, start, end, step }, ...rest] = slots;
    if (key !== undefined) {
      return getBy(object[key], ...rest);
    } else if (index !== undefined) {
      return getBy(object[index >= 0 ? index : object.length + index], ...rest);
    } else if (start || end || step) {
      return getBy(slice(object, start, end, step));
    } else if (slot) {
      for (const item of object) {
        if (item && item[slot] === value) {
          return getBy(item, ...rest);
        }
      }
    }
  }
  return undefined;
}

export function withLimit(n: number, lower?: number, upper?: number) {
  if (lower !== undefined && n < lower) n = lower;
  if (upper !== undefined && n > upper) n = upper;
  return n;
}

export function slice(array: Array<unknown>, start?: number, end?: number, step: Exclude<number, 0> = 1, strict = true) {
  if (start === undefined) {
    start = step > 0 ? 0 : array.length - 1;
  } else if (start < 0) {
    start += array.length;
    strict && start < 0 && (start = 0);
  }
  if (end === undefined) {
    end = step < 0 ? -1 : array.length;
  } else if (end < 0) {
    end += array.length;
    strict && end < 0 && (end = 0);
  }
  return [...range(start, end, step)].map(i => array[i]);
}

export function* range(start: number, end: number, step: Exclude<number, 0> = 1) {
  if ((start < end && step < 0) || (start > end && step > 0)) return;
  if (step === 0) while (true) yield start;
  const escape = step > 0 ? (i: number) => i >= end : (i: number) => i <= end;
  for (let i = start; !escape(i); i += step) {
    yield i;
  }
}

// DONE: "sdf.qwe[0](id@ss-ss)"
// DONE: [0:1:1]
// TODO: [id@sdf - sdg]
const KEY_PATTERN = RegExp(/\[(?<start>-?\d)?:(?<end>-?\d+)?(:(?<step>-?\d+))?\]|\[(?<index>-?\d+)\]|\((?<slot>\w+)@(?<value>[^()]+)\)|(?<key>\w+)/g);
export function parseGetter(key: string) {
  const matched = key.matchAll(KEY_PATTERN);
  const results: Array<Slot> = [];

  for (const { groups } of matched) {
    if (!groups) continue;
    results.push({
      key: groups.key,
      slot: groups.slot,
      value: groups.value,
      index: groups.index ? Number.parseInt(groups.index) : undefined,
      start: groups.start ? Number.parseInt(groups.start) : undefined,
      end: groups.end ? Number.parseInt(groups.end) : undefined,
      step: groups.step ? Number.parseInt(groups.step) : undefined
    });
  }
  return results;
}
