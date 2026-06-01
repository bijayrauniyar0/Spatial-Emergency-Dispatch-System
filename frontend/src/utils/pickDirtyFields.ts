/**
 * Picks only the fields from `data` that are marked as dirty in `dirtyFields`.
 *
 * @param data - Full form values
 * @param dirtyFields - react-hook-form dirtyFields object
 * @returns Partial object containing only changed fields
 */
export function pickDirtyFields<T>(
  data: T,
  dirtyFields: Partial<Record<keyof T, boolean>>,
): Partial<T> {
  return Object.keys(dirtyFields).reduce((acc, key) => {
    if (dirtyFields[key as keyof T]) {
      acc[key as keyof T] = data[key as keyof T];
    }
    return acc;
  }, {} as Partial<T>);
}
