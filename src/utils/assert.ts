export function keyExists(value: Record<string, unknown>, key: string): key is keyof typeof value {
  return key in value;
}
