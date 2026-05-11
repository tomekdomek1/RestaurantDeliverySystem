/**
 * Decode JWT token and extract claims
 * Note: Does NOT validate signature - only decodes the payload
 * Use only for reading non-sensitive claims
 */
export function decodeJwt(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed
    const padding = 4 - (payload.length % 4);
    const paddedPayload = payload + (padding < 4 ? '='.repeat(padding) : '');
    
    // Decode from base64url
    const decoded = atob(paddedPayload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Extract user ID from JWT token
 */
export function getUidFromToken(token: string): string | null {
  const payload = decodeJwt(token);
  return payload?.uid || null;
}

/**
 * Extract email from JWT token
 */
export function getEmailFromToken(token: string): string | null {
  const payload = decodeJwt(token);
  return payload?.sub || null; // 'sub' claim typically contains email
}
