import axios from 'axios';

export type GrantTypes = 'client_credentials' | 'password' | 'refresh_token';

export interface Credentials {
  username?: string;
  password?: string;
  grantType: GrantTypes;
  clientId: string;
  clientSecret?: string;
  totp?: string;
  offlineToken?: boolean;
  refreshToken?: string;
  scopes?: string[];
}

export interface Settings {
  realmName?: string;
  baseUrl?: string;
  scope?: string;
  credentials: Credentials;
  requestOptions?: RequestInit;
}

export interface TokenResponseRaw {
  access_token: string;
  expires_in: string;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  not_before_policy: number;
  session_state: string;
  scope: string;
  id_token?: string;
}

export interface TokenResponse {
  accessToken: string;
  expiresIn: string;
  refreshExpiresIn: number;
  refreshToken: string;
  tokenType: string;
  notBeforePolicy: number;
  sessionState: string;
  scope: string;
  idToken?: string;
}

// See: https://developer.mozilla.org/en-US/docs/Glossary/Base64
const bytesToBase64 = (bytes: Uint8Array) =>
  btoa(Array.from(bytes, (byte) => String.fromCodePoint(byte)).join(''));
const toBase64 = (input: string) =>
  bytesToBase64(new TextEncoder().encode(input));

// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#encoding_for_rfc3986
const encodeRFC3986URIComponent = (input: string) =>
  encodeURIComponent(input).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );

// See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
// Specifically, the section on encoding `application/x-www-form-urlencoded`.
const encodeFormURIComponent = (data: string) =>
  encodeRFC3986URIComponent(data).replaceAll('%20', '+');

export const getToken = async (settings: Settings): Promise<TokenResponse> => {
  // Construct URL
  const baseUrl = settings.baseUrl;
  const realmName = settings.realmName;

  // Prepare credentials for openid-connect token request
  // ref: http://openid.net/specs/openid-connect-core-1_0.html#TokenEndpoint
  const credentials = settings.credentials || ({} as any);

  // const options = settings.requestOptions ?? {};

  // const headers = new Headers(options.headers);
  const headers: Record<string, string> = {};

  if (credentials.clientSecret) {
    // See: https://datatracker.ietf.org/doc/html/rfc6749#section-2.3.1
    const username = encodeFormURIComponent(credentials.clientId);
    const password = encodeFormURIComponent(credentials.clientSecret);

    // See: https://datatracker.ietf.org/doc/html/rfc2617#section-2
    // headers.set(
    //   'authorization',
    //   `Basic ${toBase64(`${username}:${password}`)}`,
    // );
    headers['Authorization'] = `Basic ${toBase64(`${username}:${password}`)}`;
  }

  // headers.set('content-type', 'application/x-www-form-urlencoded');
  headers['Content-Type'] = 'application/x-www-form-urlencoded';

  const response = await axios.post<TokenResponseRaw>(
    `${baseUrl}/realms/${realmName}/protocol/openid-connect/token`,
    {
      username: credentials.username,
      password: credentials.password,
      grant_type: credentials.grantType,
      client_id: credentials.clientId,
      totp: credentials.totp,
      ...(credentials.offlineToken ? { scope: 'offline_access' } : {}),
      ...(credentials.scopes ? { scope: credentials.scopes.join(' ') } : {}),
      ...(credentials.refreshToken
        ? {
            refresh_token: credentials.refreshToken,
            client_secret: credentials.clientSecret,
          }
        : {}),
    },
    {
      headers,
    },
  );
  const data = response.data;
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    refreshExpiresIn: data.refresh_expires_in,
    refreshToken: data.refresh_token,
    tokenType: data.token_type,
    notBeforePolicy: data.not_before_policy,
    sessionState: data.session_state,
    scope: data.scope,
    idToken: data.id_token,
  };
};
