export interface UserProfile {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

export interface GetProfilePayload {
  // Empty - profile endpoint doesn't require payload
}
