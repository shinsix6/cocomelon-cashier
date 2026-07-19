/**
 * Combine class names conditionally, skipping falsy values.
 * Usage: cn('base', condition && 'extra', anotherCondition ? 'a' : 'b')
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default cn;
