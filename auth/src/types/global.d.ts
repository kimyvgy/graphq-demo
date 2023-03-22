export {};

declare global {
  // See: https://www.iana.org/assignments/jwt/jwt.xhtml#claims
  type JWTPayload = Partial<RegisteredClaims> & UserProfile & HasuraSessionVars;

  interface RegisteredClaims {
    /** Issuer of the JWT */
    iss: string;
    /** Subject of the JWT (the user) */
    sub: string;
    /** Recipient for which the JWT is intended */
    aud: string;
    /** Time at which the JWT was issued; can be used to determine age of the JWT */
    iat: number;
    /** Time after which the JWT expires */
    exp: number;
  }

  // See: https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
  interface UserProfile {
    /** End-User's full name in displayable form including all name parts, possibly including titles and suffixes */
    name: string;
    /** Shorthand name by which the End-User wishes to be referred to at the RP, such as janedoe or j.doe */
    preferred_username: string;
    /** URL of the End-User's profile picture */
    picture: string;
    /** End-User's preferred e-mail address: RFC-5322 */
    email: string;
    /** True if the End-User's e-mail address has been verified; otherwise false */
    email_verified: boolean;
    /** End-User's gender: female / male */
    gender: string;
    /** End-User's birthday, represented as an ISO 8601:2004 */
    birthdate: string;
    /** Time the End-User's information was last updated */
    updated_at: number;
  }

  interface HasuraSessionVars {
    user_id: string;
    default_role: string;
    allowed_roles: string[];
  }
}
