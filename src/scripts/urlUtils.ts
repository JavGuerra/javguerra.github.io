export function getSlugName(url: string) {
  const parts = url.split('/');
  const lastPart = parts.pop() || '';
  const nameParts = lastPart.split('.');
  return nameParts.shift() || '';
}
