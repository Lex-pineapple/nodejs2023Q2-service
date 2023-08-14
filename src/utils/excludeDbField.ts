export function excludeField(object: Record<string, any>, keys: string[]) {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !keys.includes(key)),
  );
}
