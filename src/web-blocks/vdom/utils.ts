export const isArray = Array.isArray;

export function isText(s: any): boolean {
  return (
    typeof s === "string" ||
    typeof s === "number" ||
    typeof s === "boolean"
  );
}

export function isEmpty(s: any): boolean {
  return (typeof s === 'undefined' || s === null);
}
