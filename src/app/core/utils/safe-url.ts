/**
 * Safe URL validation and opening utility [SECURITY 3.4]
 * Ensures only http: and https: protocols are opened and applies noopener,noreferrer
 */
export function isSafeHttpUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'https://example.com');
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export function openSafeExternalLink(url: string): boolean {
  if (!url || typeof window === 'undefined') return false;
  const trimmed = url.trim();
  
  if (!isSafeHttpUrl(trimmed)) {
    console.warn('Blocked unsafe URL scheme navigation:', trimmed);
    return false;
  }
  
  window.open(trimmed, '_blank', 'noopener,noreferrer');
  return true;
}
