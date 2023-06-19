type Slot = { key?: string, slot?: string, value?: unknown, index?: number }

export function getBy(object: any, ...slots: Slot[]): any {
  if (object === undefined || slots.length === 0) {
    return object
  } else {
    const [{
      key,
      index,
      slot,
      value
    }, ...rest] = slots
    if (key !== undefined) {
      return getBy(object[key], ...rest)
    } else if (index !== undefined) {
      return getBy(object[index], ...rest)
    } else if (slot) {
      for (const item of object) {
        if (item && item[slot] === value) {
          return getBy(item, ...rest)
        }
      }
    }
  }
  return undefined
}

// "sdf.qwe[0](id@ss-ss)"
// TODO: "[0:1:1][id@sdf-sdg]"
const KEY_PATTERN = RegExp(/\[(?<index>\d+)\]|\((?<slot>\w+)@(?<value>[^\(\)]+)\)|(?<key>\w+)/g)
export function parseGetter(key: string) {
  const matched = key.matchAll(KEY_PATTERN)
  const results: Array<Slot> = []

  for (const { groups } of matched) {
    if (!groups) continue
    results.push({
      key: groups.key,
      slot: groups.slot,
      value: groups.value,
      index: groups.index ? Number.parseInt(groups.index) : undefined
    })
  }
  return results
}
