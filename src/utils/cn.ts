/**
 * Combina nombres de clases CSS de manera condicional
 */
export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}
