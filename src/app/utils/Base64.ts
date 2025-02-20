export function encodeBase64url(data: Uint8Array): string {
  const content = data.reduce((acc, current) => acc + String.fromCharCode(current), '');
  return btoa(content).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
