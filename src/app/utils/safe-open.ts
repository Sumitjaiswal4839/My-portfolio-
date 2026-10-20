const ALLOWED_MIME = new Set([
  'application/pdf', 'image/png', 'image/jpeg', 'image/gif', 'image/webp',
]);

/** http/https seedha kholta hai. data: URL ko Blob mein badalkar kholta hai (sirf pdf/image). Baaki sab reject. */
export function openFileSafely(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    if (url.startsWith('data:')) {
      const comma = url.indexOf(',');
      if (comma < 0) return false;
      const meta = url.slice(5, comma).toLowerCase(); // "application/pdf;base64"
      const [mime, enc] = meta.split(';');
      if (!ALLOWED_MIME.has(mime) || enc !== 'base64') return false;
      const bin = atob(url.slice(comma + 1));
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const blobUrl = URL.createObjectURL(new Blob([bytes], { type: mime }));
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
      return true;
    }
    const u = new URL(url);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    window.open(u.href, '_blank', 'noopener,noreferrer');
    return true;
  } catch {
    return false;
  }
}
