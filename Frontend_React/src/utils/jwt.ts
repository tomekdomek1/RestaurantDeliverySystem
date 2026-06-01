import { jwtDecode } from 'jwt-decode';

/**
 * Decode JWT token and extract claims
 * Note: Does NOT validate signature - only decodes the payload
 * Use only for reading non-sensitive claims
 */
export function decodeJwt(token: string): Record<string, any> | null {
  try {
    return jwtDecode<Record<string, any>>(token);
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
  // 'sub' claim typically contains email, but check for other common email claim names too
  return payload?.sub || payload?.email || payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || null;
}

/**
 * Extract user roles from JWT token
 */
export function getRolesFromToken(token: string): string[] {
  const payload = decodeJwt(token);
  if (!payload) {
    return [];
  }

  const roleClaimKeys = [
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
    'role',
    'roles',
  ];

  const roles = roleClaimKeys.flatMap((key) => {
    const value = payload[key];
    if (typeof value === 'string') {
      return [value];
    }
    if (Array.isArray(value)) {
      return value.filter((entry): entry is string => typeof entry === 'string');
    }
    return [];
  });

  return Array.from(new Set(roles));
}
