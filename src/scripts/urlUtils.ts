export function getSlugName(url: string) {
  const parts = url.split('/');
  const lastPart = parts.pop() || '';
  const nameParts = lastPart.split('.');
  return nameParts.shift() || '';
}

export function generateUniqueId() {
  return 'back-link-' + Date.now().toString(36) + Math.random().toString(36).slice(2);
}
