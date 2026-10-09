//config.ts
import { RefreshResponse } from "./types/AuthTypes.ts";
import { KEY } from "../app/store";
// const AUTH_KEY = "biz_auth";


export function getBaseUrl():{backendBaseUrl:string,frontendBaseUrl:string} {
    // const BACKEND_BASE_URL:string="http://16.192.105.205:8080/api"
    const BACKEND_BASE_URL:string="https://d3t9f2p14df2uo.cloudfront.net/api"
    const FRONTEND_BASE_URL:string="http://localhost:3001/api"
    return {backendBaseUrl:BACKEND_BASE_URL,frontendBaseUrl:FRONTEND_BASE_URL}
}




interface Tokens {
  accessToken?: string;
  refreshToken?: string;
}
// import { getBaseUrl } from "./config"; // adjust to your project

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

/** HTTP methods the request helper supports. */
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Optional settings for a single request. Everything here is optional. */
interface RequestOptions {
  method?: HttpMethod; // defaults to "GET"
  body?: unknown; // any JSON-serialisable value; stringified automatically
  headers?: Record<string, string>; // extra headers, merged over getHeaders()
  query?: Record<string, string | number | boolean | undefined>; // becomes ?key=value
  signal?: AbortSignal; // lets you cancel the request (e.g. on component unmount)
  auth?: boolean; // true=send access token as a Bearer header
  resource?: string;
  // false=don't send any auth headers
}

/** Settings a subclass can pass to the BaseApi constructor to override defaults. */
interface ApiConfig {
  resource?: string; // route segment for this API, e.g. "auth" -> /v1/auth
  apiVersion?: string; // defaults to "v1"
  backendBaseUrl?: string; // defaults to getBaseUrl().backendBaseUrl
  frontendBaseUrl?: string; // defaults to getBaseUrl().frontendBaseUrl
}

/* ------------------------------------------------------------------ */
/* Error type                                                          */
/* ------------------------------------------------------------------ */

/**
 * Thrown whenever the server responds with a non-2xx status.
 * Lets callers check `err.status` (e.g. 401) or read `err.data` (the parsed
 * response body) instead of parsing a generic Error message.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
    message: string,
    public code?: string // e.g. "INVALID_CREDENTIALS"
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/* ------------------------------------------------------------------ */
/* Base class                                                          */
/* ------------------------------------------------------------------ */

/**
 * Shared foundation for all API classes (AuthApi, UsersApi, ...).
 * Holds the common config and a default `request()` method so subclasses
 * don't repeat the same boilerplate.
 */
export class BaseApi {
  // `protected` = accessible in this class and subclasses, but not from outside.
  protected backendBaseUrl: string;
  protected frontendBaseUrl: string;
  protected apiVersion: string;
  protected resource: string;

  constructor(config: ApiConfig = {}) {
    // Fetch the environment-specific URLs once.
    const defaults = getBaseUrl();

    // `??` uses the override if provided, otherwise falls back to the default.
    this.backendBaseUrl = config.backendBaseUrl ?? defaults.backendBaseUrl;
    this.frontendBaseUrl = config.frontendBaseUrl ?? defaults.frontendBaseUrl;
    this.apiVersion = config.apiVersion ?? "v1";
    this.resource = config.resource ?? "";
  }

  private static refreshPromise: Promise<void> | null = null;

  // The app sets this to sign the user out when the session can't be recovered.
  static onSessionExpired: (() => void) | null = null;
  /**
   * Full URL prefix for this API, e.g. "https://api.example.com/v1/auth".
   * Built from base URL + version + resource, with stray slashes cleaned up.
   */
  protected buildRoute(resource: string = this.resource): string {
  return [this.backendBaseUrl, this.apiVersion, resource]
    .filter(Boolean)
    .map((part) => part.replace(/^\/+|\/+$/g, ""))
    .join("/")
    .replace(/^(https?):\/(?!\/)/, "$1://");
}


  /**
   * Default headers sent with every request.
   * Override this in a subclass to add things like an Authorization token
   * or a tenant ID:
   *   protected getHeaders() {
   *     return { ...super.getHeaders(), Authorization: `Bearer ${token}` };
   *   }
   */
  protected getHeaders(): Record<string, string> {
    return { "Content-Type": "application/json" };
  }
  
  /**
   * Default method for making API requests.
   * @param path    Route relative to baseRoute, e.g. "login" or "/login".
   * @param options Method, body, headers, query params, abort signal.
   * @returns       The parsed JSON response, typed as T.
   * @throws        ApiError if the server returns a non-2xx status.
   */

    private async send<T = unknown>(
    path: string,
    { method = "GET", body, headers, query, signal, resource , auth = false, }: RequestOptions = {}
  ): Promise<T> {
    const url = new URL(`${this.buildRoute(resource)}/${path.replace(/^\/+/, "")}`);

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) url.searchParams.set(key, String(value));
      });
    }

    const requestHeaders: Record<string, string> = {
      ...this.getHeaders(),
      ...headers,
    };

    if (auth) {
      const { accessToken } = this.getTokens();
      if (!accessToken) {
        throw new ApiError(401, null, "You are not signed in", "NO_TOKEN");
      }
      requestHeaders.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(url.toString(), {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data,
        data?.error?.message ?? data?.message ?? `Request failed with status ${response.status}`,
        data?.error?.code
      );
    }
    return data as T;
  }
  protected async request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    try {
      return await this.send<T>(path, options);
    } catch (err) {
      const shouldRefresh =
        options.auth &&
        err instanceof ApiError &&
        err.status === 401 &&
        !!this.getTokens().refreshToken;

      if (!shouldRefresh) throw err;

      await this.refreshTokens();          // throws if the refresh fails
      return this.send<T>(path, options);  // retry once with the new token
    }
  }

  private refreshTokens(): Promise<void> {
    BaseApi.refreshPromise ??= this.doRefresh().finally(() => {
      BaseApi.refreshPromise = null;
    });
    return BaseApi.refreshPromise;
  }

  private async doRefresh(): Promise<void> {
    const { refreshToken } = this.getTokens();

    const base = this.backendBaseUrl.replace(/\/+$/, "");
    const response = await fetch(`${base}/${this.apiVersion}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      this.clearTokens();
      BaseApi.onSessionExpired?.(); // tell the app to sign the user out
      throw new ApiError(401, null, "Your session has expired. Please sign in again.", "SESSION_EXPIRED");
    }

    const { data } = (await response.json()) as RefreshResponse;
    this.storeTokens(data.accessToken, data.refreshToken);
  }

  // Read the whole config object. Returns {} if it's missing or corrupted,
  // so a bad value in storage can't crash the app.
  private readConfig(): Record<string, unknown> {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? "{}") ?? {};
    } catch {
      return {};
    }
  }

  // Merge the tokens into the existing object instead of replacing it.
  storeTokens(accessToken: string, refreshToken: string) {
    const config = this.readConfig();
    // console.log(`THis is the config: ${JSON.stringify(config)}`)
    console.log(`THddis is the accessToken: ${accessToken}`)
    console.log(`THis is the refreshToken: ${refreshToken}`)

    localStorage.setItem(
      KEY,
      JSON.stringify({ ...config, accessToken, refreshToken })
    );
  }

  getTokens(): Tokens {
    const { accessToken, refreshToken } = this.readConfig() as Tokens;
    return { accessToken, refreshToken };
  }

  // For logout: remove only the tokens and keep the rest of the config.
  clearTokens() {
    const { accessToken, refreshToken, ...rest } = this.readConfig();
    localStorage.setItem(KEY, JSON.stringify(rest));
  }
}




/* ------------------------------------------------------------------ */
/* Example: overriding defaults in another API class                   */
/* ------------------------------------------------------------------ */

// class UsersApi extends BaseApi {
//   constructor() {
//     // Different resource AND a different API version.
//     super({ resource: "users", apiVersion: "v2" });
//   }
//
//   // Add an auth token to every request made by this class.
//   protected getHeaders() {
//     return { ...super.getHeaders(), Authorization: `Bearer ${getToken()}` };
//   }
//
//   // GET <backend>/v2/users?page=1
//   list() {
//     return this.request<User[]>("", { query: { page: 1 } });
//   }
// }