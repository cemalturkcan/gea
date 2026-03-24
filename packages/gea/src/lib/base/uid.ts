let counter = Math.floor(Math.random() * 2147483648)

const getUid = (): string => (counter++).toString(36)

/** Reset the UID counter to a deterministic seed. Used by SSR to ensure
 *  server and client produce matching component IDs. */
export function resetUidCounter(seed: number = 0): void {
  counter = seed
}

export default getUid
