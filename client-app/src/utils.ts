export const getLocalDateTime = () => {
  let d = new Date()
  return d.toLocaleDateString() + " " + d.toLocaleTimeString()
}

// This would be easier using the spread operator: const a = new Map([...b])
// but this is not yet supported by TypeScript and we're trying to avoid running Babel after Typescript
export const copyMap = (m) => {
  const map2 = new Map()
  m.forEach((v, k) => map2.set(k, v))
  return map2
}

// take a list of T. Call fn(T):K on each item to extract the key.
// make a map<K,T> mapping the keys to the values
export const listToMap = <T, K>(list: T[], fn: (T) => K): Map<K, T> => {
  const map = new Map<K, T>()
  list.forEach(item => {
    const key = fn(item)
    map.set(key, item)
  })
  return map
}

// take a Map<K,T>. Add items from a list of T where the key does not already exist. Use the selector fn to get the key.
//export const addToMap = <T, K> (map: Map<K,T>, list: T[], fn: (T) => K) : Map<K,T>  => {
//  list.forEach(item => {
//    const key = fn(item)
//    if (! map.has(key)) {
//      map.set(key, item)
//    }
//  })
//  return map
//}

// take a list of T. Call fn(T):S on each item to obtain a sub-value
// make a set<S>
export const listToSet = <T, S>(list: T[], fn: (T) => S): Set<S> => {
  const set = new Set<S>()
  list.forEach(item => {
    const s = fn(item)
    set.add(s)
  })
  return set
}

export const mapToList = <K, V>(map: Map<K, V>): V[] => {
  let list = Array.from(map.values())
  return list
}

// Return the best possible error message from an object that may or not be an error object.
export const getError = (e) => {
  if (!e) {
    return "Error"
  }
  if (typeof e === "string") {
    try {
      let e2 = JSON.parse(e)
      if (e2["odata.error"]) {
        let e3 = e2["odata.error"]
        if (e3.message) {
          if (e3.message.value) {
            let e4 = e3.message.value
            if (e4.startsWith('The specified name is already in use.')) {
              e4 = "Duplicate file name."
            }
            return e4
          }
          return e3.message
        }
        // it's JSON, but we don't kno what keys to look for, so just return
        // the original JSON string
        return e
      }
    } catch (error) {
      // not JSON encoded, just return the string
      return e
    }
  }
  // not a string, just convert to a string
  return e.toString()
}

// If string is longer than maxLength, truncate it around maxLength characters,
// but try to truncate at a word boundary
export const createGlimpse = (str: string, maxLength) => {
  if (!str || str.length < maxLength) {
    return str
  }
  let spaceIdx = str.indexOf(' ', maxLength - 10)
  if (spaceIdx <= maxLength) {
    return str.substr(0, spaceIdx) + " ..."
  }
  return str.substr(0, maxLength) + "..."
}

// GA global window variable
declare global {
  interface Window {
    dataLayer: any
  }
}

export const GADataLayer = () => {
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer
}