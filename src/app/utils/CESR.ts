import canonicalize from 'canonicalize';
import { encodeBase64url } from './Base64';

/**
 * see https://github.com/e-id-admin/open-source-community/blob/main/tech-roadmap/rfcs/oca/appendixes/cesr-sha256-encoder.md
 * for a longer explanation
 */
export async function computeSHA256CESRDigest(captureBaseObj: unknown): Promise<string> {
  const canonicalizedObj = canonicalize(captureBaseObj);

  if (canonicalizedObj === undefined) {
    throw Error('Could not canonicalize the Capture Base.');
  }

  const encoder = new TextEncoder();
  const rawDigestBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(canonicalizedObj));
  const rawDigest = new Uint8Array(rawDigestBuffer);
  const bytes = new Uint8Array(rawDigest.length + 1);
  bytes[0] = 0;
  for (let i = 0; i < rawDigest.length; i++) {
    bytes[i + 1] = rawDigest[i];
  }

  const base64Digest = encodeBase64url(bytes);
  return 'I' + base64Digest.substring(1);
}
